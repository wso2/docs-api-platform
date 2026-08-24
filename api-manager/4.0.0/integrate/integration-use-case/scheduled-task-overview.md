---
title: "Periodic execution of integration processes"
description: "Learn how to automate periodic execution of integration processes using scheduled tasks in the Micro Integrator."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/integration-use-case/scheduled-task-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/integration-use-case/scheduled-task-overview.md
tags:
  - api-manager
  - integrate
  - integration-use-case
  - scheduled-task-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Periodic Execution of Integration Processes

Executing an integration process at a specified time is another common requirement in enterprise integration. For example, in an organization, there can be a need for running an integration process to synchronize two systems every day at the day end.  

In Micro Integrator, execution of a message mediation process can be automated to run periodically by using a 'Scheduled task'. You can schedule a task to run in the time interval of 't' for 'n' number of times or to run once the Micro Integrator starts. 

Furthermore, you can use cron expressions for more advanced executing time configuration.

<table>
	<tr>
		<td>
			<b>Examples</b></br>
			<ul>
				<li>
					<a href="../../examples/scheduled-tasks/task-scheduling-simple-trigger.md">Task Scheduling using a Simple Trigger</a>
				</li>
				<li>
					<a href="../../examples/scheduled-tasks/injecting-messages-to-rest-endpoint.md">Injecting Message to a RESTful Endpoint</a>
				</li>
			</ul>
		</td>
	</tr>
</table>