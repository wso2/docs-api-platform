---
title: "Configuring External Storage and Backends"
description: "Configure PostgreSQL as the Gateway Controller storage backend and Redis for distributed rate limiting in API Platform Gateway."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/setup/storage-and-backends/
md_url: https://wso2.com/api-platform/docs/api-gateway/setup/storage-and-backends.md
tags:
  - api-gateway
  - configuration
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "how-to"
---

# Configuring External Storage and Backends

### PostgreSQL (Gateway Controller)

To use PostgreSQL as the storage backend for the Gateway Controller, update the `config.toml`:

```toml
[controller.storage]
type = "postgres"

[controller.storage.postgres]
host = "postgres.example.com"
port = 5432
database = "gateway"
user = "gateway"
password = "your-postgres-password"
```

For the full list of PostgreSQL configuration options, refer to the [config template](https://github.com/wso2/api-platform/blob/main/gateway/configs/config-template.toml).

### Redis (Gateway Runtime — Distributed Rate Limiting)

To enable distributed rate limiting across multiple Gateway Runtime instances, configure the rate limiting policy to use Redis as the backend in `config.toml`:

```toml
[policy_configurations.ratelimit_v1]
algorithm = "fixed-window"
backend = "redis"

[policy_configurations.ratelimit_v1.redis]
host = "redis.example.com"
port = 6379
password = "your-redis-password"
```

For the full list of Redis configuration options, refer to the [Advanced Rate Limiting documentation](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit).