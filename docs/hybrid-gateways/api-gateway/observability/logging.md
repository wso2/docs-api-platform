---
title: "Gateway Logging"
description: "Collect gateway component logs with the demonstration Fluent Bit and OpenSearch stack, or send them to your own logging system."
---

Gateway components write structured JSON logs to stdout and stderr. Docker stores those logs. You can read them from each container, or start the demonstration logging stack to search them in one place.

The demonstration stack is Fluent Bit, OpenSearch, and OpenSearch Dashboards. It is a starting point. You can replace it with another logging system. The gateway components do not need extra logging configuration.

## Start the logging stack

Start the gateway with log collection:

```bash
docker compose --profile logging up -d
```

This starts:

- **gateway-controller**, **policy-engine**, and **router**, which log to stdout and stderr
- **Fluent Bit**, which reads the Docker log files, adds the component name and hostname, and forwards the logs
- **OpenSearch**, which stores the logs
- **OpenSearch Dashboards**, which is the search UI

To run the gateway without that stack:

```bash
docker compose up -d
```

The components still log. Read them with:

```bash
docker logs gateway-controller
docker logs policy-engine
docker logs router
```

Stop the stack, and the stored logs:

```bash
docker compose --profile logging down
```

```bash
docker compose --profile logging down -v
```

The second command deletes the `opensearch-data` volume.

## View logs in OpenSearch Dashboards

1. Open `http://localhost:5601`.
2. Open the menu (☰), then **Management** → **Dashboard Management** → **Index Patterns**.
3. Click **Create index pattern**.
4. Enter `gateway-logs-*` and click **Next step**.
5. Select **@timestamp** as the time field and click **Create index pattern**.
6. Open the menu (☰), then **OpenSearch Dashboards** → **Discover**.
7. Select the `gateway-logs-*` index pattern. Change the time range if you need more than the last 15 minutes.

Filter by component: click **Add filter**, set **Field** to `component`, **Operator** to `is`, and **Value** to one of these:

| Component | Value |
|:----------|:------|
| Policy engine | `policy-engine` |
| Gateway controller | `gateway-controller` |
| Router | `router` |

Click **Save**. You can add more filters, such as **Field** `level` and **Value** `error`, `info`, `warn`, or `debug`.

Example queries:

```
error
```

```
Weather-API
```

```
component:policy-engine AND level:error
```

```
component:gateway-controller AND message:*Weather-API*
```

```
duration_ms:>1000
```

In Discover, use the gear icon to choose columns, click a column header to sort, and click **>** on a row to see the JSON. Click **Save** to keep a search.

## Use another logging system

Point Fluent Bit, or another collector, at the Docker container logs. The gateway components stay the same.

### Elastic Stack

Replace OpenSearch with the Elastic Stack:


```yaml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
  environment:
    - discovery.type=single-node
    - xpack.security.enabled=false
  ports:
    - "9200:9200"
  networks:
    - gateway-network

kibana:
  image: docker.elastic.co/kibana/kibana:8.11.0
  environment:
    - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
  ports:
    - "5601:5601"
  networks:
    - gateway-network
  depends_on:
    - elasticsearch
```

Update Fluent Bit output:
```conf
[OUTPUT]
    Name es
    Match docker.*
    Host elasticsearch
    Port 9200
    Logstash_Format On
    Logstash_Prefix gateway-logs
```

### Grafana Loki

For a lightweight, Prometheus-inspired logging solution:

```yaml
loki:
  image: grafana/loki:latest
  ports:
    - "3100:3100"
  command: -config.file=/etc/loki/local-config.yaml
  networks:
    - gateway-network

promtail:
  image: grafana/promtail:latest
  volumes:
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
    - ./observability/promtail/config.yaml:/etc/promtail/config.yaml:ro
  command: -config.file=/etc/promtail/config.yaml
  networks:
    - gateway-network

grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  networks:
    - gateway-network
  depends_on:
    - loki
```

### Cloud-Native Solutions

#### AWS CloudWatch

Configure Fluent Bit to send logs to CloudWatch:

```conf
[OUTPUT]
    Name cloudwatch_logs
    Match *
    region us-east-1
    log_group_name /aws/gateway
    log_stream_prefix gateway-
    auto_create_group true
```

Provide AWS credentials with environment variables or an IAM role.

#### Datadog

Use the Datadog Agent:

```yaml
datadog:
  image: datadog/agent:latest
  environment:
    - DD_API_KEY=${DD_API_KEY}
    - DD_LOGS_ENABLED=true
    - DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true
    - DD_AC_EXCLUDE=name:datadog-agent
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
  networks:
    - gateway-network
```

#### Splunk

Configure Fluent Bit to forward to Splunk HEC:

```conf
[OUTPUT]
    Name splunk
    Match *
    Host splunk.example.com
    Port 8088
    Splunk_Token ${SPLUNK_HEC_TOKEN}
    TLS On
    TLS.Verify Off
```

## Additional resources

- [Fluent Bit Documentation](https://docs.fluentbit.io/)
- [OpenSearch Documentation](https://opensearch.org/docs/latest/)
- [OpenSearch Dashboards User Guide](https://opensearch.org/docs/latest/dashboards/)
- [Docker Compose Profiles](https://docs.docker.com/compose/profiles/)
