# 🛡️ Network Traffic Triage Tool

**Cybersecurity Portfolio Project · Phase 3 Complete**

![Project status](https://img.shields.io/badge/Project-Phase%203%20Complete-2ea44f) ![Tests](https://img.shields.io/badge/Tests-32%2F32%20Passing-2ea44f) ![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-0969da)

A browser-based, educational network traffic triage application that parses Wireshark-exported CSV packet lists, summarizes traffic patterns, and generates **explainable, rule-based security alerts**. Built for hands-on Security Operations Center (SOC) analysis practice, it processes packet data locally in the browser without uploading it to a server.

**[🚀 Launch the application](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/)** · **[✅ Run all 32 tests](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html)** · **[📁 View project source](https://github.com/jr6793108/Cybersecurity/tree/main/Network-Traffic-Triage-Tool)**

## 📌 Project Overview

The tool demonstrates a practical network security analysis workflow:

**Import → Validate → Inspect → Summarize → Triage**

It helps analysts identify patterns worth investigating. Its heuristic alerts **do not prove malicious activity**.

| Phase | Capability | Status |
|:--|:--|:--|
| **1** | Wireshark CSV parsing, validation, packet preview, and sample datasets | ✅ Complete |
| **2** | Traffic dashboard, protocol distribution, and top hosts | ✅ Complete |
| **3** | Explainable security alerts and automated regression tests | ✅ Complete |

## ✨ Features

### Phase 1 — CSV Import and Validation

- Import Wireshark packet-list CSV exports, up to **10 MB** per file.
- Handle quoted fields, embedded commas, escaped quotes, multiline values, and UTF-8 byte-order marks (BOMs).
- Recognize common source and destination column aliases.
- Report missing required fields and safely reject malformed CSV records.
- Display an import summary, recognized columns, parsing notes, and a **first-10-packets preview**.
- Keep imported data in the browser rather than sending it to a backend.

### Phase 2 — Network Traffic Dashboard

- Total imported packets.
- Unique source hosts, destination hosts, and overall hosts.
- Total valid captured packet lengths.
- Protocol distribution.
- Top source and destination host rankings.

> **Interpretation:** Statistics describe imported CSV rows, not reconstructed network sessions or confirmed connections.

### Phase 3 — Explainable Security Triage

| Detection | What it highlights |
|:--|:--|
| **High traffic volume** | High packet counts associated with a source |
| **ICMP burst** | Elevated ICMP packet counts |
| **DNS burst** | Elevated DNS activity |
| **Destination sweep** | A source communicating with many distinct destinations |
| **Port sweep** | Multiple explicitly identified destination ports in packet information |

Alerts provide observed patterns and supporting evidence for further investigation. Thresholds are evaluated across the **entire imported CSV**, not over a measured time interval. The application does not determine intent or confirm an attack.

## 🧪 Demonstration Datasets

The application includes fictional traffic samples that can be loaded using the built-in buttons.

| Sample | Packets | Expected alerts |
|:--|--:|:--|
| **Normal traffic** | 12 | 0 alerts |
| **High-volume traffic** | 72 | 1 medium-severity alert |
| **Mixed SOC lab** | 167 | 4 alerts: 3 medium, 1 low |

These examples are for repeatable learning and testing; they are **not real-world threat baselines**.

## 🚀 Getting Started

### Option A — Use GitHub Pages

1. **[Open the live application](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/)**.
2. Select **Load Normal Sample**, **Load High-Volume Sample**, or **Load Mixed SOC Lab**; alternatively, import an authorized Wireshark CSV export.
3. Review the import summary, traffic dashboard, and triage alerts.
4. **[Open the test runner](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html)** to inspect the regression test results.

### Option B — Run Locally

1. Download or clone the [Cybersecurity repository](https://github.com/jr6793108/Cybersecurity).
2. Open `Network-Traffic-Triage-Tool/index.html` in a modern browser.
3. Select a sample dataset or import an authorized CSV file.
4. Open `Network-Traffic-Triage-Tool/tests/index.html` to run the test suite.

No backend service, login, or server-side packet upload is required. The hosted version is recommended for the simplest experience.

## ✅ Automated Testing

**Latest user-verified result: 32 / 32 tests passed** on the GitHub Pages test runner (November 2026).

The test suite checks:

- CSV structure, column aliases, quoted and multiline values, BOM handling, and malformed input.
- Packet counts in all three demonstration datasets.
- Safe handling of HTML-like strings as data.
- Traffic statistics, protocol grouping, host rankings, and missing fields.
- Detection rules, threshold boundaries, empty input, and false-positive safeguards.

**[▶ View the live Phase 3 test results](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html)**

## 🗂️ Project Structure

```text
Network-Traffic-Triage-Tool/
├── README.md
├── index.html                 # Main application
├── script.js                  # CSV parsing, statistics, detection rules
├── styles.css                 # Dark-theme interface
├── samples/
│   ├── normal-traffic.csv
│   ├── high-volume-traffic.csv
│   └── mixed-soc-lab.csv
└── tests/
    ├── index.html             # Browser-based test runner
    └── test.js                # 32 regression tests
```

## 🔒 Privacy and Responsible Use

- CSV packet records are processed locally in the browser; the app does not require a backend or user account.
- The application uses a restrictive Content Security Policy (CSP) and treats HTML-like CSV content as data rather than executable markup.
- Packet records may contain sensitive addresses, hostnames, and metadata. Analyze only traffic you own or are authorized to monitor.
- **An alert is not proof of an attack; no alert does not guarantee safety.**
- This educational tool is not a substitute for a production IDS, SIEM, or full packet-capture analysis platform.

## 🧠 Skills Demonstrated

**Network security analysis** · **Wireshark CSV interpretation** · **SOC triage** · **JavaScript** · **Defensive input validation** · **Traffic statistics** · **Explainable detection rules** · **Browser-based regression testing** · **GitHub Pages deployment** · **Technical documentation**

## 📚 Portfolio Context

Part of the [Cybersecurity portfolio](https://github.com/jr6793108/Cybersecurity), alongside hands-on identity and access management (IAM) and SOC monitoring labs.
