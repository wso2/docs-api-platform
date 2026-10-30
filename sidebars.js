// Navigation for API Platform Cloud: API Control Plane content at the top
// level, with AI Workspace and Developer Portal as their own sections.

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
    doc("key-concepts", "Key Concepts"),
    group("API Control Plane", [
      doc("api-control-plane/overview", "Overview"),
      doc("getting-started/api-proxy", "Quick Start Guide"),
      group("Create", [
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
          group("Secure API Access", [
            doc("develop-api-proxy/security/secure-api-access/overview", "Overview"),
            doc("develop-api-proxy/security/secure-api-access/api-platform-sts", "API Platform STS"),
            doc("develop-api-proxy/security/secure-api-access/asgardeo", "Asgardeo"),
            doc("develop-api-proxy/security/secure-api-access/azure-ad", "Microsoft Entra ID (Azure AD)"),
            doc("develop-api-proxy/security/secure-api-access/external-key-manager", "External Key Manager"),
          ]),
          group("Secure Backend Communication", [
            doc("develop-api-proxy/security/secure-backend-communication/oauth2", "OAuth2"),
            doc("develop-api-proxy/security/secure-backend-communication/mutual-tls", "Mutual TLS"),
          ]),
        ]),
        group("Policies", [
          doc("develop-api-proxy/policy/overview", "Overview"),
          doc("develop-api-proxy/policy/attach-and-manage-policies", "Attach and Manage Policies"),
        ]),
        doc("develop-api-proxy/documents", "Documents"),
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
      group("Administer", [
        doc("administer/managing-users", "Manage Users"),
        doc("administer/role-based-access-control", "Configure Role-Based Access Control"),
        doc("administer/managing-environments", "Manage Environments"),
        doc("gateways", "Manage Gateways"),
        doc("portals", "Manage Portals"),
        doc("developer-portal/theming-developer-portal", "Customize the Portal Theme"),
        doc("administer/creating-subscription-plans", "Manage Subscription Plans"),
      ]),
    ]),
    // AI Workspace is hidden for now. Its pages still build and can be
    // opened by URL. Remove the comment markers to show it again.
    /*
    group("AI Workspace", [
      doc("ai-workspace/getting-started", "Quick Start Guide"),
      group("LLM Providers", [
        doc("ai-workspace/llm-providers/overview", "Overview"),
        doc("ai-workspace/llm-providers/configure-and-consume-provider", "Configure and Consume Provider"),
        doc("ai-workspace/llm-providers/manage-provider", "Manage Provider"),
      ]),
      group("App LLM Proxies", [
        doc("ai-workspace/app-llm-proxies/overview", "Overview"),
        doc("ai-workspace/app-llm-proxies/configure-proxy", "Configure App LLM Proxy"),
        doc("ai-workspace/app-llm-proxies/manage-proxy", "Manage App LLM Proxy"),
        doc("ai-workspace/app-llm-proxies/multi-provider", "Route to several providers"),
      ]),
      group("MCP Proxies", [
        doc("ai-workspace/mcp-proxies/overview", "Overview"),
        doc("ai-workspace/mcp-proxies/configure-proxy", "Configure Proxy"),
        doc("ai-workspace/mcp-proxies/apply-policies", "Apply Policies"),
      ]),
      group("Agent Proxies", [
        doc("ai-workspace/agent-proxies/overview", "Overview"),
        doc("ai-workspace/agent-proxies/configure-proxy", "Configure Agent Proxy"),
        doc("ai-workspace/agent-proxies/manage-proxy", "Manage Agent Proxy"),
      ]),
      doc("ai-workspace/gen-ai-applications", "Gen AI Applications"),
      doc("ai-workspace/ai-gateway/setting-up", "AI Gateways"),
      group("Policies", [
        doc("ai-workspace/policies/overview", "Overview"),
        group("Guardrails", [
          doc("ai-workspace/policies/guardrails/overview", "Overview"),
          doc("ai-workspace/policies/guardrails/regex-pii-masking", "PII Masking Regex"),
          doc("ai-workspace/policies/guardrails/azure-content-safety", "Azure Content Safety"),
          doc("ai-workspace/policies/guardrails/word-count-guardrail", "Word Count"),
          doc("ai-workspace/policies/guardrails/sentence-count-guardrail", "Sentence Count"),
        ]),
        group("Rate Limit", [
          doc("ai-workspace/policies/rate-limit/llm-cost", "LLM Cost"),
          doc("ai-workspace/policies/rate-limit/token-based-rate-limit", "Token-Based Rate Limit"),
          doc("ai-workspace/policies/rate-limit/llm-cost-based-rate-limit", "LLM Cost-Based Rate Limit"),
        ]),
        group("Other Policies", [
          doc("ai-workspace/policies/other-policies/model-round-robin", "Model Round Robin"),
          doc("ai-workspace/policies/other-policies/prompt-decorator", "Prompt Decorator"),
          doc("ai-workspace/policies/other-policies/prompt-template", "Prompt Template"),
          doc("ai-workspace/policies/other-policies/semantic-cache", "Semantic Cache"),
        ]),
        doc("ai-workspace/policies/writing-an-ai-policy", "Writing an AI Policy"),
      ]),
      doc("ai-workspace/insights", "Insights"),
    ]),
    */
    group("Developer Portal", [
      doc("developer-portal/overview", "Overview"),
      doc("developer-portal/getting-started", "Quick Start Guide"),
      group("Discover", [
        doc("developer-portal/discover-apis/searching", "Search APIs"),
        doc("developer-portal/discover-apis/documentation", "API Documentation"),
        doc("developer-portal/discover-mcp-servers", "MCP Servers"),
        doc("developer-portal/ai-agent-discovery", "AI Agents"),
      ]),
      doc("developer-portal/consume-an-api", "Consume an API"),
      doc("developer-portal/manage-applications", "Manage Applications"),
      doc("developer-portal/manage-subscriptions", "Manage Subscriptions"),
    ]),
    group("API Gateway", [
      doc("api-gateway/overview", "Overview"),
      group("Self-Hosted Gateway", [
        doc("hybrid-gateways/api-gateway/getting-started", "Quick Start Guide"),
        group("Policies", [
          doc("hybrid-gateways/api-gateway/manage-policies", "Add and Manage Policies"),
          group("Custom Policies", [
            doc("hybrid-gateways/api-gateway/writing-a-custom-policy", "Writing a Custom Policy"),
            doc("hybrid-gateways/api-gateway/build-gateway-with-custom-policies", "Building the Gateway with Custom Policies"),
            doc("hybrid-gateways/api-gateway/apply-custom-policies-to-apis", "Apply Custom Policies to APIs"),
          ]),
        ]),
      ]),
      group("Third-Party Gateways", [
        doc("hybrid-gateways/api-gateway/third-party-gateways/api-discovery-aws", "AWS API Gateway"),
      ]),
    ]),
    // AI Gateway is hidden for now. Its pages still build and can be
    // opened by URL. Remove the comment markers to show it again.
    /*
    group("AI Gateway", [
      {
        type: 'category',
        label: 'LLM',
        link: {type: 'doc', id: 'hybrid-gateways/ai-gateway/llm/index'},
        items: [
          doc("hybrid-gateways/ai-gateway/llm/quick-start-guide", "Quick Start Guide"),
          doc("hybrid-gateways/ai-gateway/llm/llm-templates", "LLM Provider Templates"),
          group("Guardrails", [
            doc("hybrid-gateways/ai-gateway/llm/guardrails/aws-bedrock-guardrail", "AWS Bedrock Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/azure-content-safety", "Azure Content Safety"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/content-length", "Content Length Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/json-schema", "JSON Schema Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/pii-masking-regex", "PII Masking Regex Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/regex", "Regex Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/semantic-prompt-guard", "Semantic Prompt Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/semantic-tool-filtering", "Semantic Tool Filtering"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/sentence-count", "Sentence Count Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/url", "URL Guardrail"),
            doc("hybrid-gateways/ai-gateway/llm/guardrails/word-count", "Word Count Guardrail"),
          ]),
          group("Load Balancing", [
            doc("hybrid-gateways/ai-gateway/llm/load-balancing/model-round-robin", "Model Round Robin"),
            doc("hybrid-gateways/ai-gateway/llm/load-balancing/model-weighted-round-robin", "Model Weighted Round Robin"),
          ]),
          group("Prompt Management", [
            doc("hybrid-gateways/ai-gateway/llm/prompt-management/prompt-decorator", "Prompt Decorator"),
            doc("hybrid-gateways/ai-gateway/llm/prompt-management/prompt-template", "Prompt Template"),
          ]),
          doc("hybrid-gateways/ai-gateway/llm/semantic-caching", "Semantic Caching"),
        ],
      },
      {
        type: 'category',
        label: 'MCP',
        link: {type: 'doc', id: 'hybrid-gateways/ai-gateway/mcp/index'},
        items: [
          doc("hybrid-gateways/ai-gateway/mcp/quick-start-guide", "Quick Start Guide"),
          group("Policies", [
            doc("hybrid-gateways/ai-gateway/mcp/policies/mcp-acl-list", "MCP Access Control List"),
            doc("hybrid-gateways/ai-gateway/mcp/policies/mcp-authentication", "MCP Authentication"),
            doc("hybrid-gateways/ai-gateway/mcp/policies/mcp-authorization", "MCP Authorization"),
            doc("hybrid-gateways/ai-gateway/mcp/policies/mcp-rewrite", "MCP Rewrite"),
          ]),
        ],
      },
      {
        type: 'category',
        label: 'Observability',
        link: {type: 'doc', id: 'hybrid-gateways/ai-gateway/observability/index'},
        items: [
          doc("hybrid-gateways/ai-gateway/observability/logging", "Logging"),
          doc("hybrid-gateways/ai-gateway/observability/tracing", "Tracing"),
        ],
      },
    ]),
    */
    group("Monitor", [
      doc("monitor/overview", "Overview"),
      doc("monitoring-and-analytics", "Insights"),
      group("Logs", [
        doc("observability-and-insights/runtime-logs", "Runtime Logs"),
        doc("observability-and-insights/audit-logs", "Audit Logs"),
      ]),
      doc("monitoring-and-analytics/alerts", "Alerts"),
      doc("monitoring-and-analytics/gateway-metrics", "Gateway Metrics"),
    ]),
    doc("tutorials", "Tutorials"),
  ],
};

export default sidebars;
