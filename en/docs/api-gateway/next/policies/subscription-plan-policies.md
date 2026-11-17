---
title: "Subscription plan policies"
description: "Validate subscriptions and enforce the built-in conditions of subscription plans with subscription-validation v2 and the subscription rate-limit policies."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/policies/subscription-plan-policies/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/policies/subscription-plan-policies.md
tags:
  - api-gateway
  - policies
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "reference"
---

# Subscription plan policies

A subscription plan limits what each subscriber can use through its **conditions**: request count, MCP tool-call count and LLM token count, each with one or more time windows, and custom conditions. The gateway enforces the built-in conditions with these policies. A custom condition is enforced by a policy you write, which reads the condition from what `subscription-validation` v2 records.

| Policy | Version | What it does |
|---|---|---|
| `subscription-validation` | v2 | Checks that the request has an active subscription to the API, and records the subscription, its plan and the plan's conditions for the policies after it. It enforces no limit itself: a plan's request limits need `subscription-request-ratelimit` after it. |
| `subscription-request-ratelimit` | v1 | Enforces the plan's **request count** condition: each request counts one. |
| `subscription-tool-ratelimit` | v1 | Enforces the plan's **tool-call count** condition on MCP proxies: each `tools/call` request counts one. Other MCP methods aren't counted. |
| `subscription-token-ratelimit` | v1 | Enforces the plan's **token count** condition on LLM APIs: the tokens each response reports count against the plan. |

`subscription-validation` v1 is unchanged: it checks the subscription and enforces the plan's single request limit itself.

For how plans and conditions are defined, see [Subscription plans overview](../../../api-control-plane/next/subscription-plans/overview.md).

## Attach the policies

Put `subscription-validation` v2 before the rate-limit policies. If the API uses an authentication policy that records the caller's application (for example an API key or OAuth2 policy), put that policy before `subscription-validation`, which then uses the application when no subscription token is sent. Each rate-limit policy enforces one kind of condition, and lets the request through when the subscriber's plan has no condition of its kind.

=== "REST API"

    ```yaml
    policies:
      - name: subscription-validation
        version: v2
        params:
          subscriptionKeyHeader: Subscription-Key
      - name: subscription-request-ratelimit
        version: v1
    ```

=== "MCP proxy"

    ```yaml
    policies:
      - name: subscription-validation
        version: v2
      - name: subscription-request-ratelimit
        version: v1
      - name: subscription-tool-ratelimit
        version: v1
    ```

=== "LLM proxy"

    ```yaml
    policies:
      - name: subscription-validation
        version: v2
      - name: subscription-request-ratelimit
        version: v1
      - name: subscription-token-ratelimit
        version: v1
    ```

!!! warning "Order matters"
    The rate-limit policies read what `subscription-validation` v2 records. Without it earlier in the chain, they let every request through.

Subscribers send their subscription token in the `Subscription-Key` header, or in the header that `subscriptionKeyHeader` names. A request without an active subscription gets `403`.

### subscription-validation v2 parameters

| Parameter | Default | Description |
|---|---|---|
| `subscriptionKeyHeader` | `Subscription-Key` | The request header that carries the subscription token. |
| `subscriptionKeyCookie` | (none) | Optional cookie that carries the token, read only when the header has none. |

When no token is sent, the policy uses the application identity that an earlier policy recorded. The token header or cookie is removed before the request goes to the backend.

## How limits are enforced

- Every limit of a condition applies, so the strictest window decides. A month is counted as 30 days.
- Counters are kept per subscription and per condition, and are shared by all the API's operations.
- When a plan's limits change, the new limits apply at once, with fresh counters.
- A plan with no conditions, or with no condition of a policy's kind, isn't limited by that policy.

| `onExceed` (Block requests when quota is reached) | Response |
|---|---|
| `reject` (on, the default) | `429 Too Many Requests`. |
| `allow` (off) | The request goes through, and is reported to analytics as over quota. |

The `429` response body looks like this:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Subscription quota exceeded: 100 requests per 1 minute"
}
```

It carries the exceeded window's `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `RateLimit-Policy` and `Retry-After` headers. On MCP proxies, `subscription-tool-ratelimit` answers with a JSON-RPC error (code `-32000`) that carries the request's ID.

| Policy | Fault code | Fault message |
|---|---|---|
| `subscription-request-ratelimit` | `900804` | Subscription plan request limit exceeded |
| `subscription-tool-ratelimit` | `900804` | Subscription plan tool call limit exceeded |
| `subscription-token-ratelimit` | `900804` | Subscription plan token limit exceeded |

### Token counting

`subscription-token-ratelimit` reads the token counts from each LLM response, using the provider's template, as `token-based-ratelimit` does. The condition's token type selects **total**, **prompt** or **completion** tokens.

!!! note
    Tokens are known only when the response arrives. A request is checked against what is left before it runs, and charged afterwards, so the request that uses up the quota can go over it. The next request is rejected.

## Analytics

So that overage can be charged separately, the rate-limit policies record in each counted request's analytics data whether it was within the plan's quota:

| Key | Value | Present |
|---|---|---|
| `x-wso2-subscription-quota-status-<condition>` | `within` or `over` | On every counted request |
| `x-wso2-subscription-quota-action-<condition>` | `allowed` (`onExceed: allow`) or `rejected` (`onExceed: reject`) | When over the quota |
| `x-wso2-subscription-quota-limit-<condition>` | The exceeded window, for example `5 requests per 1 minute` | When over the quota |

`<condition>` is the condition's ID (`requests`, `tool-calls` or `tokens`), so policies on the same request don't overwrite each other. Requests without a subscription, requests whose plan has no condition of the policy's kind, and MCP methods other than `tools/call` carry none of these keys.

!!! info "Limiter failures are never charged as overage"
    If the rate limiter fails, for example when its Redis store is unavailable, the request is not recorded as over quota. With `onExceed: allow`, the request goes through uncounted, whichever `failure_mode` is set. With `onExceed: reject`, `failure_mode` decides: `open` (the default) lets the request through, and `closed` rejects it. In both cases nothing is recorded as overage.

## Write a policy for a custom condition

A custom condition is enforced by a policy you write. `subscription-validation` v2 records the subscriber's plan conditions in the request's shared metadata, and your policy, placed after it, reads them.

| Metadata key | Value |
|---|---|
| `x-wso2-subscription-id` | The subscription's ID. Use it to keep per-subscriber state. |
| `x-wso2-subscription-plan-id` | The plan's ID. |
| `x-wso2-subscription-plan-name` | The plan's name. |
| `x-wso2-subscription-plan-conditions` | The plan's conditions, as a JSON array string. It's `[]` for a plan with no conditions. |

Each condition has an `id`, a `type` and `params`. A custom condition's `id` is its **Condition name**, its `type` is `custom`, and its `params` hold its key-value pairs. If the plan names the policy that enforces the condition, `params.policy` holds that policy's `name` and `version`. Don't use `policy` as one of your own keys.

```json
[
  {"id": "requests", "type": "request-count", "params": {"limits": [{"count": 100, "timeAmount": 1, "timeUnit": "MINUTE"}], "onExceed": "reject"}},
  {"id": "region-limit", "type": "custom", "params": {"zone": "eu", "policy": {"name": "region-guard", "version": "v1"}}}
]
```

To write the policy:

1. Declare the `conditionName` parameter in the policy's `policy-definition.yaml`. Every policy that enforces a custom condition must have this parameter, with exactly this name: it maps the policy to the condition it enforces. When a plan names the policy and the console attaches it, the console sets `conditionName` to the condition's **Condition name** for you. When you attach the policy yourself on the **Policies** page, set `conditionName` there. Because the name comes from the parameter, one policy can serve conditions with any name.

    | Parameter | Type | Required | Description |
    |---|---|---|---|
    | `conditionName` | string | Yes | The **Condition name** of the custom condition the policy enforces, for example `region-limit`. |

    ```yaml
    name: region-guard
    version: v1.0.0
    parameters:
      type: object
      properties:
        conditionName:
          type: string
          description: The Condition name of the custom condition this policy enforces.
          default: region-limit
    ```

2. In the request phase, find the condition by that name, and enforce its values. When the subscriber's plan has no such condition, let the request through, as the built-in policies do.

    ```go
    func (p *RegionGuard) OnRequestHeaders(ctx context.Context, reqCtx *policy.RequestHeaderContext,
        params map[string]interface{}) policy.RequestHeaderAction {
        name, _ := params["conditionName"].(string)
        raw, _ := reqCtx.SharedContext.Metadata["x-wso2-subscription-plan-conditions"].(string)
        var conditions []struct {
            ID     string                 `json:"id"`
            Type   string                 `json:"type"`
            Params map[string]interface{} `json:"params"`
        }
        if raw == "" || json.Unmarshal([]byte(raw), &conditions) != nil {
            return policy.UpstreamRequestHeaderModifications{} // no subscription recorded
        }
        for _, c := range conditions {
            if c.Type == "custom" && c.ID == name {
                zone, _ := c.Params["zone"].(string)
                if zone != "" && reqCtx.Headers.Get("X-Zone") != zone {
                    return &policy.ImmediateResponse{StatusCode: 403,
                        Body: []byte(`{"error":"not allowed in this zone"}`)}
                }
            }
        }
        return policy.UpstreamRequestHeaderModifications{}
    }
    ```

3. Build the policy into your gateway. See [Add the policies to the gateway build](#add-the-policies-to-the-gateway-build), and [Writing a Custom Policy](custom-policies/writing-a-custom-policy.md).
4. Attach it to the API, after `subscription-validation` v2. See [Enforce a custom condition](../../../api-control-plane/next/subscription-plans/attach-plans-to-an-api.md#enforce-a-custom-condition).

## Configure counting

The rate-limit policies share the `[policy_configurations.ratelimit_v1]` section of the gateway configuration with the other rate-limit policies, so they can use the same Redis.

| Parameter | Default | Description |
|---|---|---|
| `algorithm` | `fixed-window` | `fixed-window` (a counter per window) or `gcra` (smooth limiting). |
| `backend` | `memory` | `memory` counts per gateway replica. `redis` counts exactly across replicas. `redis-local-async` counts locally and reconciles with Redis in the background. |
| `redis` | (none) | Redis connection settings. With `failure_mode = "open"` (the default), requests pass when Redis is unavailable; with `closed`, they are rejected. |

```toml
[policy_configurations.ratelimit_v1]
algorithm = "fixed-window"
backend = "redis"

[policy_configurations.ratelimit_v1.redis]
host = "redis.example.com"
port = 6379
key_prefix = "ratelimit:v1:"
failure_mode = "open"
```

## Add the policies to the gateway build

If you build your own gateway image, add the policy modules to `build.yaml`:

```yaml
policies:
  - name: subscription-validation
    gomodule: github.com/wso2/gateway-controllers/policies/subscription-validation/v2@v2
  - name: subscription-request-ratelimit
    gomodule: github.com/wso2/gateway-controllers/policies/subscription-request-ratelimit@v1
  - name: subscription-tool-ratelimit
    gomodule: github.com/wso2/gateway-controllers/policies/subscription-tool-ratelimit@v1
  - name: subscription-token-ratelimit
    gomodule: github.com/wso2/gateway-controllers/policies/subscription-token-ratelimit@v1
```

For more information, see [Building Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md).

## Migrate from subscription-validation v1

`subscription-validation` v1 enforces one request limit per plan: the request count condition's first one-unit window, such as *per 1 minute*. Use v2 with the rate-limit policies to enforce every window and every kind of condition.

!!! warning "Moving from v1 to v2: add subscription-request-ratelimit"
    `subscription-validation` v1 enforces the plan's request limit itself, and v2 doesn't enforce any limit. So when you move an API from v1 to v2 and its plans have request limits, adding `subscription-request-ratelimit` is mandatory. Without it, those limits stop being enforced, including the limits of plans created before conditions, and subscribers can make unlimited requests.

    If every plan on the API is unlimited (has no conditions), v2 needs no rate-limit policy.

1. Change `subscription-validation` to `version: v2`. Its parameters are the same as v1.
2. If the API's plans have request limits, add `subscription-request-ratelimit` v1 after it. This step is mandatory for those plans: under v2, it's what enforces their request limits.
3. On MCP proxies whose plans limit tool calls, add `subscription-tool-ratelimit` v1. On LLM APIs whose plans limit tokens, add `subscription-token-ratelimit` v1.
4. Redeploy the API.

Before (v1):

```yaml
policies:
  - name: subscription-validation
    version: v1
    params:
      subscriptionKeyHeader: Subscription-Key
```

After (v2):

```yaml
policies:
  - name: subscription-validation
    version: v2
    params:
      subscriptionKeyHeader: Subscription-Key
  - name: subscription-request-ratelimit
    version: v1
```

The `403` responses and their fault codes, and the `429` body, headers and fault code, are the same as in v1. Two things differ: counters are kept per subscription rather than per token, and they are shared across gateway replicas when you use a Redis backend.

## Limitations

- In the event gateway, the policy chain runs once per message, so each message counts as one request.
- A month is counted as 30 days.
