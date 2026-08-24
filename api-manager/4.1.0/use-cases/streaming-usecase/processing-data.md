---
title: "Stream processing"
description: "Introduces the stream processing categories in WSO2 Streaming Integrator: cleansing, transforming, enriching, summarizing, and correlating data."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/use-cases/streaming-usecase/processing-data/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/use-cases/streaming-usecase/processing-data.md
tags:
  - api-manager
  - use-cases
  - streaming-usecase
  - processing-data
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Stream Processing

Stream processing involves making changes to streaming data to generate a required output. WSO2 Streaming Integrator allows you to carry out a wide range of operations to process streaming data. These operations are supported via [Siddhi Extensions](https://siddhi.io/en/v5.1/docs/extensions/). These operations can be broadly categorized into five categories as follows:

- [**Cleansing**](cleansing-data.md)

    Filtering only the required information for further processing out of all the extracted/received data, and other cleaning activities such as pre-processing, adding missing values, removing unnecessary attributes, etc.
    
- [**Transforming**](transforming-data.md)

    Transforming data from one format to another, performing a range of mathematical, regex, string, unit conversion, map, json, etc., and enabling the creation of scripts that perform transformations.
  
- [**Enriching**](enriching-data.md)

    Joining streams of data with each other as well as static data (such as tables) to enrich the data
    
- [**Summarizing**](summarizing-data.md)

    Performing long-term time based summarizations, as well as performing summarizations for subsets of data based on time or length (number of events e.g., every 10 events). 

- [**Correlating**](correlating-data.md)

    Identifying trends and patterns.