---
title: "Install and Setup Overview"
description: "Find entry points for installing, deploying, and setting up WSO2 API Manager, including runtime setup, key managers, databases, and security."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/install-and-setup-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/install-and-setup-overview.md
tags:
  - api-manager
  - installation
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Install and Setup Overview

The installation and the setup of API Manager involve installing the product, deploying it in the method that is best suited for your requirements, and setting it up to run in the production environment. If you already have an older version of WSO2 API Manager or one of its components, you can follow the upgrading instructions in this guide.

This section provides installation and setup instructions for the following three components of WSO2 API Manager that you need to operate as three separate runtimes.

## API Manager

This component manages APIs. To install and set up this component, see the following topics.

### Installing

To install and run the API Manager in virtual machines, see the following topics.

<table>
    <tr>
        <th>
            <a href="../install/installing-the-product/installing-api-m-runtime.md">Installing the API Manager Runtime</a>
        </th>
        <td>
            Explains how to download the API Manager component as a binary and install it on a virtual machine.
        </td>
    </tr>  
    <tr>
        <th>
            <a href="../install/installing-the-product/running-the-api-m.md">Running the API-M Runtime</a>
        </th>
        <td>
            Explains how you can execute the API-M runtime and start using its features.
        </td>
    </tr> 
    <tr>
        <th>
            <a href="../install/installing-the-product/installing-api-m-as-a-linux-service.md">Running API-M as a Linux Service</a>
        </th>
        <td>
            Explains how to install and run the API Manager as a Linux service.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../install/installing-the-product/installing-api-m-as-a-windows-service.md">Running API-M as a Windows Service</a>
        </th>
        <td>
            Explains how to install and run the API Manager as a Windows service.
        </td>
    </tr> 
</table>

### Setting up

To set up the API Manager component, see the following topics.

<table>
<tr>
    <th>
        <a href="../setup/updating-wso2-api-manager.md">Applying WSO2 WUM Updates</a>
    </th>
    <td>
        Explains how to get the latest updates that are available for a particular release of the API Manager.
    </td>
</tr>
<tr>
    <th>
        <a>Setting up a Key Manager</a>
    </th>
    <td>
        The key manager of the API Manager handles all clients, security, and access token-related operations. This section covers the following topics:
        <ul>
            <li>
                <a href="../setup/distributed-deployment/configure-a-third-party-key-manager.md">Configure a Third-party Key Manager</a>
            </li>
            <li>
                <a href="../setup/distributed-deployment/configuring-wso2-identity-server-as-a-key-manager.md">Configuring WSO2 Identity Server as a Key Manager</a>
            </li>
        </ul>
    </td>
</tr>
<tr>
    <th>
        <a href="../setup/setting-up-databases/overview.md">Setting up Databases</a>
    </th>
    <td>
        The API Manager is shipped with an H2 database for storing data. This guide explains the default H2 databases used within API Manager as well as how to switch to a different database supported for the API Manager such as MSSQL, MySQL, PostgreSQL, Oracle, IBM DB2, and Oracle RAC. In addition, this section covers how to manage data growth and improve performance when storing metadata and runtime data in databases.
    </td>
</tr>
<tr>
    <th>
        <a>Setting up Proxy Server and the Load Balancer
    <td>
        A load balancer or reverse proxy is required to map external traffic with ports and URLs that the API Manager component uses internally. This section covers the following topics relating to the proxy server and the load balancer.
        <ul>
            <li>
                <a href="../setup/setting-up-proxy-server-and-the-load-balancer/configuring-the-proxy-server-and-the-load-balancer.md">Configuring the Proxy Server and the Load Balancer</a>
            </li>
            <li>
                <a href="../setup/setting-up-proxy-server-and-the-load-balancer/adding-a-custom-proxy-path.md">Adding a Custom Proxy Path</a>
            </li>
        </ul>
    </td>
</tr>
<tr>
    <th>
        <a>Securing the API Manager</a>
    </th>
    <td>
        Covers the different ways in which you can secure the API Manager and the data it handles. The topics covered are as follows:
        <ul>
            <li>
                <a>Logins and Passwords</a>
            </li>
                <li>
                    <a href="../setup/security/logins-and-passwords/maintaining-logins-and-passwords.md">Maintaining Logins and Passwords</a>
                </li>
                <li>
                    <a>Securing Passwords</a>
                </li>
                    <li>
                        <a href="../setup/security/logins-and-passwords/carbon-secure-vault-implementation.md">Customizing Secure Vault</a>
                    </li>
                    <li>
                        <a href="../setup/security/logins-and-passwords/set-passwords-using-vars-and-sys-props.md">Set Passwords using Environment Variables/System Properties</a>
                    </li>
                    <li>
                        <a href="../setup/security/logins-and-passwords/working-with-encrypted-passwords.md">Working with Encrypted Passwords</a>
                    </li>
            <li>
                <a>Encryption</a>
            </li>
                <li>
                    <a href="../setup/security/encryption/symmetric-encryption.md">Symmetric Encryption</a>
                </li>
                <li>
                    <a href="../setup/security/encryption/asymmetric-encryption.md">Asymmetric Encryption</a>
                </li>
            <li>
                <a>Configuring Keystores</a>
            </li>
                <li>
                    <a href="../setup/security/configuring-keystores/configuring-keystores-in-wso2-api-manager.md">Configuring Keystores in API Manager</a>
                </li>
                <li>
                    <a>Keystore Basics</a>
                </li>
                    <li>
                        <a href="../setup/security/configuring-keystores/keystore-basics/about-keystores-and-truststores.md">About Keystores and Truststores</a>
                    </li>
                    <li>
                        <a href="../setup/security/configuring-keystores/keystore-basics/creating-new-keystores.md">Creating a New Keystore</a>
                    </li>
                    <li>
                        <a href="../setup/security/configuring-keystores/keystore-basics/renewing-a-ca-signed-certificate-in-a-keystore.md">Renewing a CA Signed Certificate</a>
                    </li>
            <li>
                <a href="../setup/security/enabling-hostname-verification.md">Enabling HostName Verification</a>
            </li>
            <li>
                <a href="../setup/security/general-data-protection-regulation-gdpr-for-wso2-api-manager.md">General Data Protection Regulation (GDPR) for WSO2 API Manager</a>
            </li>
            <li>
                <a href="../setup/security/configuring-transport-level-security.md">Configuring Transport Level Security</a>
            </li>
            <li>
                <a href="../setup/security/user-account-management.md">User Account Management</a>
            </li>                                                                                      
        </ul>
    </td>
</tr>
<tr>
    <th>
        <a href="../../administer/managing-users-and-roles/managing-user-stores/introduction-to-userstores.md">Configuring User Stores</a>
    </th>
    <td>
        You can configure primary user stores as well as secondary user stores for the API Manager component. This section explains the concept of user stores and provides instructions to configure primary user stores. The topics covered are as follows:
        <ul>
            <li>
                <a href="../../administer/managing-users-and-roles/managing-user-stores/introduction-to-userstores.md">Introduction to User Stores</a>
            </li>
                <li>
                    <a href="../setup/configure-userstores/configure-primary-user-store/configuring-the-primary-user-store.md"> Configuring Primary User Stores</a>
                </li>
                <li>
                    <a href="../setup/configure-userstores/configure-primary-user-store/configuring-a-jdbc-user-store.md">Configuring a JDBC User Store</a>
                </li>
                <li>
                    <a href="../setup/configure-userstores/configure-primary-user-store/configuring-a-read-write-ldap-user-store.md">Configuring a Read-Write LDAP User Store</a>
                </li>   
                <li>
                    <a href="../setup/configure-userstores/configure-primary-user-store/configuring-a-read-only-ldap-user-store.md"> Configuring a Read-Only LDAP User Store</a>
                </li>
                <li>
                    <a href="../setup/configure-userstores/configure-primary-user-store/configuring-a-read-write-active-directory-user-store.md">Configuring a Read-Write Active Directory User Store</a>
                </li>
        </ul>                                                                       
    </td>
</tr>
<tr>
    <th>
        <a>SSO</a>
    </th>
    <td>
        Explains how to configure SSO (Single Sign On) for the API Manager component with an external identity provider. The topics covered are as follows.
        <li>
            <a href="../setup/sso/configuring-identity-server-as-external-idp-using-oidc.md">Configuring Identity Server As External IDP with OIDC</a>
        </li>
        <li>
            <a href="../setup/sso/configuring-identity-server-as-external-idp-using-saml.md">Configuring Identity Server As External IDP with SAML</a>
        </li>
        <li>
            <a href="../setup/sso/okta-as-an-external-idp-using-oidc.md">Using OKTA As An External IDP With OIDC</a>
        </li>
        <li>
            <a href="../setup/sso/okta-as-an-external-idp-using-saml.md">Using OKTA As An External IDP With SAML</a>
        </li>                                   
    </td>
</tr>   
<tr>
    <th>
        <a>Advanced Configurations</a>
    </th>
    <td>
        Covers some advanced configurations including how to change the transport used by the API Manager component from the default PassThrough transport to a different transport, how to configure caching, and how to change the user interfaces of the API Manager component.
        <li>
            <a href="../setup/advance-configurations/changing-the-default-transport.md">Changing the Default Transport</a>
        </li>
        <li>
            <a href="../setup/advance-configurations/configuring-caching.md">Configuring Caching</a>
        </li>
        <li>
            <a href="../setup/advance-configurations/customizing-the-management-console.md">Customizing the Management Console</a>
        </li>                   
    </td>
</tr>
</table>
 
### Deploying

To deploy the API Manager runtime, see the topics given below.

<table>
    <tr>
        <th>
            <a href="../../get-started/deployment-patterns/">Deployment Patterns</a>
        </th>
        <td>
            This explains all the deployment patterns you can follow when you deploy WSO2 API Manager. These patterns involve deploying the API Manager component together with Micro Integrator and Streaming Integrator components in clustered setups.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../setup/single-node/all-in-one-deployment-overview.md">All-in-One Deployment</a>
        </th>
        <td>
            This describes the all-in-one deployment patterns where you can deploy all the sub components of the API Manager component in one instance.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup/">Distributed Deployment</a>
        </th>
        <td>
            This describes the distributed deployment patterns where you can deploy the sub-components of the API Manager component in a distributed manner in order to handle a high volume of requests in an efficient manner.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../install/deploying-api-manager-with-kubernetes-resources.md">Deploy API-M on Kubernetes using Helm Resources</a>
        </th>
        <td>
            Explains how Helm resources deploy the API Manager component in Kubernetes.
        </td>
    </tr>
</table>

### CI/CD

To implement continuous integration and continuous deployment pipelines for APIs on API Manager, see the topics given below.

<table>
    <tr>
        <th>
            <a href="../../apiops/cli/ci-cd-with-wso2-api-management.md">CI/CD for APIs - Overview</a>
        </th>
        <td>
            Find out about the methods of implementing CI/CD for APIs using the API Controller (apictl).
        </td>
    </tr>
     <tr>
        <th>
            <a href="../../apiops/cli/cicd-using-cli.md">Building a CI/CD Pipeline for APIs using the CLI</a>
        </th>
        <td>
            See the instructions on how to implement a CI/CD pipeline for APIs using the API Controller (apictl).
        </td>
    </tr>
    <tr>
        <th>
            <a href="../../apiops/cli/building-jenkins-ci-cd-pipeline/">Building a CI/CD Pipeline for APIs using Jenkins</a>
        </th>
        <td>
            See the instructions on how to implement a CI/CD pipeline for APIs using Jenkins and the API Controller (apictl).
        </td>
    </tr>
</table>

See the topics given below to manage APIs, API products, Apps, etc. in the API-M runtime by using the API Controller (apictl).

<table>
    <tr>
        <th>
            <a href="../../apiops/cli/getting-started-with-wso2-api-controller.md">Getting Started with WSO2 API Controller</a>
        </th>
        <td>
            Explains how to set up the API Controller.
        </td>
    </tr>
    <tr>
        <th>
            <a>Managing APIs and API Products</a>
        </th>
        <td>
            This section covers the following topics.
            <li>
                <a href="../../apiops/cli/managing-apis-api-products/managing-apis-and-api-products.md">Managing APIs and API Products</a>
            </li>
            <li>
                <a href="../../apiops/cli/managing-apis-api-products/importing-apis-via-dev-first-approach.md">Importing APIs Via Dev First Approach</a>
            </li>
            <li>
                <a href="../../apiops/cli/managing-apis-api-products/migrating-apis-to-different-environments.md">Migrating APIs to Different Environments</a>
            </li> 
            <li>
                <a href="../../apiops/cli/managing-apis-api-products/migrating-api-products-to-different-environments.md">Migrating API Products (with or without dependent APIs) to Different Environments</a>
            </li>       
        </td>
    </tr>
    <tr>
        <th>
            <a>Managing Applications</a>
        </th>
        <td>
            This section covers the following topics.
            <li>
                <a href="../../apiops/cli/managing-applications/managing-applications.md">Managing Applications</a>
            </li>
            <li>
                <a href="../../apiops/cli/managing-applications/migrating-applications-to-different-environments.md">Migrating Apps to Different Environments</a>
            </li>                
        </td>
    </tr>
    <tr>
        <th>
            <a>Advanced Topics</a>
        </th>
        <td>
            This section covers the following topics.
            <li>
                <a href="../../apiops/cli/advanced-topics/creating-custom-users-to-perform-api-controller-operations.md">Creating Custom Users to Perform API Controller Operations</a>
            </li>
            <li>
                <a href="../../apiops/cli/advanced-topics/configuring-environment-specific-parameters.md">Configuring Environment Specific Parameters</a>
            </li>
            <li>
                <a href="../../apiops/cli/advanced-topics/using-dynamic-data-in-api-controller-projects.md">Using Dynamic Data in API Controller Projects</a>
            </li>
            <li>
                <a href="../../apiops/cli/advanced-topics/configuring-different-endpoint-types.md">Configuring Different Endpoint Types</a>
            </li>
            <li>
                <a href="../../apiops/cli/advanced-topics/formatting-the-output-of-get-command.md">Formatting the outputs of get commands</a>
            </li>                        
        </td>
    </tr>
</table>

### Upgrading

To upgrade to the current API Manager component from a previous version refer [Upgrade WSO2 API Manager](upgrading-wso2-api-manager/upgrading-api-manager.md).

## Reference

<table>
    <tr>
        <th>
            <a href="../../reference/common-runtime-and-configuration-artifacts.md">Common Runtime and Configuration Artifacts</a>
        </th>
        <td>
            Describes some artifacts that are commonly used with the API Manager component.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../../reference/default-product-ports.md">Default Product Ports</a>
        </th>
        <td>
            Explains the default ports used by the API Manager component.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../../reference/product-compatibility.md">Product Compatibility</a>
        </th>
        <td>
            Provides details relating to the compatibility of the API Manager component with different operating systems and JDKs, databases, key managers, web browsers, and other WSO2 products.
        </td>
    </tr>
    <tr>
        <th>
            <a href="../../reference/supported-cipher-suites.md">Supported Cipher Suites</a>
        </th>
        <td>
            Provides details of the supported cipher suites.
        </td>
    </tr>
</table>