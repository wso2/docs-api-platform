// Navigation for API Management Cloud: API Control Plane content at the top
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
      doc("api-control-plane/quickstart-guide", "Quick Start Guide"),
      group("Create", [
        doc("api-control-plane/create-api-proxy/overview", "Overview"),
        group("REST APIs", [
          doc("api-control-plane/create-api-proxy/rest-apis/start-from-scratch", "Start from Scratch"),
          doc("api-control-plane/create-api-proxy/rest-apis/start-with-a-contract", "Start with a Contract"),
        ]),
        group("GraphQL APIs", [
          doc("api-control-plane/create-api-proxy/graphql-apis/start-from-scratch", "Start from Scratch"),
          doc("api-control-plane/create-api-proxy/graphql-apis/start-with-a-schema", "Start with a Schema"),
        ]),
      ]),
      group("Develop", [
        group("Security", [
          doc("api-control-plane/develop-api-proxy/security/overview", "Overview"),
          doc("api-control-plane/develop-api-proxy/security/api-key-authentication", "API Key Authentication"),
          doc("api-control-plane/develop-api-proxy/security/oauth2-authentication", "OAuth2 Authentication"),
        ]),
        group("Policies", [
          doc("api-control-plane/develop-api-proxy/policy/overview", "Overview"),
          doc("api-control-plane/develop-api-proxy/policy/attach-and-manage-policies", "Attach and Manage Policies"),
        ]),
        doc("api-control-plane/develop-api-proxy/documents", "Documents"),
      ]),
      group("Deploy", [
        doc("api-control-plane/deploy-api-proxy/overview", "Overview"),
      ]),
      group("Test", [
        doc("api-control-plane/test-api-proxy/api-console", "API Console"),
        doc("api-control-plane/test-api-proxy/graphql-console", "GraphQL Console"),
        doc("api-control-plane/test-api-proxy/curl", "cURL"),
      ]),
      group("Publish", [
        doc("api-control-plane/publish-api-proxy/publish-an-api", "Publish an API"),
        doc("api-control-plane/publish-api-proxy/customize-portal-listing", "Customize the Portal Listing"),
        doc("api-control-plane/publish-api-proxy/subscription-plans-and-billing", "Subscription Plans"),
        doc("api-control-plane/publish-api-proxy/deprecate-or-unpublish", "Deprecate or Unpublish an API"),
        doc("api-control-plane/publish-api-proxy/make-an-api-ai-ready", "Make an API AI-Ready"),
      ]),
      group("Observability", [
        doc("api-control-plane/observability/logs", "Logs"),
      ]),
      // group("Insights", [
      //   doc("api-control-plane/insights/api-insights", "Overview"),
      // ]),
      group("Administer", [
        doc("api-control-plane/administer/managing-environments", "Manage Environments"),
        doc("api-control-plane/administer/managing-pipelines", "Manage Pipelines"),
        doc("api-control-plane/administer/managing-gateways", "Manage Gateways"),
        doc("api-control-plane/administer/managing-portals", "Manage Portals"),
        // doc("api-control-plane/administer/customizing-portal-theme", "Customize the Portal Theme"),
        doc("api-control-plane/administer/creating-subscription-plans", "Manage Subscription Plans"),
      ]),
    ]),
    group("API Portal and AI Hub", [
      doc("api-portal/overview", "Overview"),
      doc("api-portal/quickstart-guide", "Quick Start Guide"),
      group("Discover", [
        doc("api-portal/discover/browse-apis", "Search APIs"),
        doc("api-portal/discover/documentation", "API Documentation"),
        doc("api-portal/discover/browse-mcp-servers", "MCP Servers"),
        doc("api-portal/discover/api-workflows", "API Workflows"),
        doc("api-portal/discover/ai-agent-discovery", "AI Agents"),
      ]),
      group("Consume an API", [
        doc("api-portal/consume-an-api/overview", "Which Credentials You Need"),
        doc("api-portal/consume-an-api/oauth2", "Consume an OAuth2-Secured API"),
        doc("api-portal/consume-an-api/api-key", "Consume an API-Key-Secured API"),
      ]),
      group("Manage Keys", [
        doc("api-portal/manage-keys/oauth2-keys", "OAuth2 Keys"),
        doc("api-portal/manage-keys/api-keys", "API Keys"),
      ]),
      group("Manage Usage", [
        doc("api-portal/manage-usage/overview", "Overview"),
        doc("api-portal/manage-usage/manage-applications", "Manage Applications"),
        doc("api-portal/manage-usage/manage-subscriptions", "Manage Subscriptions"),
      ]),
      group("Administer", [
        doc("api-portal/administer/manage-api-consumers", "Manage API Consumers"),
        group("Key Managers", [
          doc("api-portal/administer/key-managers/overview", "Overview"),
          doc("api-portal/administer/key-managers/custom-key-manager", "Configure a Custom Key Manager"),
        ]),
        group("Organization", [
          doc("api-portal/admin-settings/organization-settings", "Organization Settings"),
          doc("api-portal/admin-settings/manage-views", "Manage Views"),
          doc("api-portal/admin-settings/manage-labels", "Manage Labels"),
          doc("api-portal/admin-settings/subscription-plans", "Subscription Plans"),
        ]),
        group("Content", [
          doc("api-portal/admin-settings/manage-apis", "Manage APIs"),
          doc("api-portal/admin-settings/manage-mcp-servers", "Manage MCP Servers"),
        ]),
        group("Integrations", [
          doc("api-portal/admin-settings/webhook-integration", "Webhooks"),
        ]),
        group("AI & Discovery", [
          doc("api-portal/admin-settings/llm-instructions", "LLM Instructions"),
          doc("api-portal/admin-settings/manage-api-workflows", "API Workflows"),
        ]),
        group("Appearance", [
          doc("api-portal/administer/theming", "Theming"),
        ]),
      ]),
    ]),
    group("API Gateway", [
      doc("api-gateway/overview", "Overview"),
      group("Self-Hosted Gateways", [
        doc("api-gateway/self-hosted-gateways/architecture", "Architecture"),
        doc("api-gateway/self-hosted-gateways/quickstart-guide", "Quick Start Guide"),
        doc("api-gateway/self-hosted-gateways/setting-up", "Setting Up Guide"),
        doc("api-gateway/self-hosted-gateways/deploy-and-test-api", "Deploy and Test an API"),
        doc("api-gateway/self-hosted-gateways/manage-policies", "Add and Manage Policies"),
        doc("api-gateway/self-hosted-gateways/gateway-discovered-apis", "Gateway Discovered APIs"),
        doc("api-gateway/self-hosted-gateways/high-availability", "High Availability"),
      ]),
      group("Observability", [
        doc("api-gateway/observability/overview", "Overview"),
        doc("api-gateway/observability/logging", "Gateway Logging"),
        doc("api-gateway/observability/tracing", "Gateway Tracing"),
      ]),
      // doc("api-gateway/insights", "Insights"),
    ]),
    // group("Insights", [
    //   doc("insights/overview", "Overview"),
    // ]),
    group("Observability", [
      doc("observability/overview", "Overview"),
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
