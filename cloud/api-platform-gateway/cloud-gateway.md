# API Platform Cloud Gateway

API Platform Cloud Gateway is a fully managed, WSO2-hosted API gateway that provides instant API deployment with zero infrastructure management.

## Overview

The API Platform Cloud Gateway is the default gateway available in your organization. When you deploy an API proxy, it's automatically routed through the cloud gateway without any additional setup or configuration required.

## Key Features

| Feature | Description |
|---------|-------------|
| **Zero Setup** | No infrastructure provisioning or configuration required |
| **Fully Managed** | WSO2 handles all operations, scaling, and maintenance |
| **High Availability** | Built-in redundancy with automatic failover |
| **Auto-Scaling** | Automatically scales based on API traffic |
| **Global Reach** | Available across multiple cloud regions |
| **Instant Deployment** | APIs are live within seconds of deployment |

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     API Platform Control Plane                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ API Manager │  │ Policy Hub  │  │ Monitoring & Analytics  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Platform Cloud Gateway (WSO2-Managed)            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Managed Gateway Cluster                     │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │    │
│  │  │ Region 1│  │ Region 2│  │ Region 3│  │ Region N│     │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│           • Auto-scaling    • High availability                  │
│           • Load balancing  • Automatic updates                  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   Your Backend Services
                   (publicly accessible)
```

## When to Use API Platform Cloud Gateway

The API Platform Cloud Gateway is ideal for:

- **Quick starts**: Get APIs running immediately without infrastructure setup
- **Managed operations**: Focus on API development, not gateway management
- **Standard workloads**: APIs that don't have strict data residency requirements
- **Public backends**: Services accessible over the public internet
- **Variable traffic**: Workloads that benefit from automatic scaling

## Limitations

Consider using a [Self-Hosted Gateway](getting-started.md) instead if you require:

- **Data residency**: Keeping API traffic within specific geographic boundaries
- **Private backends**: Connecting to services not accessible from the public internet
- **Network isolation**: Running the gateway within your secure network perimeter
- **Custom compliance**: Meeting specific regulatory requirements (HIPAA, PCI-DSS, etc.)

## Getting Started

The API Platform Cloud Gateway is available by default. To deploy an API:

1. **Create an API proxy** in the API Platform Console.
2. **Configure your API** with endpoints, policies, and security settings.
3. **Deploy the API** to an environment.
4. **Access your API** through the generated gateway URL.

That's it! Your API is immediately available through the API Platform Cloud Gateway.

## Gateway URL

APIs deployed to the API Platform Cloud Gateway are accessible at:

```
https://<organization>.gateway.bijira.dev/<api-context>/<version>
```

For example:
```
https://acme-corp.gateway.bijira.dev/orders/v1
```

## Included Capabilities

All features of the API Platform platform are available with the Cloud Gateway:

- **Policy Enforcement**: Apply rate limiting, authentication, and other policies
- **Analytics**: Full API analytics and insights
- **Developer Portal**: Expose APIs to developers
- **Monitoring**: Real-time logs and monitoring
- **Security**: OAuth2, API keys, and other authentication methods

## What's Next?

- [Self-Hosted Gateway](getting-started.md): Deploy a gateway in your own environment
- [Third-Party Gateways](../federation/overview.md): Federate external gateways like AWS API Gateway