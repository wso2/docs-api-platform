// Navigation for API Platform Cloud: API Control Plane content at the top
// level, with API Portal and AI Hub as its own section.

const doc = (id, label) => ({type: 'doc', id, label});
const group = (label, items) => ({type: 'category', label, items});
// A non-clickable section title between top-level items (styled by
// .sidebar-section-title in custom.css).
const section = (label) => ({
  type: 'html',
  value: label,
  className: 'sidebar-section-title',
  defaultStyle: true,
});
// A divider that closes a section (.sidebar-section-end in custom.css).
const sectionEnd = () => ({
  type: 'html',
  value: '<span aria-hidden="true"></span>',
  className: 'sidebar-section-end',
});

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    doc("overview", "Overview"),
    doc("get-started", "Get Started"),
    doc("key-concepts", "Key Concepts"),
    group("API Control Plane", [
      doc("api-control-plane/overview", "Overview"),
      doc("getting-started/api-proxy", "Quick Start Guide"),
      group("Create", [
        doc("create-api-proxy/overview", "Overview"),
        group("REST APIs", [
          doc("create-api-proxy/rest-apis/start-from-scratch", "Start from Scratch"),
          doc("create-api-proxy/rest-apis/start-with-a-contract", "Start with a Contract"),
        ]),
        group("GraphQL APIs", [
          doc("create-api-proxy/graphql-apis/start-from-scratch", "Start from Scratch"),
          doc("create-api-proxy/graphql-apis/start-with-a-schema", "Start with a Schema"),
        ]),
      ]),
      group("Develop", [
        group("Security", [
          doc("develop-api-proxy/security/overview", "Overview"),
          doc("develop-api-proxy/security/api-key-authentication", "API Key Authentication"),
          doc("develop-api-proxy/security/oauth2-authentication", "OAuth2 Authentication"),
        ]),
        group("Policies", [
          doc("develop-api-proxy/policy/overview", "Overview"),
          doc("develop-api-proxy/policy/attach-and-manage-policies", "Attach and Manage Policies"),
        ]),
        doc("develop-api-proxy/documents", "Documents"),
      ]),
      group("Deploy", [
        doc("deploy-api-proxy/overview", "Overview"),
      ]),
      group("Test", [
        doc("test-api-proxy/api-console", "API Console"),
        doc("test-api-proxy/graphql-console", "GraphQL Console"),
        doc("test-api-proxy/curl", "cURL"),
      ]),
      group("Publish", [
        doc("publish-api-proxy/publish-an-api", "Publish an API"),
        doc("publish-api-proxy/customize-portal-listing", "Customize the Portal Listing"),
        doc("publish-api-proxy/subscription-plans-and-billing", "Subscription Plans"),
        doc("publish-api-proxy/deprecate-or-unpublish", "Deprecate or Unpublish an API"),
        doc("publish-api-proxy/make-an-api-ai-ready", "Make an API AI-Ready"),
      ]),
      group("Observability", [
        doc("api-control-plane/logs", "Logs"),
        doc("api-control-plane/metrics", "Metrics"),
      ]),
      group("Insights", [
        doc("api-control-plane/api-insights", "Overview"),
      ]),
      group("Administer", [
        doc("administer/managing-environments", "Manage Environments"),
        doc("administer/managing-pipelines", "Manage Pipelines"),
        doc("administer/managing-gateways", "Manage Gateways"),
        doc("administer/managing-portals", "Manage Portals"),
        // doc("administer/customizing-portal-theme", "Customize the Portal Theme"),
        doc("administer/creating-subscription-plans", "Manage Subscription Plans"),
      ]),
    ]),
    group("API Portal and AI Hub", [
      doc("api-portal/overview", "Overview"),
      doc("api-portal/quickstart-guide", "Quick Start Guide"),
      group("Discover", [
        doc("api-portal/discover-apis/browse-apis", "Search APIs"),
        doc("api-portal/discover-apis/documentation", "API Documentation"),
        doc("api-portal/mcp-servers/browse-mcp-servers", "MCP Servers"),
        doc("api-portal/ai-agent-discovery", "AI Agents"),
      ]),
      group("Applications and Credentials", [
        doc("api-portal/consume-an-api/overview", "Which Credentials You Need"),
        doc("api-portal/consume-an-api/manage-applications", "Manage Applications"),
        doc("api-portal/consume-an-api/manage-subscriptions", "Manage Subscriptions"),
        doc("api-portal/consume-an-api/manage-api-keys", "Manage API Keys"),
      ]),
      group("Consume an API", [
        doc("api-portal/consume-an-api/oauth2", "Consume an OAuth2-Secured API"),
        doc("api-portal/consume-an-api/api-key", "Consume an API-Key-Secured API"),
      ]),
      doc("api-portal/admin-settings/key-manager-integration", "Manage Key Managers"),
    ]),
    group("API Gateway", [
      doc("api-gateway/overview", "Overview"),
      group("Self-Hosted Gateways", [
        doc("hybrid-gateways/api-gateway/architecture", "Architecture"),
        doc("hybrid-gateways/api-gateway/getting-started", "Quick Start Guide"),
        doc("hybrid-gateways/api-gateway/manage-policies", "Add and Manage Policies"),
        doc("hybrid-gateways/api-gateway/high-availability", "High Availability"),

      ]),
      group("Observability", [
        doc("api-gateway/observability", "Overview"),
        doc("hybrid-gateways/api-gateway/observability/logging", "Gateway Logging"),
        doc("hybrid-gateways/api-gateway/observability/tracing", "Gateway Tracing"),
      ]),
      doc("api-gateway/insights", "Insights"),
    ]),
    group("Insights", [
      doc("insights/overview", "Overview"),
    ]),
    group("Observability", [
      doc("observability/overview", "Overview"),
    ]),
    group("Monetization", [
      doc("monetization/overview", "Overview"),
    ]),
        group("Policy Hub", [
      doc("policy-hub/overview", "Overview"),
    ]),
    group("Tools", [
      group("API Designer for VS Code", [
        doc("tools/vscode-api-design/getting-started", "Get Started"),
        doc("tools/vscode-api-design/design-apis", "Design APIs"),
        doc("tools/vscode-api-design/govern-apis", "Govern APIs"),
        doc("tools/vscode-api-design/end-to-end-tutorial", "End-to-End Tutorial"),
      ]),
    ]),
  ],
};

export default sidebars;
