---
title: "Receiving XML events via WebSocket"
description: "Configure the Streaming Integrator to receive events over WebSocket in XML format and log them to the console."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/use-cases/examples/streaming-examples/receive-web-socket-in-xml-format/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/use-cases/examples/streaming-examples/receive-web-socket-in-xml-format.md
tags:
  - api-manager
  - use-cases
  - examples
  - streaming-examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-16
content_type: "how-to"
---

# Receiving XML Events via WebSocket

## Purpose:
This application demonstrates how to configure WSO2 Streaming Integrator Tooling to receive events to the `SweetProductionStream` via WebSocket transport in XML default format and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites:
Save this sample.

## Executing the Sample:
1. Navigate to `{WSO2SIHome}/samples/sample-clients/websocket-producer` and run `ant` command as follows:
    Run `ant` command in the terminal.
    ```bash
    ant
    ```
    If you want to publish custom number of events, you need to run `ant` command as follows.
    ```bash
    ant -DnoOfEventsToSend=5
    ```
2. Start the Siddhi application by clicking on 'Run'.
3. If the Siddhi application starts successfully, the following messages would be shown on the console.
    ```
    * ReceiveWebSocketInXMLFormat.siddhi - Started Successfully!
    ```

## Viewing the Results:
See the output. Following message would be shown on the console.
```
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985540005, data=[Honeycomb, 2700.3555330804284], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985541009, data=[Froyo, 4195.429933118964], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985542006, data=[Donut, 9625.837679695496], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985543008, data=[Froyo, 1909.568113992198], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985544012, data=[Lollipop, 291.8985351086241], isExpired=false}
```

```sql
@App:name("ReceiveWebSocketInXMLFormat")
@App:description('Receive events via WebSocket transport in XML format and view the output on the console.')

@Source(type = 'websocket', url='ws://localhost:8025/abc',
    @map(type='xml'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProducitonAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```