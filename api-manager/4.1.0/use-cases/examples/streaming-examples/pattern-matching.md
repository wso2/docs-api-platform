---
title: "Identifying event patterns based on arrival order"
description: "Run a Siddhi sample that detects a temperature increase pattern within a time window using pattern matching."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/use-cases/examples/streaming-examples/pattern-matching/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/use-cases/examples/streaming-examples/pattern-matching.md
tags:
  - api-manager
  - use-cases
  - examples
  - streaming-examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Identifying Event Patterns Based On Order of Event Arrival

## Purpose:
This application demonstrates how to detect patterns with Siddhi pattern concept. In the sample we capture a pattern where the temperature of a room increases by 5 degrees within 2 minutes

## Prerequisites:
1. Save this sample

## Executing the Sample:
1. Start the Siddhi application by clicking on 'Run'
2. If the Siddhi application starts successfully, the following messages would be shown on the console
    * PatternMatching.siddhi - Started Successfully!

## Notes:
If you edit this application while it's running, stop the application -> Save -> Start.

## Testing the Sample:
1. Simulate single events. For this, click on 'Event Simulator' (double arrows on left tab) -> 'Single Simulation' -> Select 'PatternMatching' as 'Siddhi App Name' -> Select 'RoomTemperatureStream' as 'Stream Name' -> Provide attribute values -> Send
2. To generate an alert, send one event, followed by another event (within 2 minutes) where the temperature of the second event shows an increment by 5 degrees or more (e.g.. Temperature of event 1 = 17.0, Temperature of event 2 = 30.0). Note that these two events may or may not be consecutive.

## Viewing the Results:
See the output on the console. Output will be shown if the second temperature input is incremented by 5 degrees or more.

## Note:
Stop this Siddhi application, once you are done with the execution


```sql
@App:name("PatternMatching")

@App:description('Identify event patterns based on the order of event arrival')


define stream RoomTemperatureStream(roomNo string, temp double);

@sink(type='log')
define stream RoomTemperatureAlertStream(roomNo string, initialTemp double, finalTemp double);

--Capture a pattern where the temperature of a room increases by 5 degrees within 2 minutes
@info(name='query1')
from every( e1 = RoomTemperatureStream ) -> e2 = RoomTemperatureStream [e1.roomNo == roomNo and (e1.temp + 5.0) <= temp]
    within 2 min
select e1.roomNo, e1.temp as initialTemp, e2.temp as finalTemp
insert into RoomTemperatureAlertStream;
```