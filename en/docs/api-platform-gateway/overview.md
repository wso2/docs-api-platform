# API Platform Gateway Overview

API Platform provides two types of API Platform gateways powered by WSO2, giving you flexibility to choose the deployment model that best fits your requirements. Both gateway types are managed through API Platform's unified control plane, ensuring consistent API management, policy enforcement, and monitoring across all your environments.

## Gateway Types

### API Platform Cloud Gateway (SaaS)

The API Platform Cloud Gateway is a fully managed, WSO2-hosted gateway that requires zero infrastructure management on your part.

| Aspect | Description |
|--------|-------------|
| **Deployment** | WSO2-managed cloud infrastructure |
| **Management** | Fully managed by WSO2 |
| **Availability** | High availability with automatic failover |
| **Scaling** | Automatic scaling based on traffic |
| **Maintenance** | Zero maintenance required |

**Best for:**

- Teams wanting to get started quickly without infrastructure setup
- Organizations preferring a fully managed solution
- Projects where time-to-market is critical
- Workloads without strict data residency requirements

### Self-Hosted Gateway

The Self-Hosted Gateway is a containerized instance of the API Platform Gateway that you deploy and manage in your own infrastructure—on-premises, in a private cloud, or in any public cloud provider.

| Aspect | Description |
|--------|-------------|
| **Deployment** | Your infrastructure (Kubernetes, Docker, VM) |
| **Management** | You manage the runtime; API Platform manages configuration |
| **Availability** | You control redundancy and failover |
| **Scaling** | You control scaling based on your needs |
| **Maintenance** | You handle runtime updates and patches |

**Best for:**

- Organizations with strict compliance or data residency requirements
- Workloads requiring low-latency access to on-premises backends
- Environments with private/non-public backend services
- Teams needing full control over the gateway runtime

## Comparison

| Feature | API Platform Cloud Gateway | Self-Hosted Gateway |
|---------|---------------------|---------------------|
| Infrastructure management | WSO2 | You |
| Data residency control | WSO2 cloud regions | Your choice |
| Backend connectivity | Public endpoints | Public and private |
| Setup time | Instant | Requires deployment |
| Scaling | Automatic | Manual or auto (your infra) |
| Cost model | Usage-based | Infrastructure + usage |
| Unified control plane | ✓ | ✓ |
| Policy Hub integration | ✓ | ✓ |
| Monitoring & analytics | ✓ | ✓ |

## Architecture

Both gateway types connect to API Platform's unified control plane:

```
┌─────────────────────────────────────────────────────────────────┐
│                     API Platform Control Plane                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ API Manager │  │ Policy Hub  │  │ Monitoring & Analytics  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────┬───────────────────────────────────┬─────────────────┘
            │                                   │
            ▼                                   ▼
┌───────────────────────────────┐    ┌───────────────────────────┐
│  API Platform Cloud Gateway   │    │    Your Environment       │
│  (WSO2-Managed)               │    │  ┌─────────────────────┐  │
│  ┌─────────────────┐          │    │  │  Self-Hosted Gateway│  │
│  │  Gateway Cluster│          │    │  │  ┌─────┐ ┌─────┐    │  │
│  └─────────────────┘          │    │  │  │ GW1 │ │ GW2 │    │  │
└───────────────────────────────┘    │  │  └─────┘ └─────┘    │  │
                                     │  └─────────────────────┘  │
                                     │           │               │
                                     │           ▼               │
                                     │  ┌─────────────────────┐  │
                                     │  │  Backend Services   │  │
                                     │  └─────────────────────┘  │
                                     └───────────────────────────┘
```

## Common Features

Both gateway types share these capabilities through the unified control plane:

| Feature | Description |
|---------|-------------|
| **Unified Management** | Manage all APIs and gateways from a single control plane |
| **Centralized Policies** | Define and enforce policies through the Policy Hub |
| **Real-time Sync** | Automatic synchronization of API configurations and policies |
| **Health Monitoring** | Monitor gateway health and performance |
| **Analytics** | Unified API analytics and insights |
| **Developer Portal** | Expose APIs to developers through the portal |

## Getting Started

### Using API Platform Cloud Gateway

The API Platform Cloud Gateway is available by default in your organization. Simply deploy your APIs and they will be routed through the managed gateway.

1. Create an API proxy in the API Platform Console.
2. Deploy the API to an environment.
3. The API is automatically available through the cloud gateway.

For more details, see [API Platform Cloud Gateway](cloud-gateway.md).

### Using Self-Hosted Gateway

To deploy a Self-Hosted Gateway in your environment:

1. **[Getting Started](getting-started.md)**: Quick start guide to set up your first gateway.
2. **[Setting Up](setting-up.md)**: Detailed configuration for VM, Docker, and Kubernetes.
3. **[Adding and Managing Policies](manage-policies.md)**: Configure and enforce policies.
4. **[Analytics](analytics.md)**: Monitor API traffic and performance.

## What's Next?

- [Getting Started](getting-started.md): Quick start guide for Self-Hosted Gateway
- [Setting Up](setting-up.md): Configure for VM, Docker, or Kubernetes
- [Adding and Managing Policies](manage-policies.md): Configure and enforce policies
- [Analytics](analytics.md): Monitor API traffic and performance
- [Troubleshooting](troubleshooting.md): Common issues and solutions
