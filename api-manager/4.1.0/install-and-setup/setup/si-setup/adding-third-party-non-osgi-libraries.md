---
title: "Adding third party non OSGi libraries"
description: "Convert non-OSGi third party jar files to OSGi bundles and add them to the Streaming Integrator lib directory."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/si-setup/adding-third-party-non-osgi-libraries/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/si-setup/adding-third-party-non-osgi-libraries.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - si-setup
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Adding Third Party Non OSGi Libraries

The Streaming Integrator is OSGi-based. Therefore, when you integrate third party products such as Oracle with the Streaming Integrator, you need to check whether the libraries you need to add to the Streaming Integrator are OSGi-based. If they are not, you need to convert them to OSGi bundles before adding them to the `<SI_HOME>/lib` directory.

To convert jar files to OSGi bundles, follow the procedure given below:

1. Download the non-OSGi jar for the required third party product, and save it in a preferred directory in your machine.

2. In your CLI, navigate to the `<SI_HOME>/bin` directory. Then issue the following command.
    `./jartobundle.sh <PATH_TO_NON-OSGi_JAR> ../lib`
      
    This generates the converted file in the `<SI_HOME>/lib` directory.

3. Restart the WSO2 SI server.