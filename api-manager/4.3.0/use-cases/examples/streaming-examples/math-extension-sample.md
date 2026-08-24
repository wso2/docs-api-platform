---
title: "Rounding up amounts via the math function"
description: "Use the math extension's ceil function to round up production amounts in a Siddhi application."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/use-cases/examples/streaming-examples/math-extension-sample/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/use-cases/examples/streaming-examples/math-extension-sample.md
tags:
  - api-manager
  - use-cases
  - examples
  - streaming-examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-16
content_type: "how-to"
---

# Rounding up Amounts via the Math Function

## Purpose:
This function returns the smallest (closest to negative infinity) double value that is greater than or equal to the
 p1 argument, and is equal to a mathematical integer. This function wraps thejava.lang.Math.ceil() method.

## Prerequisites:
* Save this sample. If there is no syntax error, the following messages would be shown on the console
    - Siddhi App MathExtensionSample successfully deployed.

## Executing the Sample:
1. Start the Siddhi application by clicking on 'Run'
2. If the Siddhi application starts successfully, the following messages would be shown on the console
    * MathExtensionSample.siddhi - Started Successfully!

## Testing the Sample:
You can publish data event to the file, through event simulator
1. Open event simulator by clicking on the second icon or press Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, select values as follows:
    * Siddhi App Name  : MathExtensionSample
    * Stream Name      : SweetProductionStream
3. Enter following values in the fields and send
    * name: chocolate cake
    * amount: 50.50
4. Enter following values in the fields and send
    * name: coffee cake
    * amount: 50.30

## Viewing the Results:
Messages similar to the following would be shown on the console.\

INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - MathExtensionSample: Event :, StreamEvent{ timestamp=1513381581963, beforeWindowData=null, onAfterWindowData=null, outputData=[chocolate cake, 51.0], type=CURRENT, next=null}\

INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - MathExtensionSample: Event :, StreamEvent{ timestamp=1513381917721, beforeWindowData=null, onAfterWindowData=null, outputData=[chocolate cake, 51.0], type=CURRENT, next=null}



```sql
@App:name("MathExtensionSample")

@App:description('Rounds up the sweets amount')


define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream AmountCorrectionStream(name string, amount double);

from SweetProductionStream
select name, math:ceil(amount) as amount
insert into AmountCorrectionStream;
```