---
title: "Setting up google firebase environment"
description: "Create a Firebase project and generate a private key to obtain credentials for the Google Firebase connector."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/connectors/google-firebase-connector/google-firebase-setup/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/connectors/google-firebase-connector/google-firebase-setup.md
tags:
  - api-manager
  - reference
  - connectors
  - google-firebase-connector
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Setting up Google Firebase Environment 

1. Open up [Firebase Console](https://console.firebase.google.com/) and log in.
2. Add a Firebase project. The **Add project** dialog also gives you the option to add Firebase to an existing Google Cloud Platform project.
    <img src="../../../../assets/img/integrate/connectors/add-firebase-project.jpg" title="Add Firebase project" width="400" alt="Add Firebase project"/>
3. Navigate to the [Service Accounts](https://console.firebase.google.com/project/teststatusapp/settings/serviceaccounts/adminsdk) tab in your project's settings page.
4. Click the **Generate New Private Key** button at the bottom of the **Firebase Admin SDK** section of the **Service Accounts** tab.
    <img src="../../../../assets/img/integrate/connectors/get-firebase-credentials.png" title="Get Firebase credentials" width="600" alt="Get Firebase credentials"/>

    After you click the button, a JSON file containing your service account's credentials will be downloaded. You'll need information in this file to initialize the Google Firebase Connector in the [integration scenario](google-firebase-connector-example) you are going to build next. 
  