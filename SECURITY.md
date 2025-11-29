SECURITY.md — Final Version (Replace Entire File)
# Prima Veritas OSS — Security Policy

## Supported Versions

Prima Veritas OSS v0.1.0 is a deterministic analytics toolkit.
It contains no network services, no authentication layers, and no external API calls.  
All computation happens locally inside a sealed Docker runtime.

Security considerations focus on:

- supply-chain integrity  
- dependency drift  
- determinism-breaking inputs  
- output tampering  

| Version | Status      |
|---------|-------------|
| v0.1.0  | ✔ Active    |
| <0.1.0  | ✖ Unsupported |

---

## Reporting a Vulnerability

If you discover a vulnerability affecting determinism, reproducibility, or pipeline integrity, please report it **privately**.

### **Preferred Contact Method**
**Submit a private GitHub Security Advisory through the repository:**

**GitHub → Security → Advisories → “Report a vulnerability”**

This ensures:

- non-public disclosure  
- proper triage  
- coordinated response  
- no exposure of maintainers’ personal email  
- secure handling of sensitive reproducibility issues  

📌 *Prima Veritas OSS does not use a direct maintainer email for security reports.  
All disclosures flow through GitHub’s advisory system by design.*

**Expected response time:** 72 hours.

Please include:

- Description of the issue  
- Reproduction steps  
- Expected vs. actual results  
- Example data / diffs (if applicable)  
- Impact on determinism, output stability, or reproducibility  

---

## Scope of Valid Security Issues

### **1. Determinism Breaks**
Any condition that produces output drift:

- nondeterministic ordering  
- floating-point instability  
- path-dependent behavior  
- hidden randomness  
- dependency or library changes causing drift  

### **2. Supply-Chain Concerns**

Examples:

- malicious dependency injection  
- compromised Docker layers  
- tampered npm packages  

### **3. Input Manipulation Attacks**

Examples:

- malformed CSVs  
- type coercion exploits  
- crafted inputs triggering nondeterministic branches  

### **4. Reproducibility Attacks**

Examples:

- environment variable manipulation  
- locale drift  
- system clock-dependent code  
- non-hermetic behavior sneaking in  

---

## Out of Scope

The following are **not** considered vulnerabilities:

- performance issues  
- disagreements over clustering correctness  
- requests for new algorithms  
- dataset content issues  
- stylistic or formatting preferences  
- infrastructure or hosting questions  

Prima Veritas OSS is a reproducibility reference, not a production security appliance.

---

## Security Philosophy

Prima Veritas is built on:

- sealed execution  
- predictable behavior  
- minimal dependency surface  
- transparent, auditable modules  
- strict reproducibility guarantees  

Determinism itself acts as a tamper-evident mechanism:  
**any malicious or accidental change immediately produces mismatched hashes.**

---

## Coordinated Disclosure Process

1. Vulnerability reported via GitHub’s private advisory channel  
2. Issue acknowledged privately  
3. Fix developed in a private branch  
4. New version released  
5. Public entry added to `CHANGELOG.md`  