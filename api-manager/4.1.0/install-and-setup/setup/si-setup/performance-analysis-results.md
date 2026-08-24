---
title: "Performance analysis results"
description: "Review performance benchmark results for WSO2 Streaming Integrator when consuming events using a Kafka source."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/si-setup/performance-analysis-results/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/si-setup/performance-analysis-results.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - si-setup
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Performance Analysis Results

## Consuming events using Kafka source

### Specifications of EC2 Instances

- Stream Processor : c5.2xLarge
- Kafka server     : c5.xLarge
- Kafka publisher  : c5.xLarge

### Siddhi Application

```sql
@App:name("HelloKafka")

@App:description('Consume events from a Kafka Topic and publish to a different Kafka Topic')

@source(type='kafka',
    	topic.list='kafka_topic',
    	partition.no.list='0',
    	threading.option='single.thread',
    	group.id="group",
    	bootstrap.servers='54.177.187.50:9092',
    	@map(type='json'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream KafkaSourceThroughputStream(count long);

from SweetProductionStream#window.timeBatch(5 sec)
select count(name)/5 as count
insert into KafkaSourceThroughputStream;
```

### Results

- Average Publishing TPS to Kafka : 550k
- Average Consuming TPS from Kafka: 100K


## Consuming messages from an HTTP Source

### Specifications of EC2 Instances

- Stream Processor : c5.2xLarge
- JMeter           : c5.xLarge

### Siddhi Application

```sql
@App:name("HttpSource")

@App:description('Consume events from http clients')

@source(type='http', worker.count='20', receiver.url='http://0.0.0.0:8082/service',
@map(type='json'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream HttpSourceThroughputStream(tps long);

from SweetProductionStream#window.timeBatch(5 sec)
select count(amount)/5 as tps
insert into HttpSourceThroughputStream;
```

### Results

- Average Publishing TPS to Http Source : 49K
- Average Consuming TPS from Http Source: 49K
