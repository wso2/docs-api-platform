---
title: "Asynchronous message processing"
description: "Learn how asynchronous message processing works in the Micro Integrator and find related tutorials and examples."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/integration-use-case/asynchronous-message-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/integration-use-case/asynchronous-message-overview.md
tags:
  - api-manager
  - integrate
  - integration-use-case
  - asynchronous-message-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Asynchronous Message Processing

Asynchronous messaging is a communication method wherein the system puts a message in a message queue and does not require an immediate response to continue processing. Asynchronous messaging is useful for the following:

- Delegate the request to some external system for processing
- Ensure delivery of a message to an external system
- Throttle message rates between two systems
- Batch processing of messages

Note the following about asynchronous message processing:

- Asynchronous messaging solves the problem of intermittent connectivity. The message receiving party does not need to be online to receive the message as the message is stored in a middle layer. This allows the receiver to retrieve the message when it comes online.
- Message consumers do not need to know about the message publishers. They can operate independently.

Disadvantages of asynchronous messaging includes the additional component of a message broker or transfer agent to ensure the message is received. This may affect both performance and reliability. There are various levels of message delivery reliability grantees from publisher to broker and from broker to subscriber. Wire level protocols like AMQP and MQTT can provide those.

<table>
	<tr>
		<td>
			<b>Tutorials</b></br>
			<ul>
				<li>
					Try the end-to-end use case on <a href="../../../tutorials/integration-tutorials/storing-and-forwarding-messages.md">asynchronous messaging</a>
				</li>
			</ul>
		</td>
		<td>
			<b>RabbitMQ Examples</b>
            <ul>
                <li><a href="../../examples/rabbitmq_examples/point-to-point-rabbitmq.md">Point to Point</a></li>
                <li><a href="../../examples/rabbitmq_examples/pub-sub-rabbitmq.md">Publish/Subscribe</a></li>
                <li>Guaranteed Delivery 
                    <ul>
                        <li><a href="../../examples/rabbitmq_examples/store-forward-rabbitmq.md">Message Store and Message Processor</a></li>
                        <li><a href="../../examples/rabbitmq_examples/retry-delay-failed-msgs-rabbitmq.md">Retry failed messages with a delay</a></li>
                        <li><a href="../../examples/rabbitmq_examples/requeue-msgs-with-errors-rabbitmq.md">Requeue a message preserving the order</a></li>
                        <li><a href="../../examples/rabbitmq_examples/move-msgs-to-dlq-rabbitmq.md">Publish messages to DLX</a></li>
                    </ul>
                </li>
                <li>
                	<a href="../../examples/rabbitmq_examples/request-response-rabbitmq.md">Dual Channel</a>
                </li>
            </ul>
		</td>
		<td>
			<b>JMS Examples</b>
			<ul>
				<li>
					<a href="../../examples/jms_examples/consuming-jms.md">Consuming JMS Messages</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/producing-jms.md">Producing JMS Messages</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/consume-produce-jms.md">Consumining and Producing JMS Messages</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/dual-channel-http-to-jms.md">Dual Channel HTTP to JMS</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/quad-channel-jms-to-jms.md">Quad Channel JMS to JMS</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/guaranteed-delivery-with-failover.md">Guaranteed Delivery with Failover</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/publish-subscribe-with-jms.md">Publish and Subscribe with JMS</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/shared-topic-subscription.md">Shared Topic Subscriptions</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/detecting-repeatedly-redelivered-messages.md">Detecting Repeatedly Redilivered Messages</a>
				</li>
				<li>
					<a href="../../examples/jms_examples/specifying-a-delivery-delay-on-messages.md">Delivery Delay on Messages</a>
				</li>
			</ul>
		</td>
	</tr>
</table>