---
title: "Invoke providers and proxies via SDKs"
description: "Call a deployed LLM provider or App LLM proxy using the OpenAI, Anthropic, Gemini, Mistral, Azure OpenAI, or LangChain SDKs."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/using-sdks/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/using-sdks.md
tags:
  - cloud
  - ai-workspace
  - sdks
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Invoke Providers and Proxies via SDKs

Once you have deployed an LLM Provider or App LLM Proxy in the AI Workspace, you can invoke it using any supported AI SDK by pointing it at the gateway's Invoke URL and authenticating with your generated API key.

The examples below apply to both providers and proxies — the only difference between the two is the Invoke URL you supply.

## Prerequisites

- An LLM [Provider](llm-providers/configure-provider.md) or [App LLM Proxy](llm-proxies/configure-proxy.md) deployed to a gateway
- The **Invoke URL** for the deployed endpoint
- A generated **API key**

## Authentication

All requests to the gateway must include your API key in the location configured in the **Security** tab of your provider or proxy. By default this is the `X-API-Key` request header, and the code examples below use that default.

!!! note
    Depending on the SDK or provider you use, you can choose the key name and location that works best and configure it in the **Security** tab. See [Configure Inbound Authentication](configure-inbound-auth.md). The examples below use the default `X-API-Key` header.

## OpenAI

!!! info "Invoke URL format"
    Append `/v1` to the Invoke URL shown in the console:
    ```
    https://{gateway-host}/{context}/v1
    ```

=== "OpenAI SDK"

    **Install:** `pip install openai`

    **Basic chat completion:**

    ```python
    from openai import OpenAI

    INVOKE_URL = "https://<gateway-host>/<context>/v1"
    API_KEY = "<your-gateway-api-key>"

    client = OpenAI(
        api_key=API_KEY,
        base_url=INVOKE_URL,
        default_headers={"X-API-Key": API_KEY},
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "What is WSO2?"}],
    )

    print(response.choices[0].message.content)
    ```

    **Streaming:**

    ```python
    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Count from 1 to 5."}],
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content if chunk.choices else None
        if delta:
            print(delta, end="", flush=True)
    ```

=== "LangChain"

    **Install:** `pip install langchain-openai`

    **Basic invoke:**

    ```python
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage

    INVOKE_URL = "https://<gateway-host>/<context>/v1"
    API_KEY = "<your-gateway-api-key>"

    llm = ChatOpenAI(
        model="gpt-4o",
        api_key=API_KEY,
        base_url=INVOKE_URL,
        default_headers={"X-API-Key": API_KEY},
    )

    response = llm.invoke([HumanMessage(content="What is WSO2?")])
    print(response.content)
    ```

    **Streaming:**

    ```python
    for chunk in llm.stream([HumanMessage(content="Count from 1 to 5.")]):
        if chunk.content:
            print(chunk.content, end="", flush=True)
    ```

## Anthropic

=== "Anthropic SDK"

    **Install:** `pip install anthropic`

    !!! note
        The Anthropic SDK sends the `api_key` parameter as the `x-api-key` header automatically. No additional header configuration is needed.

    **Basic message:**

    ```python
    import anthropic

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    client = anthropic.Anthropic(
        api_key=API_KEY,
        base_url=INVOKE_URL,
    )

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": "What is WSO2?"}],
    )

    print(response.content[0].text)
    ```

    **Streaming:**

    ```python
    with client.messages.stream(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Count from 1 to 5."}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
    ```

=== "LangChain"

    **Install:** `pip install langchain-anthropic`

    **Basic invoke:**

    ```python
    from langchain_anthropic import ChatAnthropic
    from langchain_core.messages import HumanMessage

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    llm = ChatAnthropic(
        model="claude-sonnet-4-5",
        api_key=API_KEY,
        anthropic_api_url=INVOKE_URL,
        default_headers={"X-API-Key": API_KEY},
        max_tokens=1024,
    )

    response = llm.invoke([HumanMessage(content="What is WSO2?")])
    print(response.content)
    ```

    **Streaming:**

    ```python
    for chunk in llm.stream([HumanMessage(content="Count from 1 to 5.")]):
        if chunk.content:
            print(chunk.content, end="", flush=True)
    ```

## Gemini

=== "Google GenAI SDK"

    **Install:** `pip install google-genai`

    !!! note
        The Gemini SDK normally sends its key as `x-goog-api-key`, which the gateway does not use for authentication. Pass `api_key="placeholder"` to satisfy the SDK and supply the real gateway key via `X-API-Key` in `HttpOptions`.

    **Basic content generation:**

    ```python
    from google import genai
    from google.genai import types as genai_types

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    http_options = genai_types.HttpOptions(
        base_url=INVOKE_URL,
        headers={"X-API-Key": API_KEY},
    )

    client = genai.Client(api_key="placeholder", http_options=http_options)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="What is WSO2?",
    )

    print(response.text)
    ```

    **Streaming:**

    ```python
    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents="Count from 1 to 5.",
    ):
        if chunk.text:
            print(chunk.text, end="", flush=True)
    ```

=== "LangChain"

    **Install:** `pip install langchain-google-genai`

    **Basic invoke:**

    ```python
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import HumanMessage

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=API_KEY,
        client_options={"api_endpoint": INVOKE_URL},
        additional_headers={"X-API-Key": API_KEY},
    )

    response = llm.invoke([HumanMessage(content="What is WSO2?")])
    print(response.content)
    ```

    **Streaming:**

    ```python
    for chunk in llm.stream([HumanMessage(content="Count from 1 to 5.")]):
        if chunk.content:
            print(chunk.content, end="", flush=True)
    ```

## Mistral AI

Mistral exposes both a native SDK and an OpenAI-compatible API at `/v1`.

=== "Mistral SDK"

    **Install:** `pip install mistralai httpx`

    !!! note
        The Mistral SDK sends its API key as a `Bearer` token. Since the gateway requires `X-API-Key`, an httpx event hook injects this header on every outgoing request.

    **Basic chat completion:**

    ```python
    import httpx
    from mistralai import Mistral

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    def _inject_api_key(request):
        request.headers["X-API-Key"] = API_KEY

    http_client = httpx.Client(
        event_hooks={"request": [_inject_api_key]},
    )

    client = Mistral(
        api_key=API_KEY,
        server_url=INVOKE_URL,
        client=http_client,
    )

    response = client.chat.complete(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": "What is WSO2?"}],
    )

    print(response.choices[0].message.content)
    ```

    **Streaming:**

    ```python
    with client.chat.stream(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": "Count from 1 to 5."}],
    ) as stream:
        for event in stream:
            if event.data.choices and event.data.choices[0].delta.content:
                print(event.data.choices[0].delta.content, end="", flush=True)
    ```

=== "OpenAI SDK"

    **Install:** `pip install openai`

    Mistral's API is OpenAI-compatible. Append `/v1` to the Invoke URL.

    **Basic chat completion:**

    ```python
    from openai import OpenAI

    INVOKE_URL = "https://<gateway-host>/<context>/v1"
    API_KEY = "<your-gateway-api-key>"

    client = OpenAI(
        api_key=API_KEY,
        base_url=INVOKE_URL,
        default_headers={"X-API-Key": API_KEY},
    )

    response = client.chat.completions.create(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": "What is WSO2?"}],
    )

    print(response.choices[0].message.content)
    ```

    **Streaming:**

    ```python
    stream = client.chat.completions.create(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": "Count from 1 to 5."}],
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content if chunk.choices else None
        if delta:
            print(delta, end="", flush=True)
    ```

=== "LangChain"

    **Install:** `pip install langchain-openai`

    LangChain's `ChatOpenAI` works with Mistral's OpenAI-compatible endpoint. Append `/v1` to the Invoke URL.

    **Basic invoke:**

    ```python
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage

    INVOKE_URL = "https://<gateway-host>/<context>/v1"
    API_KEY = "<your-gateway-api-key>"

    llm = ChatOpenAI(
        model="mistral-small-latest",
        api_key=API_KEY,
        base_url=INVOKE_URL,
        default_headers={"X-API-Key": API_KEY},
    )

    response = llm.invoke([HumanMessage(content="What is WSO2?")])
    print(response.content)
    ```

    **Streaming:**

    ```python
    for chunk in llm.stream([HumanMessage(content="Count from 1 to 5.")]):
        if chunk.content:
            print(chunk.content, end="", flush=True)
    ```

## Azure OpenAI

!!! note
    The `model` / `azure_deployment` parameter must be your **Azure deployment name**, not the underlying model name.


=== "Azure OpenAI SDK"

    **Install:** `pip install openai`

    **Basic chat completion:**

    ```python
    from openai import AzureOpenAI

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    client = AzureOpenAI(
        api_key=API_KEY,
        azure_endpoint=INVOKE_URL,
        api_version="2024-10-21",
        default_headers={"X-API-Key": API_KEY},
    )

    response = client.chat.completions.create(
        model="<your-deployment-name>",
        messages=[{"role": "user", "content": "What is WSO2?"}],
    )

    print(response.choices[0].message.content)
    ```

    **Streaming:**

    ```python
    stream = client.chat.completions.create(
        model="<your-deployment-name>",
        messages=[{"role": "user", "content": "Count from 1 to 5."}],
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content if chunk.choices else None
        if delta:
            print(delta, end="", flush=True)
    ```

=== "LangChain"

    **Install:** `pip install langchain-openai`

    **Basic invoke:**

    ```python
    from langchain_openai import AzureChatOpenAI
    from langchain_core.messages import HumanMessage

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    llm = AzureChatOpenAI(
        azure_deployment="<your-deployment-name>",
        api_version="2024-10-21",
        azure_endpoint=INVOKE_URL,
        api_key=API_KEY,
        default_headers={"X-API-Key": API_KEY},
    )

    response = llm.invoke([HumanMessage(content="What is WSO2?")])
    print(response.content)
    ```

    **Streaming:**

    ```python
    for chunk in llm.stream([HumanMessage(content="Count from 1 to 5.")]):
        if chunk.content:
            print(chunk.content, end="", flush=True)
    ```

## Azure AI Foundry

!!! note
    The `model` / `azure_deployment` parameter must be your **Azure deployment name**.

=== "Azure OpenAI SDK"

    **Install:** `pip install openai`

    **Basic chat completion:**

    ```python
    from openai import AzureOpenAI

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    client = AzureOpenAI(
        api_key=API_KEY,
        azure_endpoint=INVOKE_URL,
        api_version="2024-05-01-preview",
        default_headers={"X-API-Key": API_KEY},
    )

    response = client.chat.completions.create(
        model="<your-deployment-name>",
        messages=[{"role": "user", "content": "What is WSO2?"}],
    )

    print(response.choices[0].message.content)
    ```

    **Streaming:**

    ```python
    stream = client.chat.completions.create(
        model="<your-deployment-name>",
        messages=[{"role": "user", "content": "Count from 1 to 5."}],
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content if chunk.choices else None
        if delta:
            print(delta, end="", flush=True)
    ```

=== "LangChain"

    **Install:** `pip install langchain-openai`

    **Basic invoke:**

    ```python
    from langchain_openai import AzureChatOpenAI
    from langchain_core.messages import HumanMessage

    INVOKE_URL = "https://<gateway-host>/<context>"
    API_KEY = "<your-gateway-api-key>"

    llm = AzureChatOpenAI(
        azure_deployment="<your-deployment-name>",
        api_version="2024-05-01-preview",
        azure_endpoint=INVOKE_URL,
        api_key=API_KEY,
        default_headers={"X-API-Key": API_KEY},
    )

    response = llm.invoke([HumanMessage(content="What is WSO2?")])
    print(response.content)
    ```

    **Streaming:**

    ```python
    for chunk in llm.stream([HumanMessage(content="Count from 1 to 5.")]):
        if chunk.content:
            print(chunk.content, end="", flush=True)
    ```