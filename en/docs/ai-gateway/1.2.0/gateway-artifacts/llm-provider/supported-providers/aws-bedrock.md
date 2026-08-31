---
title: "AWS Bedrock"
description: "Connect API Platform AI Gateway to AWS Bedrock using a bearer API key or AWS Signature Version 4 authentication, then invoke a model through the gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/aws-bedrock/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/aws-bedrock.md
tags:
  - ai-gateway
  - llm-provider
  - llm
  - aws-bedrock
  - authentication
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# AWS Bedrock

Connect API Platform AI Gateway directly to the regional AWS Bedrock Runtime endpoint. You can authenticate the gateway to Bedrock in either of these ways:

- **Bearer authentication** with an AWS Bedrock API key
- **AWS Signature Version 4 (SigV4)** with IAM credentials or a workload role

Both methods expose the native Bedrock `Converse` and `ConverseStream` operations through the gateway. They use the regional Bedrock Runtime endpoint, not the Bedrock Mantle endpoint. For a base model ID, choose an AWS Region where that model is available, and use the same Region in the Bedrock endpoint, SigV4 policy, and model ID. For an inference profile ID, invoke Bedrock through the source Region endpoint where the profile is supported; the profile may route requests to destination Regions. In this case, the SigV4 Region must match the source Region in the endpoint.

## Connection details

The `awsbedrock` template and these connection settings apply to every Bedrock provider you create:

| Setting | Value |
|---------|-------|
| Template ID | `awsbedrock` |
| Upstream URL | `https://bedrock-runtime.${AWS_REGION}.amazonaws.com` |
| Auth type | `api-key` for a bearer key, or none for SigV4 |
| Auth header | `Authorization` |

Under SigV4, leave `spec.upstream.auth` unset. The `aws-authentication` policy builds the `Authorization` header itself, as described in [Option 2: SigV4 authentication](#option-2-sigv4-authentication).

## Before you begin

Make sure that:

- The AI Gateway is running and its management API is available at `http://localhost:9090/api/management/v1`.
- You have the gateway controller administrator username and password.
- Your model is available to your AWS account in the selected Region.
- You have either an [AWS Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) or an IAM identity that can invoke the model.
- `curl` 7.76.0 or later is installed. Install `jq` as well if you want the commands to capture the generated gateway API key automatically.

Set the gateway administrator credentials:

```bash
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="<gateway-admin-password>"
export AWS_REGION="<aws-region>"
```

For example, set `AWS_REGION` to `us-east-1`, `us-west-2`, or another Region where your selected Bedrock model is available.

## Choose an authentication method

Use the following table to choose the authentication method that matches your gateway environment.

| Method | Recommended use |
|--------|-----------------|
| Bedrock bearer API key | Getting started and development environments |
| SigV4 with the default credential chain | Production gateways running with an Amazon Elastic Compute Cloud (EC2), Amazon Elastic Container Service (ECS), or Amazon Elastic Kubernetes Service (EKS) Pod Identity role |
| SigV4 with IAM Roles for Service Accounts (IRSA) | Gateways running on EKS with IRSA |
| SigV4 with AWS Security Token Service (STS) AssumeRole | Cross-account access or a gateway that must assume a dedicated Bedrock role |
| SigV4 with an IAM access key | Local testing when a workload role is unavailable |

!!! note "Two different API keys"
    A Bedrock bearer API key authenticates the gateway to AWS. Later in this guide, you create a gateway consumer API key that authenticates your application to the gateway. Do not use one in place of the other.

## Option 1: Bearer authentication

AWS Bedrock API keys are sent to the Bedrock Runtime endpoint in the `Authorization: Bearer <key>` header. AWS recommends short-term keys for production and long-term keys only for exploration.

### Step 1: Generate a Bedrock API key

Follow the AWS instructions to [generate an AWS Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys-generate.html):

1. Open the AWS Bedrock console in the Region where you will invoke the model.
2. Generate a short-term or long-term API key.
3. Copy the key when AWS displays it.

Short-term keys last for the current AWS session, up to 12 hours, and are recommended for production. Long-term keys have a configurable expiration and are intended for exploration and development.

The IAM identity associated with the key must be allowed to invoke the selected model. An organization-level deny on `bedrock:CallWithBearerToken` prevents the key from being used with the Bedrock endpoint.

### Step 2: Store the Bedrock API key

```bash
export AWS_BEARER_TOKEN_BEDROCK="<bedrock-api-key>"
```

Short-term Bedrock API keys cannot be refreshed or extended after they are issued. Replace the key before it expires, and update the gateway secret with the new value.

Do not use an AWS access key ID or secret access key as the bearer token.

Store the key as an encrypted gateway secret:

```bash
curl --fail-with-body -X POST \
  http://localhost:9090/api/management/v1/secrets \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: Secret
metadata:
  name: bedrock-api-key
spec:
  displayName: AWS Bedrock API Key
  value: "${AWS_BEARER_TOKEN_BEDROCK}"
EOF
```

### Step 3: Deploy the provider

The provider references the stored key by name. The `AWS_REGION` value is expanded into the Bedrock Runtime endpoint.

{% raw %}

```bash
curl --fail-with-body -X POST \
  http://localhost:9090/api/management/v1/llm-providers \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: bedrock-provider
spec:
  displayName: AWS Bedrock Provider
  version: v1.0
  template: awsbedrock
  context: /bedrock
  upstream:
    url: https://bedrock-runtime.${AWS_REGION}.amazonaws.com
    auth:
      type: api-key
      header: Authorization
      value: 'Bearer {{ secret "bedrock-api-key" }}'
  accessControl:
    mode: deny_all
    exceptions:
      - path: /model/{modelId}/converse
        methods: [POST]
      - path: /model/{modelId}/converse-stream
        methods: [POST]
  policies:
    - name: api-key-auth
      version: v1
      paths:
        - path: /model/{modelId}/converse
          methods: [POST]
          params:
            key: X-API-Key
            in: header
        - path: /model/{modelId}/converse-stream
          methods: [POST]
          params:
            key: X-API-Key
            in: header
EOF
```

{% endraw %}

Continue to [Create a gateway consumer API key](#create-a-gateway-consumer-api-key).

## Option 2: SigV4 authentication

The `aws-authentication` policy signs each outbound request with SigV4. Do not configure `spec.upstream.auth` when using this option because the policy creates the AWS `Authorization` header.

See the [AWS Authentication policy reference](https://wso2.com/api-platform/policy-hub/policies/aws-authentication) for the complete parameter and error-response reference.

All SigV4 examples use:

```yaml
service: bedrock
region: <aws-region>
```

The service and Region must match the Bedrock Runtime endpoint. The policy supports four credential acquisition modes.

### IAM access key

Use `iam-user-access-key` for local testing when the gateway cannot use a workload role. Store the credentials as gateway secrets instead of embedding them in the provider definition.

Set the AWS credentials in your current shell:

```bash
export AWS_ACCESS_KEY_ID="<aws-access-key-id>"
export AWS_SECRET_ACCESS_KEY="<aws-secret-access-key>"
```

Create a secret for each value:

```bash
curl --fail-with-body -X POST \
  http://localhost:9090/api/management/v1/secrets \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: Secret
metadata:
  name: bedrock-access-key-id
spec:
  displayName: Bedrock AWS Access Key ID
  value: "${AWS_ACCESS_KEY_ID}"
EOF

curl --fail-with-body -X POST \
  http://localhost:9090/api/management/v1/secrets \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: Secret
metadata:
  name: bedrock-secret-access-key
spec:
  displayName: Bedrock AWS Secret Access Key
  value: "${AWS_SECRET_ACCESS_KEY}"
EOF
```

Deploy the provider. The `AWS_REGION` value is expanded into both the Bedrock Runtime endpoint and the SigV4 policy configuration.

{% raw %}

```bash
curl --fail-with-body -X POST \
  http://localhost:9090/api/management/v1/llm-providers \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: bedrock-provider
spec:
  displayName: AWS Bedrock Provider
  version: v1.0
  template: awsbedrock
  context: /bedrock
  upstream:
    url: https://bedrock-runtime.${AWS_REGION}.amazonaws.com
  accessControl:
    mode: deny_all
    exceptions:
      - path: /model/{modelId}/converse
        methods: [POST]
      - path: /model/{modelId}/converse-stream
        methods: [POST]
  policies:
    - name: aws-authentication
      version: v0
      paths:
        - path: /model/{modelId}/converse
          methods: [POST]
          params: &bedrock-aws-auth
            service: bedrock
            region: ${AWS_REGION}
            authenticationType: iam-user-access-key
            awsAccessKeyID: '{{ secret "bedrock-access-key-id" }}'
            awsSecretAccessKey: '{{ secret "bedrock-secret-access-key" }}'
        - path: /model/{modelId}/converse-stream
          methods: [POST]
          params: *bedrock-aws-auth
    - name: api-key-auth
      version: v1
      paths:
        - path: /model/{modelId}/converse
          methods: [POST]
          params: &consumer-auth
            key: X-API-Key
            in: header
        - path: /model/{modelId}/converse-stream
          methods: [POST]
          params: *consumer-auth
EOF
```

{% endraw %}

If the access key is temporary, create a third secret named `bedrock-session-token` and add this parameter to `bedrock-aws-auth`:

```bash
export AWS_SESSION_TOKEN="<aws-session-token>"

curl --fail-with-body -X POST \
  http://localhost:9090/api/management/v1/secrets \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: Secret
metadata:
  name: bedrock-session-token
spec:
  displayName: Bedrock AWS Session Token
  value: "${AWS_SESSION_TOKEN}"
EOF
```

{% raw %}

```yaml
awsSessionToken: '{{ secret "bedrock-session-token" }}'
```

{% endraw %}

!!! warning
    Prefer short-lived credentials or workload roles for production. Rotate any IAM access key used for testing and remove it when it is no longer needed.

### Default credential chain

Use `default-credential-chain` when the gateway workload already runs with the exact IAM role that can invoke Bedrock. This includes EC2 instance profiles, ECS task roles, and EKS Pod Identity associations.

In the provider payload from the preceding section, replace the `bedrock-aws-auth` parameters with:

```yaml
params: &bedrock-aws-auth
  service: bedrock
  region: <aws-region>
  authenticationType: default-credential-chain
```

Do not set an access key, secret access key, session token, or role Amazon Resource Name (ARN) for this mode. The AWS SDK resolves credentials from the gateway runtime environment.

### IAM roles for service accounts

Use `irsa` when the gateway workload already has the required IAM role through IRSA. The gateway must run on EKS with an OpenID Connect (OIDC) provider and a Kubernetes service account associated with an IAM role. The EKS Pod Identity Webhook must inject `AWS_ROLE_ARN` and `AWS_WEB_IDENTITY_TOKEN_FILE` into the gateway pod.

Replace the `bedrock-aws-auth` parameters with:

```yaml
params: &bedrock-aws-auth
  service: bedrock
  region: <aws-region>
  authenticationType: irsa
  awsRoleSessionName: bedrock-gateway-session
```

You can add `awsRoleARN` explicitly. If you omit it, the policy uses the injected `AWS_ROLE_ARN` value:

```yaml
awsRoleARN: arn:aws:iam::<account-id>:role/<bedrock-role>
```

### STS AssumeRole

Use `sts-assume-role` when the gateway must assume a dedicated or cross-account Bedrock role. The gateway first needs a source identity that is allowed to call `sts:AssumeRole`; the target role must trust that source identity.

Replace the `bedrock-aws-auth` parameters with:

```yaml
params: &bedrock-aws-auth
  service: bedrock
  region: <aws-region>
  authenticationType: sts-assume-role
  awsRoleARN: arn:aws:iam::<target-account-id>:role/<bedrock-role>
  awsRoleSessionName: bedrock-gateway-session
```

By default, the policy uses the gateway's AWS SDK credential chain as the source identity. You can instead provide `awsAccessKeyID`, `awsSecretAccessKey`, and, for temporary source credentials, `awsSessionToken` through gateway secrets.

For a cross-account role that requires an external ID, also add:

```yaml
awsRoleExternalID: <external-id>
```

## Configure IAM permissions for SigV4

Attach a least-privilege policy to the IAM user or role that invokes Bedrock. The following policy allows the non-streaming and streaming operations used in this guide:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InvokeBedrockModels",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:<region>::foundation-model/<model-id>",
        "arn:aws:bedrock:<region>:<account-id>:inference-profile/<inference-profile-id>"
      ]
    },
    {
      "Sid": "ReadBedrockInferenceProfiles",
      "Effect": "Allow",
      "Action": "bedrock:GetInferenceProfile",
      "Resource": "arn:aws:bedrock:<region>:<account-id>:inference-profile/<inference-profile-id>"
    }
  ]
}
```

Replace the placeholder Amazon Resource Name (ARN) values with the model and inference profile resources the gateway is allowed to invoke. When you scope access to an inference profile, authorize both the inference profile ARN and the corresponding foundation model ARN in each destination Region that the profile can route to. See [Prerequisites for running model inference](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-prereq.html) for the complete AWS guidance.

For `sts-assume-role`, the source identity also needs `sts:AssumeRole` permission for the target role, and the target role's trust policy must trust the source identity.

## Verify the provider

Retrieve the deployed provider:

```bash
curl --fail-with-body \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  http://localhost:9090/api/management/v1/llm-providers/bedrock-provider
```

## Create a gateway consumer API key

The provider examples protect the exposed routes with `api-key-auth`. Create a consumer key for the application that will call Bedrock through the gateway:

```bash
export GATEWAY_API_KEY=$(curl --fail-with-body -s -X POST \
  http://localhost:9090/api/management/v1/llm-providers/bedrock-provider/api-keys \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"name":"bedrock-client"}' \
  | jq -r '.apiKey.apiKey')
```

Confirm that a key was returned:

```bash
test -n "$GATEWAY_API_KEY" && test "$GATEWAY_API_KEY" != "null"
```

The key value is returned only when it is created or regenerated. Store it securely.

## Invoke Bedrock through the gateway

Set a base model ID that is available in the selected AWS Region, or an inference profile ID that is supported by the source Region configured in the Bedrock Runtime endpoint:

```bash
export BEDROCK_MODEL_ID="<bedrock-model-or-inference-profile-id>"
```

Call the native Bedrock `Converse` operation through the gateway:

```bash
export CA_CERT_PATH="<path-to-trusted-ca-certificate>"

curl --fail-with-body -X POST \
  "https://localhost:8443/bedrock/v1.0/model/${BEDROCK_MODEL_ID}/converse" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $GATEWAY_API_KEY" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": [
          {"text": "Reply with a short hello from AWS Bedrock."}
        ]
      }
    ],
    "inferenceConfig": {
      "maxTokens": 64,
      "temperature": 0.2
    }
  }' \
  --cacert "$CA_CERT_PATH"
```

URL-encode the model ID if it contains characters that are not safe in a URL path.

If the gateway uses a certificate signed by a public or locally trusted certificate authority (CA), omit `--cacert`. For a local self-signed certificate, add the issuing CA certificate to your trust store or pass it with `--cacert`.

## Supported models

AWS publishes its model list in the [AWS Bedrock supported models reference](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html). Any model Bedrock exposes in the configured Region works through the gateway; set it as the model ID in the request path, as `BEDROCK_MODEL_ID` above.

## Troubleshooting

### Bedrock returns `AccessDeniedException`

Confirm that the IAM identity can invoke the selected model in the configured Region. For streaming requests, it also needs `bedrock:InvokeModelWithResponseStream`.

### The gateway returns `502 Bad Gateway`

For SigV4, this usually means the policy could not retrieve AWS credentials or sign the request. Check the gateway logs and verify the selected credential mode. For `default-credential-chain`, confirm that the gateway workload actually has a usable AWS credential source.

### AWS reports a signature mismatch

Confirm that `service` is `bedrock` and that the policy Region matches the Region in `https://bedrock-runtime.<aws-region>.amazonaws.com`.

### IRSA fails during policy initialization

Confirm that the gateway pod has both `AWS_ROLE_ARN` and `AWS_WEB_IDENTITY_TOKEN_FILE`, and that the projected token file is readable. Also verify the role trust policy and its OIDC subject condition.

### STS returns `AccessDenied`

Check both sides of the relationship: the source identity must be allowed to call `sts:AssumeRole`, and the target role's trust policy must trust the source identity.

## Security recommendations

- Do not commit AWS access keys, session tokens, Bedrock API keys, gateway passwords, or external IDs.
- Prefer the default credential chain, IRSA, or STS AssumeRole over long-lived IAM user access keys.
- Use short-term Bedrock API keys for production bearer authentication, and rotate them before expiration because issued keys cannot be refreshed or extended.
- Restrict IAM permissions to the required model and inference profile resources.
- Expose only the required Bedrock operations through `accessControl`.
- Use HTTPS for Bedrock and production gateway endpoints.

## Related pages

- [Provider templates](../../../reference/llm-templates.md) — the token and model metadata the `awsbedrock` template extracts.
- [Multi-provider routing](../../../routing/multi-provider-routing.md) — put an LLM proxy in front of this provider and route to others alongside it.
- [OpenAI](openai.md) and [Anthropic](anthropic.md) — the same setup for providers that authenticate with a single API key header.
