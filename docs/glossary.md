---
title: "Glossary"
description: "Definitions of the terms used in the API Management docs, such as organization, project, build, environment, gateway, and invoke URL."
---

This page defines the terms that the API Management docs use. The terms are in alphabetical order.

## API Portal and AI Hub

The portal where API consumers discover your APIs, read their documentation, subscribe to them, and get credentials. AI agents discover the same APIs through machine-readable endpoints. You publish APIs to it from the API Control Plane. In these docs, "portal" means the API Portal and AI Hub.

## API proxy

The configuration that exposes your backend service through a gateway. It holds the resources, the policies, and the backend endpoint. In these docs, "API" and "API proxy" mean the same thing.

## Application

An optional group of API keys and OAuth2 keys in the API Portal and AI Hub. You use it to track usage and see analytics. You don't need an application to invoke an API.

## Build

A snapshot of an API proxy that you deploy to gateways. Builds are named by date, such as `2026-11-16-7`. When you promote an API proxy to the next environment, you promote the same build.

## Cloud gateway

A gateway that Choreo Labs runs, scales, and upgrades for you. See [Gateways](./key-concepts.md#gateways).

## Context

The path prefix that a gateway uses to serve an API. The console builds it from the project, the identifier, and the version, for example `/default/reading-list-api/v1.0.0`.

## Control plane

The part of API Management that manages organizations and projects, and the API proxy lifecycle from creation to publishing. See [Control Plane and Data Planes](./key-concepts.md#control-plane-and-data-planes).

## CORS

Cross-Origin Resource Sharing. A browser rule that lets a web page call another address only if the server allows it. In the API Console, **Direct** mode needs the gateway to allow the console with a CORS policy.

## Data plane

The part of API Management where deployed API proxies run. A cloud gateway runs in a data plane that Choreo Labs manages. A self-hosted gateway runs in a data plane that you manage.

## Environment

An isolated deployment area, such as development or production. Each environment has its own gateways and endpoint URLs. See [Environments](./key-concepts.md#environments).

## Handle

A short, unique name that the console creates from a name that you enter. A gateway or a portal has one. You can't change the handle of a gateway after you create it.

## Identifier

The unique ID of an API in your organization. The console creates it from the API name, for example `reading-list-api`.

## Invoke URL

The URL that a gateway exposes for an API. It combines the address of the gateway with the context of the API. Consumers send requests to it.

## Key manager

The OAuth2 authorization server that issues access tokens for OAuth2-secured APIs. See [Key Managers](./api-portal/administer/key-managers/overview.md).

## Login environment

The environment whose authentication server portal users sign in through.

## Organization

The top-level container for your projects, API proxies, gateways, and environments. See [Organizations](./key-concepts.md#organizations).

## Pipeline

The ordered sequence of environments that an API proxy moves through on its way to production. See [Pipelines](./key-concepts.md#pipelines).

## Policy

A unit of behavior that a gateway applies to the requests and responses of an API, such as authentication or rate limiting. The [Policy Hub](./policy-hub/overview.md) is the curated library of policies.

## Project

A group of API proxies that work together to deliver a business capability. See [Projects](./key-concepts.md#projects).

## Registration token

The token that a self-hosted gateway uses to connect to the control plane. The console shows it only once, when you create the gateway.

## Self-hosted gateway

A gateway that runs on your own infrastructure, such as a virtual machine, Docker, or Kubernetes, and connects to the control plane. See [Gateways](./key-concepts.md#gateways).

## Subscription plan

A set of rules that defines how many requests an application can make to an API in a time window. See [Manage Subscription Plans](./api-control-plane/administer/creating-subscription-plans.md).

## xDS

The Envoy discovery protocol. The gateway controller uses it to send configuration to the router and to the policy engine.
