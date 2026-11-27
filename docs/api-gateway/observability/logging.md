---
title: "Gateway Logging"
description: "Collect gateway component logs with the demonstration Fluent Bit and OpenSearch stack, or send them to your own logging system."
---

Gateway components write logs to stdout and stderr. Docker stores those logs. You can read them from each container, or start the demonstration logging stack to search them in one place.

The demonstration stack is Fluent Bit, OpenSearch, and OpenSearch Dashboards. It is a starting point. You can replace it with another logging system.

The components log in text format by default. The demonstration stack parses JSON, so set the format to JSON in `configs/config.toml` before you search fields such as `level` and `msg`:

```toml
[controller.logging]
format = "json"

[policy_engine.logging]
format = "json"

[router.access_logs]
format = "json"
```

Run these commands from the gateway folder, and restart the gateway after you change the file:

```bash
docker compose restart gateway-controller gateway-runtime
```

## Start the logging stack

Start the gateway with log collection:

```bash
docker compose --profile logging up -d
```

This starts:

- **gateway-controller** and **gateway-runtime**, which log to stdout and stderr. The router and the policy engine run inside **gateway-runtime**.
- **Fluent Bit**, which reads the Docker log files, adds the component name and hostname, and forwards the logs
- **OpenSearch**, which stores the logs
- **OpenSearch Dashboards**, which is the search UI

To run the gateway without that stack:

```bash
docker compose up -d
```

The components still log. Read them with:

```bash
docker compose logs gateway-controller gateway-runtime
```

Add `-f` to follow the logs as the components write them.

To stop the stack and keep the stored logs, run:

```bash
docker compose --profile logging down
```

To stop the stack and delete the stored logs, add `-v`. This can't be undone:

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
| Gateway controller | `<COMPOSE_PROJECT_NAME>-gateway-controller-1` |
| Gateway runtime (router and policy engine) | `<COMPOSE_PROJECT_NAME>-gateway-runtime-1` |

Fluent Bit sets `component` to the Docker container name. Compose names containers after the project, which defaults to the name of the folder that holds `docker-compose.yaml`. Run `docker compose ps` to see the names.

Click **Save**. You can add more filters, such as **Field** `level` and **Value** `ERROR`, `INFO`, `WARN`, or `DEBUG`. The `level` and `msg` fields exist only when the component logs in JSON format.

Example queries:

```
error
```

```
Weather-API
```

```
level:ERROR
```

```
component:*gateway-controller* AND msg:*Weather-API*
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
