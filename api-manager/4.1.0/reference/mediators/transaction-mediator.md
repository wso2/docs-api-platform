---
title: "Transaction mediator"
description: "Configure the Transaction mediator to manage distributed transactions for child mediators in the Micro Integrator."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/mediators/transaction-mediator/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/mediators/transaction-mediator.md
tags:
  - api-manager
  - reference
  - mediators
  - transaction-mediator
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Transaction Mediator

A transaction is a set of operations executed as a single unit. It also
can be defined as an agreement, which is carried out between separate
entities or objects. The **Transaction Mediator** is used to manage
**distributed transactions** in the Micro Integrator by providing
transaction functionality for its child mediators.

!!! Info
	In addition to distributed transactions, the Micro Integrator also supports Java Message Service (JMS) transactions. For more information on transactions, see [Working with Transactions](../../integrate/examples/working-with-transactions.md).

## Syntax

```xml
<transaction action="commit|fault-if-no-tx|new|rollback|use-existing-or-new"/>
```

## Configuration

The **Action** parameter is used to select a transaction action to be
performed. Available values are as follows.

| **Action**                                                     | Description                                                                                                                    |
|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **Commit Transaction** (commit)                                | This marks the transaction as completed and ends the transaction.                                                              |
| **Fault if no Transaction** (fault-if-no-tx)                   | This goes to the error handler if there is no transaction.                                                                     |
| **Initiate new Transaction** (new)                             | This provides the entry point for a new transaction.                                                                           |
| **Rollback Transaction** (rollback                             | This rolls back a transaction.                                                                                                 |
| **Use existing or Initiate Transaction** (use-existing-or new) | If a transaction already exists, this value continues it. If no transaction already exists, a new transaction will be created. |

<!--
## Examples

For an example of using the Transaction mediator, see [Transaction
Mediator Example](_Transaction_Mediator_Example_) .
-->