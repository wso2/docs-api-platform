# Troubleshooting

This guide covers common issues you may encounter when deploying and operating the API Platform Self-Hosted Gateway, along with their solutions.

## Connection Issues

### Gateway Not Connecting to Control Plane

**Symptoms:**

- Gateway status shows as "Disconnected" in API Platform Console
- Logs show connection timeout or refused errors

**Solutions:**

1. **Verify network connectivity:**

   ```bash
   # Test connectivity to API Platform endpoints
   curl -v https://gateway.bijira.dev/health
   curl -v https://config.bijira.dev/health
   ```

2. **Check firewall rules:**

   Ensure outbound HTTPS (443) is allowed to:
   - `gateway.bijira.dev`
   - `config.bijira.dev`
   - `telemetry.bijira.dev`

3. **Verify DNS resolution:**

   ```bash
   nslookup gateway.bijira.dev
   dig gateway.bijira.dev
   ```

4. **Check proxy settings:**

   If using a proxy, configure the gateway:

   ```yaml
   proxy:
     http: http://proxy.example.com:8080
     https: http://proxy.example.com:8080
     noProxy: "localhost,127.0.0.1,.internal.example.com"
   ```

### Intermittent Disconnections

**Symptoms:**

- Gateway alternates between Connected and Disconnected states
- Logs show reconnection attempts

**Solutions:**

1. **Check network stability:**

   ```bash
   # Monitor connectivity over time
   ping -c 100 gateway.bijira.dev
   ```

2. **Review keep-alive settings:**

   ```yaml
   connection:
     keepAliveInterval: 30s
     keepAliveTimeout: 60s
     reconnectBackoff:
       initial: 1s
       max: 60s
   ```

3. **Check for network timeouts:**

   Ensure load balancers or firewalls don't have aggressive idle timeouts.

## Registration Issues

### Invalid Gateway Token

**Symptoms:**

- Logs show "authentication failed" or "invalid token" errors
- Gateway cannot register with control plane

**Solutions:**

1. **Verify token is correct:**

   Copy the token again from API Platform Console without any extra spaces or characters.

2. **Check token hasn't expired:**

   Tokens may have an expiration. Generate a new token if needed.

3. **Ensure token is properly set:**

   **Kubernetes:**
   ```bash
   kubectl get secret bijira-gateway-token -n bijira-gateway -o jsonpath='{.data.token}' | base64 -d
   ```

   **Docker:**
   ```bash
   docker inspect bijira-gateway | grep BIJIRA_GATEWAY_TOKEN
   ```

   **VM:**
   ```bash
   cat /etc/bijira/env | grep BIJIRA_GATEWAY_TOKEN
   ```

### Token Revoked

**Symptoms:**

- Previously working gateway stops connecting
- Logs show "token revoked" errors

**Solutions:**

1. Generate a new token in API Platform Console.
2. Update the gateway configuration.
3. Restart the gateway.

## Startup Issues

### Gateway Pod/Container Not Starting

**Symptoms:**

- Pod stuck in CrashLoopBackOff (Kubernetes)
- Container exits immediately (Docker)
- Service fails to start (VM)

**Solutions:**

1. **Check logs for errors:**

   **Kubernetes:**
   ```bash
   kubectl logs -n bijira-gateway -l app=bijira-gateway --previous
   kubectl describe pod -n bijira-gateway -l app=bijira-gateway
   ```

   **Docker:**
   ```bash
   docker logs bijira-gateway
   ```

   **VM:**
   ```bash
   journalctl -u bijira-gateway -n 100 --no-pager
   ```

2. **Verify resource availability:**

   ```bash
   # Kubernetes
   kubectl top nodes
   kubectl describe node <node-name>
   
   # VM
   free -m
   df -h
   ```

3. **Check configuration syntax:**

   ```bash
   # Validate configuration
   bijira-gateway --config /etc/bijira/gateway.yaml --validate
   ```

### Port Already in Use

**Symptoms:**

- Error: "address already in use" or "port binding failed"

**Solutions:**

1. **Identify the process using the port:**

   ```bash
   # Check what's using port 443
   sudo ss -tlnp | grep :443
   sudo lsof -i :443
   ```

2. **Stop the conflicting process or change the port:**

   ```yaml
   server:
     https:
       port: 8443  # Use alternative port
   ```

## TLS/Certificate Issues

### Certificate Not Valid

**Symptoms:**

- SSL/TLS handshake failures
- Browser shows certificate errors
- Logs show "certificate verify failed"

**Solutions:**

1. **Verify certificate validity:**

   ```bash
   openssl x509 -in /path/to/cert.crt -text -noout
   openssl verify /path/to/cert.crt
   ```

2. **Check certificate chain:**

   ```bash
   openssl s_client -connect localhost:443 -showcerts
   ```

3. **Ensure certificate matches private key:**

   ```bash
   # Compare MD5 hashes (should match)
   openssl x509 -noout -modulus -in cert.crt | openssl md5
   openssl rsa -noout -modulus -in private.key | openssl md5
   ```

### Certificate Expired

**Symptoms:**

- SSL errors indicating expired certificate
- API consumers receive TLS errors

**Solutions:**

1. Obtain a new certificate.
2. Update the certificate files.
3. Reload or restart the gateway:

   ```bash
   # Kubernetes
   kubectl rollout restart deployment/bijira-gateway -n bijira-gateway
   
   # Docker
   docker restart bijira-gateway
   
   # VM
   sudo systemctl reload bijira-gateway
   ```

## Policy Issues

### Policies Not Applied

**Symptoms:**

- Policies configured in console not enforced by gateway
- Policy sync status shows errors

**Solutions:**

1. **Check policy sync status:**

   ```bash
   curl http://localhost:9090/health/policies
   ```

2. **Force policy resync:**

   In API Platform Console, go to **Settings** > **Self-Hosted Gateways** > **Sync Policies**.

3. **Review gateway logs for sync errors:**

   ```bash
   # Filter for policy-related logs
   grep -i "policy" /var/log/bijira/gateway.log
   ```

### Policy Conflicts

**Symptoms:**

- Unexpected behavior when multiple policies apply
- Some requests allowed that should be denied (or vice versa)

**Solutions:**

1. Review policy precedence rules:
   - API-level policies override gateway-level policies
   - Explicit deny overrides allow

2. Check for overlapping scopes in policy definitions.

3. Use the policy simulation tool in API Platform Console.

## Performance Issues

### High Latency

**Symptoms:**

- API response times higher than expected
- Latency increases under load

**Solutions:**

1. **Check resource utilization:**

   ```bash
   # Kubernetes
   kubectl top pods -n bijira-gateway
   
   # Docker
   docker stats bijira-gateway
   
   # VM
   top -p $(pgrep bijira-gateway)
   ```

2. **Scale horizontally:**

   ```bash
   # Kubernetes
   kubectl scale deployment/bijira-gateway --replicas=5 -n bijira-gateway
   ```

3. **Review logging level:**

   Debug logging can impact performance. Set to INFO or WARN in production:

   ```yaml
   logging:
     level: INFO
   ```

4. **Check backend connectivity:**

   Ensure the gateway has low-latency access to backend services.

### High Memory Usage

**Symptoms:**

- Memory consumption grows over time
- OOMKilled pods (Kubernetes)

**Solutions:**

1. **Check for memory leaks:**

   Monitor memory over time:
   ```bash
   watch -n 5 "kubectl top pod -n bijira-gateway"
   ```

2. **Adjust resource limits:**

   ```yaml
   resources:
     limits:
       memory: 4Gi
     requests:
       memory: 1Gi
   ```

3. **Review cache settings:**

   ```yaml
   cache:
     maxSize: 100MB
     ttl: 300s
   ```

## API Routing Issues

### 404 Not Found Errors

**Symptoms:**

- API requests return 404 errors
- APIs were working previously

**Solutions:**

1. **Verify API deployment:**

   Check if the API is deployed to this gateway in API Platform Console.

2. **Check configuration sync:**

   ```bash
   curl http://localhost:9090/health/config
   ```

3. **Verify the request path matches the API configuration.**

### 502 Bad Gateway Errors

**Symptoms:**

- Backend connection failures
- 502 errors returned to clients

**Solutions:**

1. **Verify backend is accessible from gateway:**

   ```bash
   # From inside the gateway container/pod
   curl -v http://backend-service:8080/health
   ```

2. **Check backend DNS resolution:**

   ```bash
   nslookup backend-service.namespace.svc.cluster.local
   ```

3. **Review timeout settings:**

   ```yaml
   backends:
     connectTimeout: 30s
     readTimeout: 60s
   ```

## Logging and Diagnostics

### Enable Debug Logging

Temporarily enable debug logging for troubleshooting:

```yaml
logging:
  level: DEBUG
```

!!! warning
    Debug logging can generate large volumes of logs and impact performance. Disable after troubleshooting.

### Collect Diagnostic Information

When opening a support request, collect:

1. **Gateway version:**
   ```bash
   bijira-gateway --version
   ```

2. **Configuration (redact sensitive values):**
   ```bash
   cat /etc/bijira/gateway.yaml
   ```

3. **Recent logs:**
   ```bash
   journalctl -u bijira-gateway --since "1 hour ago"
   ```

4. **Health check output:**
   ```bash
   curl http://localhost:9090/health
   curl http://localhost:9090/health/config
   curl http://localhost:9090/health/policies
   ```

5. **Resource utilization:**
   ```bash
   top -bn1 | head -20
   free -m
   df -h
   ```

## Getting Help

If you cannot resolve an issue using this guide:

1. **Check the documentation:** Review the relevant deployment and configuration guides.
2. **Search known issues:** Check the API Platform status page and release notes.
3. **Contact support:** Open a support ticket with diagnostic information.

## What's Next?

- [Overview](overview.md): Self-Hosted Gateway overview
- [Getting Started](getting-started.md): Quick start guide
- [Setting Up](setting-up.md): Configuration guide
- [Adding and Managing Policies](manage-policies.md): Configure and enforce policies
- [Analytics](analytics.md): Monitor API traffic and performance
