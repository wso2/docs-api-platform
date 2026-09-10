# Semantic Prompt Guard

The Semantic Prompt Guard uses vector embeddings and cosine similarity to match incoming prompts against lists of **allowed** and **denied** phrases. Unlike pattern-based guardrails, it understands semantic meaning — it can block prompts that are *similar in meaning* to a denied phrase, even if they use completely different words.

!!! info "Prerequisites"
    Before using this guardrail, the embedding provider must be configured in the gateway's `config.toml`. The policy UI exposes the allowed/denied phrases, thresholds, and JSON path — the embedding connection details are system-level settings.

    See [Gateway Configuration](#gateway-configuration) below for the required `config.toml` settings.

## How It Works

When a request arrives, the guardrail:

1. Uses the configured embedding provider to convert the incoming prompt into a vector.
2. Computes the cosine similarity between the prompt vector and each configured allowed/denied phrase vector.
3. **If allowed phrases are configured** — blocks the request if no allowed phrase is similar enough (below the allow threshold).
4. **If denied phrases are configured** — blocks the request if any denied phrase is similar enough (above the deny threshold).

## Configuration Parameters

All parameters are optional and available under **Advanced Settings**.

| Parameter | Default | Description |
|-----------|---------|-------------|
| **JSON Path** | — | JSONPath expression to extract the prompt from the JSON payload (e.g., `$.message`, `$.data.prompt`). If empty, the entire payload is validated as a string. |
| **Allow Similarity Threshold** | `0.65` | Minimum cosine similarity (0.0–1.0) for a prompt to match an allowed phrase. Higher values require closer matches to pass. |
| **Deny Similarity Threshold** | `0.65` | Minimum cosine similarity (0.0–1.0) for a prompt to match a denied phrase. Prompts at or above this threshold are blocked. |
| **Allowed Phrases** | — | Phrases that represent acceptable prompts. If set, the prompt must be semantically similar to at least one allowed phrase or it is blocked. |
| **Denied Phrases** | — | Phrases that represent unacceptable prompts. If set, any prompt semantically similar to a denied phrase is blocked. |
| **Show Assessment** | `false` | When `true`, the intervention response includes the matched phrase and similarity score. |

## Gateway Configuration

The embedding provider is configured in the gateway's `config.toml` file. These settings apply to all policies that use embeddings.

```toml
embedding_provider = "OPENAI"            # Supported: OPENAI, MISTRAL, AZURE_OPENAI
embedding_provider_endpoint = "https://api.openai.com/v1/embeddings"
embedding_provider_model = "text-embedding-3-small"
embedding_provider_dimension = 1536
embedding_provider_api_key = ""
```

### Supported Embedding Providers

| Provider | `embedding_provider` value | Example endpoint | Example model |
|----------|---------------------------|-----------------|---------------|
| OpenAI | `OPENAI` | `https://api.openai.com/v1/embeddings` | `text-embedding-3-small` |
| Mistral AI | `MISTRAL` | `https://api.mistral.ai/v1/embeddings` | `mistral-embed` |
| Azure OpenAI | `AZURE_OPENAI` | Your Azure OpenAI endpoint URL | Deployment name is in the URL |

## Add This Guardrail

1. Configure the embedding provider in `config.toml` and restart the gateway.
2. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
3. Click on the provider or proxy name.
4. Go to the **Guardrails** tab.
5. Click **+ Add Guardrail** and select **Semantic Prompt Guard** from the sidebar.
6. Add your allowed and/or denied phrases.
7. Adjust similarity thresholds as needed.
8. Click **Add** (for providers) or **Submit** (for proxies).
9. Deploy the provider or proxy to apply the changes.

## Example: Block Off-Topic Prompts

The following configuration uses an allow list to ensure only coding-related prompts are forwarded to the LLM.

| Parameter | Value |
|-----------|-------|
| Allowed Phrases | `["write code", "debug this function", "explain this algorithm", "help with programming"]` |
| Allow Similarity Threshold | `0.60` |
| JSON Path | `$.messages[0].content` |
| Show Guardrail Assessment | `true` |

**Sample request that would be blocked (off-topic):**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is the weather like in London today?"
    }
  ]
}
```

**Intervention response:**

```json
{
  "message": {
    "action": "GUARDRAIL_INTERVENED",
    "actionReason": "Prompt did not match any allowed phrases.",
    "direction": "REQUEST",
    "interveningGuardrail": "Semantic Prompt Guard"
  },
  "type": "SEMANTIC_PROMPT_GUARD"
}
```

## Choosing Similarity Thresholds

| Threshold | Effect |
|-----------|--------|
| **Higher (e.g., 0.85)** | Stricter — only very close semantic matches pass the allow list or trigger the deny list |
| **Lower (e.g., 0.50)** | More permissive — broader matches are accepted/blocked |

Start with the default of `0.65` and adjust based on observed behavior. Enabling **Show Guardrail Assessment** helps you tune thresholds by showing matched phrases and scores.

## Related

- [Guardrails Overview](overview.md)
- [Semantic Cache](../other-policies/semantic-cache.md) — Cache LLM responses using the same embedding infrastructure
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version