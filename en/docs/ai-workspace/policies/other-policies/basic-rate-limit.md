# Rate Limit - Basic

The Rate Limit - Basic policy enforces a simple request count limit on an LLM Provider or Proxy. Use it to cap the total number of requests allowed within a time window, regardless of token consumption.

!!! info "Built-in Rate Limiting vs. Rate Limit - Basic Policy"
    The AI Workspace also has a first-class **Rate Limiting** tab on LLM Providers that provides request count and token count limits on the Backend scope (Per Consumer coming soon). The Rate Limit - Basic policy is a lightweight alternative that can be attached through the Guardrails interface when you need a simple per-route request cap.

## Configuration Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Limits** | Yes | A list of rate limit rules. Each rule specifies the maximum request count and the time window. |
| **Limits[].Count** | Yes | The maximum number of requests allowed within the duration. |
| **Limits[].Duration** | Yes | The time window for the limit (e.g., `60s`, `1m`, `1h`). |

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Rate Limit - Basic** from the sidebar.
5. Add one or more limit rules with a **Count** and **Duration**.
6. Click **Add** (for providers) or **Submit** (for proxies).
7. Deploy the provider or proxy to apply the changes.

## Behavior

- Incoming requests are counted per route or API.
- When the request count exceeds the configured limit within the time window, the gateway returns HTTP `429 Too Many Requests`.
- The counter resets after the duration elapses.
- **When multiple limit rules are configured, the most restrictive limit is enforced.**

## Related

- [Policies Overview](../overview.md)
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version
