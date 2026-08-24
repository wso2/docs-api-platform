---
title: "Choosing your deployment strategy"
description: "Match a WSO2 API Manager deployment pattern and platform to your needs, with scenarios for testing, high availability, high traffic, and isolation."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/get-started/choosing-your-deployment-strategy/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/get-started/choosing-your-deployment-strategy.md
tags:
  - api-manager
  - get-started
  - choosing-your-deployment-strategy
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "explanation"
---

# Choosing Your Deployment Strategy

Selecting the right deployment strategy for WSO2 API Manager involves making two key, independent decisions based on your specific needs:

1.  **[Deployment Platform](../get-started/deployment-platforms.md)**: *Where* will your system run?
2.  **[Deployment Pattern](../get-started/deployment-patterns.md)**: *How* will the components be architected?

This guide presents common scenarios to help you choose the best combination of platform and pattern.

---

## Key Factors to Consider

Before choosing, evaluate your requirements based on these factors:

| Factor | Description |
| :--- | :--- |
| **Scalability** | How much API traffic do you expect? Will it grow over time? Do you need to handle sudden traffic spikes? |
| **High Availability (HA)** | Can your business tolerate downtime? Do you need automatic failover and redundancy for all components? |
| **Security & Compliance**| What are your organization's security policies? Do you need to isolate traffic-facing components? |
| **Operational Overhead** | What is your team's expertise and preferred workflow (traditional infrastructure vs. cloud-native DevOps)? |

---

## Common Deployment Scenarios

### Scenario 1: Development and Testing
*   **If your primary need is...** simplicity and speed of setup for a non-production environment.
*   **Then the recommended approach is...**
    *   **Pattern**: **[Pattern 0: Single Node](../get-started/deployment-patterns.md#pattern-0-single-node)**
    *   **Platform**: Either **[Virtual Machines](../get-started/deployment-platforms.md#on-premises-virtual-machines-vms)** for a traditional setup or a lightweight **[Kubernetes](../get-started/deployment-platforms.md#kubernetes-and-cloud-native)** cluster.

### Scenario 2: Small-Scale Production with High Availability
*   **If your primary need is...** fault tolerance and reliability with minimal operational complexity.
*   **Then the recommended approach is...**
    *   **Pattern**: **[Pattern 1: All-in-One HA](../get-started/deployment-patterns.md#pattern-1-all-in-one-high-availability-ha)**
    *   **Platform**: Either **[Virtual Machines](../get-started/deployment-platforms.md#on-premises-virtual-machines-vms)** or **[Kubernetes](../get-started/deployment-platforms.md#kubernetes-and-cloud-native)**.

### Scenario 3: Scalable Gateway with a Simple Control Plane
*   **If your primary need is...** to scale only the API Gateway for traffic, while keeping the management components unified and simple.
*   **Then the recommended approach is...**
    *   **Pattern**: **[Pattern 2: Simple Scalable Deployment](../get-started/deployment-patterns.md#pattern-2-simple-scalable-deployment)**
    *   **Platform**: **[Kubernetes](../get-started/deployment-platforms.md#kubernetes-and-cloud-native)** or **[Virtual Machines](../get-started/deployment-platforms.md#on-premises-virtual-machines-vms)**.

### Scenario 4: Standard Production with High Traffic
*   **If your primary need is...** to independently scale multiple components (Gateway, Traffic Manager) to handle high API traffic with strong isolation.
*   **Then the recommended approach is...**
    *   **Pattern**: **[Pattern 3: Recommended Distributed](../get-started/deployment-patterns.md#pattern-3-recommended-distributed-deployment)**
    *   **Platform**: **[Kubernetes](../get-started/deployment-platforms.md#kubernetes-and-cloud-native)** is ideal for its auto-scaling capabilities, but **[Virtual Machines](../get-started/deployment-platforms.md#on-premises-virtual-machines-vms)** are also fully supported.

### Scenario 5: Ultimate Scalability & Isolation
*   **If your primary need is...** maximum security, full component isolation, or integration with a central corporate IdP.
*   **Then the recommended approach is...**
    *   **Pattern**: **[Pattern 4: Fully Distributed with Key Manager Seperation](../get-started/deployment-patterns.md#pattern-4-fully-distributed-deployment-with-key-manager-separation)**
    *   **Platform**: **[Kubernetes](../get-started/deployment-platforms.md#kubernetes-and-cloud-native)** or **[Virtual Machines](../get-started/deployment-platforms.md#on-premises-virtual-machines-vms)**.

### Scenario 6: Targeted Scaling for Gateway & Identity
*   **If your primary need is...** to scale the Gateway and also isolate the Key Manager for security or heavy authentication loads.
*   **Then the recommended approach is...**
    *   **Pattern**: **[Pattern 5: Simple Scalable with Key Manager Separation](../get-started/deployment-patterns.md#pattern-5-simple-scalable-with-key-manager-separation)**
    *   **Platform**: **[Kubernetes](../get-started/deployment-platforms.md#kubernetes-and-cloud-native)** or Virtual Machines. 

---

### Summary Matrix

This matrix provides a quick reference for choosing a pattern based on your primary requirement.

| Primary Requirement | Recommended Pattern | Common Platform(s) |
| :--- | :--- | :--- |
| **Simplicity (Dev/Test)** | [Pattern 0: All-in-One](../get-started/deployment-patterns.md#pattern-0-single-node) | VM, Kubernetes |
| **Basic HA (Small Prod)** | [Pattern 1: All-in-One HA](../get-started/deployment-patterns.md#pattern-1-all-in-one-high-availability-ha) | VM, Kubernetes |
| **Balanced Gateway Scaling** | [Pattern 2: Simple Scalable](../get-started/deployment-patterns.md#pattern-2-simple-scalable-deployment) | VM, Kubernetes |
| **Standard Production** | [Pattern 3: Distributed](../get-started/deployment-patterns.md#pattern-3-recommended-distributed-deployment) | Kubernetes, VM |
| **Ultimate Scalability & Isolation**| [Pattern 4: Fully Distributed](../get-started/deployment-patterns.md#pattern-4-fully-distributed-deployment-with-key-manager-separation) | Kubernetes, VM |
| **Targeted Scaling for Gateway & Identity** | [Pattern 5: Simple Scalable with KM Separation](../get-started/deployment-patterns.md#pattern-5-simple-scalable-with-key-manager-separation) | Kubernetes, VM |