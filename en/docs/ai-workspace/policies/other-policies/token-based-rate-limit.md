# Token-Based Rate Limiting

AI services bill on a per-token basis, so uncontrolled usage can lead to unexpected costs. The AI Workspace provides two ways to apply token-based rate limits:

| Approach | Configured Via | Applies To |
|----------|---------------|------------|
| **Built-in Rate Limiting** | Rate Limiting tab on LLM Providers | All proxies using that provider |
| **Token Based Rate Limit Policy** | Guardrails tab on LLM Providers or Proxies | The specific provider or proxy it is attached to |

---

## Built-in Rate Limiting

Configured through the **Rate Limiting** tab on an LLM Provider. Supports limiting by request count and token count.

### Scopes

| Scope | Controls | Status |
|-------|----------|--------|
| **Backend** | Requests from the gateway to the upstream LLM provider | Available |
| **Per Consumer** | Requests from client applications to the gateway | *Coming soon* |

!!! info "Per Consumer Rate Limiting — Coming Soon"
    Only the **Backend** scope is currently configurable.

### Configuration Modes

- **Provider-wide** — A single limit across all API endpoints.
- **Per Resource** — Individual limits per API endpoint.

!!! note
    Provider-wide and Per Resource modes are mutually exclusive. Clear existing limits before switching.

### Limit Criteria

| Criterion | Description |
|-----------|-------------|
| **Request Count** | Maximum requests within the time window |
| **Token Count** | Maximum tokens (prompt + completion) within the time window |
| **Cost** | *(Coming soon)* |

For each criterion, set a **Quota** and a **Reset Duration** (`second`, `minute`, `hour`).

### Configure

1. Navigate to **AI Workspace** > **LLM Providers**.
2. Click on the provider name and go to the **Rate Limiting** tab.
3. Select **Provider-wide** or **Per Resource** under the Backend section.
4. Enable **Request Count** and/or **Token Count**, set the Quota and Reset Duration.
5. For Per Resource: expand **Limit per Resource** for defaults, then expand individual resources to override.
6. Click **Save** and redeploy the provider.

---

## Token Based Rate Limit Policy

A policy attached via the **Guardrails** tab. Tracks prompt tokens, completion tokens, and total tokens separately — giving finer control than the built-in Rate Limiting tab. Can be applied to both LLM Providers and App LLM Proxies.

### Configuration Parameters

Configure limits for any combination of the three token categories. At least one must be specified.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Prompt Token Count** | Conditional | Maximum prompt tokens allowed within the duration. |
| **Completion Token Count** | Conditional | Maximum completion tokens allowed within the duration. |
| **Total Token Count** | Conditional | Maximum combined prompt + completion tokens within the duration. |
| **Duration** | Yes | Time window for the limit (e.g., `60s`, `1m`, `1h`). |

### Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name and go to the **Guardrails** tab.
3. Click **+ Add Guardrail** and select **Token Based Rate Limit**.
4. Configure limits for prompt tokens, completion tokens, total tokens, or any combination.
5. Click **Add** (for providers) or **Submit** (for proxies).
6. Redeploy the provider or proxy to apply the changes.

### Behavior

- Token usage is read from the LLM provider's response (`usage.prompt_tokens`, `usage.completion_tokens`, `usage.total_tokens`).
- When any limit is exceeded, subsequent requests receive `429 Too Many Requests`.
- **When multiple limit rules are configured, the most restrictive limit is enforced.**

---

## Related

- [Manage LLM Provider](../../llm-providers/manage-provider.md#rate-limiting) — Rate Limiting tab reference
- [Rate Limit - Basic](basic-rate-limit.md) — Simple request count-based rate limiting
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version
