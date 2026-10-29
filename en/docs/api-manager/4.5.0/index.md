---
title: "WSO2 API Manager 4.5.0 Documentation"
description: "Home page for WSO2 API Manager 4.5.0 documentation, linking to getting started guides, deployment options, setup, and developer resources."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.5.0/
md_url: https://wso2.com/api-platform/docs/api-manager/4.5.0.md
tags:
  - api-manager
  - getting-started
  - architecture
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
# Keep the left product nav; hide TOC so the landing cards have room.
hide:
  - toc
---

<style>
    @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(https://wso2.cachefly.net/wso2/sites/all/fonts/docs/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format('woff2');
    }

    .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    }

    /* Landing page — sized for content column beside the primary nav */
    .homePage {
        max-width: 100%;
        box-sizing: border-box;
    }

    .homePage .content {
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .homePage .card {
        min-height: 220px;
        height: auto;
        color: #404040;
        background: #f8f8f8;
        padding: 1rem 1.2rem 0.7rem;
        box-shadow: 0px 5px 4px 0px rgba(105, 113, 120, 0.4);
        border-radius: 10px;
        font-size: 16px;
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
    }

    .homePage .card-wrapper {
        width: 100%;
        display: flex;
        max-width: 100%;
        flex: 1 1 240px;
    }

    .homePage .card-content {
        justify-content: flex-start;
        display: flex;
        align-items: flex-start;
        text-align: left;
        flex-direction: column;
        width: 100%;
    }

    .homePage .card .title {
        font-family: Montserrat, sans-serif;
        font-style: normal;
        font-size: 1rem;
        margin: 0;
        text-align: left;
        font-weight: 600;
        white-space: normal;
        text-transform: none;
        display: flex;
    }

    .homePage .card-icon {
        height: 30px;
        max-width: 80px;
        display: flex;
        align-items: center;
        color: #ff5003;
    }

    .homePage .removeTopMargin {
        margin-top: 0;
    }

    .homePage .rowAlignment {
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .homePage .rowAlignmentProductNameIcon {
        justify-content: flex-start;
        align-items: center;
        display: flex;
        gap: 10px;
        flex-direction: row;
        margin-bottom: 0;
    }

    .homePage .description-section {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
        gap: 1.5rem;
        align-items: center;
        margin: 0 0 1.5rem;
    }

    .homePage .description-media {
        width: 100%;
        max-width: 100%;
        margin: 0;
        float: none;
    }

    .homePage .description-media iframe {
        width: 100%;
        max-width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        min-height: 180px;
        border: 0;
        border-radius: 6px;
    }

    .homePage .component-section {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        gap: 1.5rem;
        align-items: start;
    }

    .homePage .tiles-container {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 1rem;
        width: 100%;
    }

    .homePage .tiles-column {
        flex: 1 1 220px;
        min-width: 0;
        max-width: 100%;
    }

    .homePage .tile {
        background-color: rgba(255, 255, 255, 0.03);
        padding: 1.25rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 0 0 1rem;
        box-sizing: border-box;
        width: 100%;
    }

    .homePage .tile:hover {
        transform: scale(1.01);
    }

    .homePage .tile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgb(215, 215, 215);
        gap: 0.5rem;
    }

    .homePage .tile h3 {
        font-size: 0.95rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    .homePage .tile-icon {
        margin-left: 0.5rem;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .homePage .links-list {
        padding-left: 0;
        margin: 0.75rem 0 0;
    }

    .homePage .links-list li {
        list-style-type: none;
        margin: 0.35rem 0;
    }

    .homePage .link {
        display: inline-block;
        margin-left: 0;
        color: var(--md-typeset-color) !important;
        text-decoration: none;
    }

    .homePage .link:hover {
        color: rgb(255, 112, 67) !important;
        text-decoration: none;
    }

    .homePage .link:before {
        content: '→';
        font-weight: bold;
        margin-right: 5px;
    }

    .homePage .button-container {
        text-align: right;
        margin-top: 0.5rem;
    }

    .homePage .view-all-button {
        display: inline-block;
        color: var(--md-typeset-color) !important;
        text-decoration: none;
        border-radius: 5px;
    }

    .homePage .view-all-button:hover {
        color: rgb(255, 112, 67) !important;
    }

    .homePage .section05 {
        display: flex;
        justify-content: flex-start;
        margin-top: 1.5rem;
        width: 100%;
    }

    .homePage .leftContent {
        margin-right: 0;
        min-width: 0;
    }

    /* Content column beside the primary nav is narrower than a full-bleed landing */
    @media (max-width: 1220px) {
        .homePage .description-section {
            grid-template-columns: 1fr;
        }

        .homePage .description-media iframe {
            min-height: 220px;
        }

        .homePage .tiles-column {
            flex: 1 1 calc(50% - 0.5rem);
        }
    }

    @media (max-width: 960px) {
        .homePage .component-section {
            grid-template-columns: 1fr;
        }

        .homePage .tiles-column {
            flex: 1 1 100%;
        }

        .homePage .button-container {
            text-align: left;
        }
    }

    @media (max-width: 480px) {
        .homePage .card {
            padding: 15px;
        }

        .homePage .tile {
            padding: 1rem;
        }
    }
</style>

{% set tiles = [
    [{
        "title": "Get Started",
        "icon": "🚀",
        "links": [
            {"name": "Overview", "url": "get-started/overview/"},
            {"name": "Key Concepts", "url": "get-started/key-concepts/"},
            {"name": "Quick Start Guide", "url": "get-started/api-manager-quick-start-guide/"},
            {"name": "About this Release", "url": "get-started/about-this-release/"}
        ]
    },
    {
        "title": "Deployment Options",
        "icon": "🔗",
        "links": [
            {"name": "Deploy on VM", "url": "install-and-setup/install/installing-the-product/running-the-api-m/"},
            {"name": "Deploy on Kubernetes", "url": "install-and-setup/install/deploying-api-manager-with-kubernetes-resources/"},
            {"name": "SaaS", "url": "https://wso2.com/api-platform/docs/"}
        ]
    }],
    [{
        "title": "Setup",
        "icon": "🏗️",
        "links": [
            {"name": "Install", "url": "install-and-setup/install/installing-the-product/installing-api-m-runtime/"},
            {"name": "Deploy", "url": "install-and-setup/setup/deployment-overview/"},
            {"name": "Upgrade WSO2 API Manager", "url": "install-and-setup/upgrading-wso2-api-manager/upgrading-api-manager/"}
        ]
    },
    {
        "title": "Developer Resources",
        "icon": "🔧",
        "links": [
            {"name": "Product Rest APIs", "url": "reference/product-apis/overview/"},
            {"name": "Tooling", "url": "reference/apictl/wso2-api-controller/"},
            {"name": "SDKs", "url": "consume/generating-sdks/generate-sdks-in-dev-portal/"},
            {"name": "Configuration Catalog", "url": "reference/config-catalog/"}
        ]
    }
    ],
    [
    {
        "title": "Guides",
        "icon": "📖",
        "links": [
            {"name": "Designing APIs", "url": "manage-apis/design/design-api-overview/"},
            {"name": "Create an API Product", "url": "manage-apis/design/create-api-product/create-api-product/"},
            {"name": "Authentication", "url": "manage-apis/design/api-security/api-authentication/api-authentication-overview/"},
            {"name": "Authorization", "url": "manage-apis/design/api-security/authorization/api-authorization/"},
            {"name": "Rate Limiting", "url": "manage-apis/design/rate-limiting/introducing-throttling-use-cases/"},
            {"name": "Consuming APIs", "url": "consume/consume-api-overview/"},
            {"name": "Analytics", "url": "monitoring/api-analytics/choreo-analytics/getting-started-guide/"},
            {"name": "CI/CD", "url": "install-and-setup/setup/api-controller/ci-cd-with-wso2-api-management/"}
        ],
        "more_btn": {"name": "View More", "url": "tutorials/tutorials-overview/"}
    },
    {
        "title": "Community and Support",
        "icon": "❓",
        "links": [
            {"name": "GitHub", "url": "https://github.com/wso2/api-manager/issues"},
            {"name": "Discord Channel", "url": "https://discord.com/invite/wso2"},
            {"name": "Enterprise Support", "url": "https://wso2.com/subscription/"}
        ]
    }
    ]
] %}

<div class="ai-recommendation-banner">
    We recommend the <strong>WSO2 API Platform AI Gateway</strong>, with <strong>WSO2 AI Workspace</strong> as its control plane, for all new AI APIs and MCP Servers. See <a href="https://wso2.com/api-platform/docs/ai-gateway/1.2.0/quick-start-guide/">Get started with WSO2 AI Gateway</a>.
</div>

<div class="homePage">
    <div class="description-section">
        <div class="leftContent">
            <p>
                WSO2 API Manager is a complete platform for building, integrating, and exposing your digital services as managed APIs in the cloud, on-premises, and hybrid architectures to drive your digital transformation strategy. 
            </p>
            <p>
                It allows API developers to design, publish, and manage the lifecycle of APIs and API product 
                managers to create API products from one or more APIs.
            </p>
        </div>
        <div class="description-media">
            <iframe src="https://www.youtube.com/embed/nr1cFyxVdDw" title="WSO2 API Manager overview" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div>
    <div class="section05">
        <div class="tiles-container">
            {% for column in tiles %}
            <div class="tiles-column">
                {% for tile in column %}
                <div class="tile">
                    <div class="tile-header">
                        <h3>{{ tile.title }}</h3>
                        <span class="tile-icon">{{ tile.icon }}</span>
                    </div>
                    <ul class="links-list">
                        {% for link in tile.links %}
                        <li>
                            {% if tile.title == "Community and Support" or link.name == "SaaS" %}
                                <a href="{{ link.url }}" target="_blank" class="link">{{ link.name }}</a>
                            {% else %}
                                <a href="{{ link.url }}" class="link">{{ link.name }}</a>
                            {% endif %}
                        </li>
                        {% endfor %}
                    </ul>
                    {% if tile.more_btn %}
                    <div class="button-container">
                        <a href="{{ tile.more_btn.url }}" class="view-all-button">{{ tile.more_btn.name }}</a>
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            {% endfor %}
        </div>
    </div>
    <div>
        <h3>Components</h3>
        <hr/>
        <p>WSO2 API Manager offers multiple components designed to work together to solve the challenges of diverse infrastructure requirements. A unified control plane supporting multiple gateways provides deployment flexibility, minimizes downtime, and provides scalability and resource optimization by allowing independent component management, flexible deployment packages, and seamless upgrades and maintenance. For more information see <a href="get-started/apim-architecture/">Architecture.</a></p>
        </br>
        </br>
        <div class="component-section">
            <div>
                <div>
                    <h4>Control Plane</h4>
                    </br>
                </div>
                <div class="content">
                    <!-- begin card -->
                    <div class="card-wrapper">
                        <div class="card">
                            <div class="card-content">
                                <div class="rowAlignment">
                                    <div class="rowAlignmentProductNameIcon">
                                        <div class="card-icon">
                                            <i class="material-icons md-36">supervisor_account</i>
                                        </div>
                                        <p class="title"><b>WSO2 API Control Plane</b></p>
                                    </div>
                                </div>
                                <hr/>
                                <p class="removeTopMargin">A Unified control plane which centrally manages and governs APIs across multiple Gateways</p>
                                <div>
                                    <ul>
                                        <li><a href="get-started/apim-architecture/#api-control-plane">WSO2 API Control Plane Overview</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->
                </div>
            </div>
            <div>
                <div>
                    <h4>Data Plane</h4>
                    </br>
                </div>
                <div class="content">
                    <!-- begin card -->
                    <div class="card-wrapper">
                        <div class="card">
                            <div class="card-content">
                                <div class="rowAlignment">
                                    <div class="rowAlignmentProductNameIcon">
                                        <div class="card-icon">
                                            <i class="material-icons md-36">public</i>
                                        </div>
                                        <p class="title"><b>WSO2 Universal Gateway</b></p>
                                    </div>
                                </div>
                                <hr/>
                                <p class="removeTopMargin">Secure and proxy API traffic with enterprise-grade features</p>
                                <div>
                                    <ul>
                                        <li><a href="get-started/apim-architecture/#universal-gateway">WSO2 Universal Gateway Overview</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->
                    <!-- begin card -->
                    <div class="card-wrapper">
                        <div class="card">
                            <div class="card-content">
                                <div class="rowAlignment">
                                    <div class="rowAlignmentProductNameIcon">
                                        <div class="card-icon">
                                            <i class="material-icons md-36">cloud</i>
                                        </div>
                                        <p class="title"><b>WSO2 Kubernetes Gateway</b></p>
                                    </div>
                                </div>
                                <hr/>
                                <p class="removeTopMargin">Designed to build, deploy, and manage APIs in a cloud environment</p>
                                <div>
                                    <ul>
                                        <li><a href="get-started/apim-architecture/#kubernetes-gateway">WSO2 Kubernetes Gateway Overview</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->
                    <!-- begin card -->
                    <div class="card-wrapper">
                        <div class="card">
                            <div class="card-content">
                                <div class="rowAlignment">
                                    <div class="rowAlignmentProductNameIcon">
                                        <div class="card-icon">
                                            <i class="material-icons md-36">cloud_circle</i>
                                        </div>
                                        <p class="title"><b>WSO2 Immutable Gateway</b></p>
                                    </div>
                                </div>
                                <hr/>
                                <p class="removeTopMargin">An API Gateway for micro services, which is cloud-native, decentralized and developer centric</p>
                                <div>
                                    <ul>
                                        <li><a href="get-started/apim-architecture/#immutable-gateway">WSO2 Immutable Gateway Overview</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->
                    <!-- begin card -->
                    <div class="card-wrapper">
                        <div class="card">
                            <div class="card-content">
                                <div class="rowAlignment">
                                    <div class="rowAlignmentProductNameIcon">
                                        <div class="card-icon">
                                            <i class="material-icons md-36">device_hub</i>
                                        </div>
                                        <p class="title"><b>Federated Gateways</b></p>
                                    </div>
                                </div>
                                <hr/>
                                <p class="removeTopMargin">Manage APIs spanning multiple cloud platforms, on-premises systems, or regions</p>
                                <div>
                                    <ul>
                                        <li><a href="manage-apis/deploy-and-publish/deploy-on-gateway/federated-gateways/deploy-on-aws-api-gateway/">AWS API Gateway</a></li>
                                        <li><a href="tutorials/integrating-with-solace/">Solace Broker</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->
                </div>
            </div>
        </div>
    </div>
</div>
