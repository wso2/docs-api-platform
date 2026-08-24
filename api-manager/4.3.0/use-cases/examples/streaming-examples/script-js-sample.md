---
title: "Using JavaScript functions in siddhi applications"
description: "Call JavaScript functions from a Siddhi application and view the resulting output in the console."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/use-cases/examples/streaming-examples/script-js-sample/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/use-cases/examples/streaming-examples/script-js-sample.md
tags:
  - api-manager
  - use-cases
  - examples
  - streaming-examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-16
content_type: "how-to"
---

# Using JavaScript Functions in Siddhi Applications

## Purpose:
This sample demonstrate how JavaScript functions can be used in Siddhi Applications.

## Prerequisites:
1. Save this sample.

## Executing the Sample:
1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.
     ```
     * Script-js-sample.siddhi - Started Successfully!
     ```

## Testing the Sample:
1. To open event simulator by clicking on the second icon or press Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, select values as follows:
     * Siddhi App Name: Script-js-sample
     * Stream Name: SweetProductiontream
3. In the name field and amount fields, enter 'toffee', '45.25' respectively and then click Send to send the event.
4. Send some more events.

## Viewing the Results:
See the output on the console. Description of the raw material with the passed details are shown in the logger. You will get the output as follows:
```
[2017-12-20_14-26-03_120] INFO {io.siddhi.core.stream.output.sink.LogSink} - Script-js-sample : logStream : Event{timestamp=1513760163112, data=[toffee, 45.25, There are 45.25kg of toffee in the store], isExpired=false}
```

**Notes: If you need to edit this application while it is running, then Save -> Start.**

```sql
@App:name('Script-js-sample')
@App:Description('Demonstrate how javascript functions can be used in Siddhi Applications.')


define stream sweetProductionStream (name string, amount double);

@sink(type='log')
define stream logStream (name string, amount double, itemDescription string);

define function detailedMaterial[JavaScript] return string {
     var name = data[0];
     var amount = data[1];
     var res = "There are "+amount+"kg of "+name+ " in the store";
     return res;
};

from sweetProductionStream select name , amount, detailedMaterial(name,amount) as itemDescription
insert into detailedProductionstream;

from detailedProductionstream
select *
insert into logStream;
```