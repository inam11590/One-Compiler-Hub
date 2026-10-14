# OneCompilerHub — Production Sandbox Architecture & Security Specification

## 1. Executive Summary

Executing untrusted, user-submitted code in an online compiler platform presents extreme multi-tenant security risks. This specification details the defense-in-depth isolation boundary required before arbitrary code execution can ever be enabled for public users on OneCompilerHub.

**CRITICAL PRINCIPLE**: Under no circumstances should untrusted user code be run inside the API web service process, via standard Node.js/Python child processes (`subprocess`, `exec`, `os.system`), or inside unhardened standard Docker containers. Standard Docker is **not** a sufficient security boundary against determined kernel exploits.

---

## 2. Threat Model for Untrusted Multi-Tenant Code Execution

The threat landscape for an online code execution platform includes the following attack vectors:

### 2.1 Denial of Service & Resource Starvation
- **Fork Bombs**: Uncontrolled process proliferation (`:(){ :|:& };:`, `while True: os.fork()`) starving the host OS PID table.
- **Memory Exhaustion (OOM)**: Allocating gigabytes of heap memory causing host kernel panic or killing neighbor processes.
- **CPU Hogging**: Endless infinite loops consuming 100% of host CPU cores.
- **Disk Saturation**: Writing gigabytes to `/tmp` to fill the host root volume.
- **Terminal Flood**: Emitting millions of characters to `stdout` to consume API memory and crash log streams.

### 2.2 Host & Kernel Compromise
- **Kernel Privilege Escalation**: Exploiting Linux kernel CVEs to escape container namespaces.
- **Shared `/proc` and `/sys` Leakage**: Snooping on host system metrics, processes, or kernel memory.
- **Docker Socket Abuse**: Gaining access to `/var/run/docker.sock`, which grants immediate root control over the host daemon.

### 2.3 Network & Infrastructure Attacks
- **Cloud Metadata Exfiltration (SSRF)**: Querying `http://169.254.169.254` (AWS, GCP, Azure, DigitalOcean) to steal node IAM credentials and access keys.
- **Internal Service Scanning**: Probing VPC subnet ranges, internal Redis instances, or databases.
- **Crypto-Mining & C2 Botnets**: Connecting to external mining pools or botnet command-and-control servers.
- **Email Spam / Phishing Relay**: Opening raw sockets on port 25/587 to send malicious emails.

### 2.4 Credential & Secret Leakage
- **Environment Variable Theft**: Reading `process.env` / `os.environ` to extract Supabase service-role keys, database passwords, or API tokens.
- **Filesystem Traversal**: Attempting to read `/etc/passwd`, `/root/.ssh`, or neighboring tenant source files.

---

## 3. Defense-in-Depth Architecture

To mitigate these threats, OneCompilerHub enforces a **seven-layer isolation model**:

```
+-------------------------------------------------------------------------+
| Layer 1: Edge & Network Security (Cloudflare / WAF, TLS, Rate Limits)   |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| Layer 2: API Gateway (FastAPI, JWT Auth, Payload Size Validators)       |
+-------------------------------------------------------------------------+
                                    | (Async Job via Queue)
+-------------------------------------------------------------------------+
| Layer 3: Dispatcher / Worker Orchestrator (Zero Access to DB/Secrets)   |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| Layer 4: MicroVM / gVisor Virtualization Boundary (runsc / Firecracker) |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| Layer 5: Linux Kernel Isolation (cgroups v2, seccomp-bpf, Namespaces)   |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| Layer 6: Filesystem Security (Read-Only Root, Isolated Ephemeral tmpfs)  |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| Layer 7: Execution Governance (Process Limits, CPU/RAM Quotas, Timeouts)|
+-------------------------------------------------------------------------+
```

---

## 4. Specific Technical Controls

### 4.1 MicroVM / Hardened Runtime Boundary (gVisor or Firecracker)
- **Why Standard Docker Fails**: Standard Docker containers share the host Linux kernel directly via namespaces and cgroups. A single kernel vulnerability allows total host takeover.
- **Production Choice**:
  - **gVisor (`runsc`)**: Intercepts all syscalls in user-space using the Sentry sandbox kernel written in Go. Untrusted code never talks directly to the host Linux kernel.
  - **AWS Firecracker**: MicroVM technology provisioning minimalist virtual machines in milliseconds with KVM hardware isolation.

### 4.2 Network Isolation
- Containers and MicroVMs must run with **networking completely disabled**:
  ```bash
  --network none
  ```
- Any loopback or local routing tables are scrubbed.
- Firewall rules (`iptables` / `nftables`) on the host worker instances explicitly block and drop all traffic to link-local metadata IP `169.254.169.254/32`.

### 4.3 Filesystem & Storage Sandbox
- **Root Filesystem**: Mounted **`read-only`** (`--read-only`).
- **Scratch Directory**: A dedicated in-memory `tmpfs` is mounted at `/tmp/workspace` with strict mount options:
  ```bash
  mount -t tmpfs -o size=32M,noexec,nosuid,nodev tmpfs /tmp/workspace
  ```
  *(Note: For compiled languages, build tools are executed from a protected toolchain path, while user code is written to the isolated workspace).*
- **No Host Volume Bind Mounts**: The host filesystem is completely invisible to the runner.

### 4.4 User & Privilege Separation
- **UID / GID**: Untrusted code runs under an unprivileged user:
  ```bash
  --user 10001:10001
  ```
- **Drop All Capabilities**:
  ```bash
  --cap-drop ALL
  --security-opt no-new-privileges:true
  ```
- **No Docker Socket Exposure**: `/var/run/docker.sock` is **strictly forbidden** from being mounted anywhere inside the worker containers.

### 4.5 Resource Hardening (Linux cgroups v2)
Every execution instance is bounded by hard resource ceilings:

| Parameter | Standard Scripting (Python/JS) | Compiled (C/C++) | Heavy Runtime (Java/C#) |
| :--- | :--- | :--- | :--- |
| **CPU Quota** | 1.0 vCPU | 1.0 vCPU | 1.5 vCPU |
| **Memory Limit** | 128 MB | 256 MB | 512 MB |
| **PIDs Limit** | 32 max processes | 64 max processes | 128 max processes |
| **Execution Wall Clock Timeout** | 5.0 seconds | 10.0 seconds | 15.0 seconds |
| **CPU Clock Timeout** | 3.0 seconds | 6.0 seconds | 10.0 seconds |
| **Max stdout / stderr Output** | 64 KB | 64 KB | 64 KB |

### 4.6 Secret & Environment Scrubbing
- **Zero Secrets**: Workers receive **no** application environment variables, zero database connection strings, and zero Supabase service-role keys.
- **Clean Environment**: Worker processes are launched with an explicitly whitelisted, clean environment (e.g. only `PATH=/usr/local/bin:/usr/bin:/bin`, `LANG=en_US.UTF-8`).

### 4.7 Ephemeral Lifecycle & Worker Teardown
- After every single execution job:
  1. Any lingering processes are terminated immediately via `SIGKILL`.
  2. The sandbox container / microVM is destroyed.
  3. The ephemeral workspace is scrubbed from memory.
  4. A fresh, clean sandbox container is initialized from a pristine base image.

---

## 5. Implementation Roadmap Prior to Enabling Public Execution

Real code execution will **only** be unlocked in future steps according to this verification checklist:

1. [x] **Step 5 (Current)**: Architecture specification, Pydantic schemas, language registry, queue interfaces, auth verification, and execution submission killswitch.
2. [ ] **Step 6**: Provisioning of dedicated, isolated worker nodes with gVisor (`runsc`) or Firecracker microVMs.
3. [ ] **Step 7**: Integration of language toolchain containers with non-root seccomp profiles.
4. [ ] **Step 8**: Automated red-team penetration testing (fork bombs, OOM, escape payloads, SSRF attempts).
5. [ ] **Step 9**: Controlled rollout with per-language feature flags and strict abuse quotas.
