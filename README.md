# Cybersecurity Portfolio

Welcome to my hands-on cybersecurity engineering portfolio.

I am an experienced network and telecommunications engineering professional developing practical expertise in Identity and Access Management (IAM), security monitoring, incident response, phishing detection, network traffic triage, and cybersecurity operations.

## Featured projects

| Project | Focus | Status |
| --- | --- | --- |
| [IAM Lab](IAM-Lab/) | Active Directory, RBAC, delegated administration, Group Policy, identity security assessment, and security auditing | Lab projects documented |
| [SOC Lab](SOC-Lab/) | Wazuh monitoring, Windows security events, file integrity monitoring, alert investigation, and incident response | Lab exercises documented |
| [Phishing Email Analyser](Phishing-Email-Analyser/) | Privacy-first, browser-based phishing detection with explainable risk scoring and security recommendations | Production v1.1 — educational use |
| [Network Traffic Triage Tool](Network-Traffic-Triage-Tool/) | Wireshark CSV analysis, network traffic statistics, and explainable rule-based security alerts | Phase 3 complete — 32/32 automated tests passed |

## Phishing Email Analyser

A static HTML, CSS, and JavaScript web application designed to analyse pasted suspicious email content locally in the visitor's browser. It looks for social-engineering pressure, credential requests, suspicious links and attachments, and email authentication failures when relevant headers are provided.

The application reports a 0–100 heuristic risk score, explains the indicators found, and offers practical next steps. It does not require accounts, a database, a backend, or external AI services. **Risk scores are educational indicators, not definitive proof that an email is safe or malicious.**

**[Launch the live Phishing Email Analyser](https://jr6793108.github.io/Cybersecurity/Phishing-Email-Analyser/)**

[View the application source and setup instructions](Phishing-Email-Analyser/README.md)

## Network Traffic Triage Tool

A privacy-first, browser-based network traffic analysis application built with HTML, CSS, and JavaScript. The tool imports Wireshark-exported CSV packet lists, validates and previews packet records, and presents a dashboard of protocol distribution, traffic volume, and top source and destination hosts.

Phase 3 adds explainable, rule-based alerts for high traffic volume, ICMP and DNS bursts, destination sweeps, and potential port scans. The tool includes three fictional demonstration datasets and a browser-based regression suite with **32 of 32 tests passing**. Packet data is processed locally in the browser without a backend upload.

**[Launch the live Network Traffic Triage Tool](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/)**

[Run the Phase 3 automated tests](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html) · [View the project documentation](Network-Traffic-Triage-Tool/README.md)

**Educational-use note:** Alerts are heuristic observations, not proof of malicious activity; an absence of alerts does not establish that traffic is safe.

## IAM Lab Network Architecture

This diagram illustrates my VMware ESXi-based Identity and Access Management lab, including OPNsense firewall segmentation, Active Directory infrastructure, and isolated internal networking.

![IAM Lab Network Architecture](IAM-Lab/Architecture/Cybersecurity-Lab-Network-Architecture.png)

The IAM lab supports hands-on exercises in identity lifecycle management, RBAC, privileged access, and security auditing.

## Technical skills

Active Directory, RBAC, identity lifecycle management, PowerShell, Windows security auditing, VMware ESXi, OPNsense, WireGuard, Wazuh, incident response, phishing analysis, Wireshark CSV interpretation, network traffic triage, security alert investigation, HTML, CSS, and JavaScript.

## Career focus

IAM Analyst, Identity Security Analyst, SOC Analyst, Security Analyst, and Cybersecurity Operations roles.
