---
title: "Format apictl get command output"
description: "Format apictl get command output as a table, JSON, JSON array, or Go template, and convert text case within templates."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/api-controller/advanced-topics/formatting-the-output-of-get-command/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/api-controller/advanced-topics/formatting-the-output-of-get-command.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - api-controller
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

## Formatting get Command Outputs

Output of `get envs`, `get apis`, `get api-products` and `get apps` can be formatted with Go Templates. 

#### Available formatting options

<table>
    <thead>
        <tr class="header">
            <th>Name</th>
            <th>Usage</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr class="odd">
            <td>table</td>
            <td>This is the default format and the output is displayed as a table</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ``` 
                    --format "table {{.Name}}\t{{.Id}}" 
                    ```
                </div>
            </td>
        </tr>
        <tr class="odd">
            <td>json</td>
            <td>Output is formatted as JSON</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ```
                    --format "{{ json . }}" 
                    ```
                </div>
            </td>
        </tr>
        <tr class="odd">
            <td>jsonArray</td>
            <td>Outputs a human-readable JSON Array with indented by 2 spaces</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ``` 
                    --format "jsonArray" 
                    ```
                </div>
            </td>
        </tr>
        <tr class="odd">
            <td>jsonPretty</td>
            <td>Outputs a human-readable JSON with indented by 2 spaces</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ``` 
                    --format "table {{ jsonPretty . }}" 
                    ```
                </div>
            </td>
        </tr>
        <tr class="odd">
            <td>upper</td>
            <td>Convert string to uppercase</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ``` 
                    --format "{{upper .Name}}\t{{upper .Context}}" 
                    ```
                </div>
            </td>
        </tr>
        <tr class="odd">
            <td>lower</td>
            <td>Convert string to lowercase</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ``` 
                    --format "{{lower .Name}}\t{{lower .Context}}"
                    ```
                </div>
            </td>
        </tr>
        <tr class="odd">
            <td>title</td>
            <td>Convert the first letter to uppercase of a string</td>
            <td>
                <div style="width: 100%; display: block; overflow: auto;">
                    ``` 
                    --format "{{title .Name}}\t{{title .Context}}" 
                    ```
                </div>
            </td>
        </tr>
    </tbody>
</table>