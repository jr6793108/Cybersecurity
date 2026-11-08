<<<<<<< HEAD
# 🛡️ Network Traffic Triage Tool

**Cybersecurity Portfolio Project | Phase 3 Complete**

[![Project Status](https://img.shields.io/badge/Status-Phase%203%20Complete-2ea44f)](https://github.com/jr6793108/Cybersecurity/tree/main/Network-Traffic-Triage-Tool) [![Tests](https://img.shields.io/badge/Regression%20Tests-32%2F32%20Passed-2ea44f)](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html) [![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue)](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/)

A **browser-based, educational network traffic triage application** that parses Wireshark-exported CSV packet lists, summarizes observed traffic, and generates **explainable, rule-based security alerts**. Designed for hands-on Security Operations Center (SOC) analysis practice, it processes packet data locally in the browser without uploading it to a server.

### 🔗 Quick links

- **[🚀 Launch the live application](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/)**
- **[✅ Run the 32 automated tests](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html)**
- **[📁 View project source](https://github.com/jr6793108/Cybersecurity/tree/main/Network-Traffic-Triage-Tool)**

---

## 📌 Project Overview

This project demonstrates a practical network security analysis workflow: **import → validate → inspect → summarize → triage**. The application helps an analyst recognize patterns that warrant investigation while making clear that **heuristic alerts are not proof of compromise**.

| Phase | Capability | Status |
|:---:|---|:---:|
| **1** | Secure Wireshark CSV parsing, validation, packet preview, and sample datasets | ✅ Complete |
| **2** | Traffic statistics dashboard, protocol distribution, and top hosts | ✅ Complete |
| **3** | Explainable security triage rules and automated regression tests | ✅ Complete |

## ✨ Features

### Phase 1 — CSV Import and Validation

- Import Wireshark packet-list CSV exports, with a **10 MB maximum file size**.
- Parse quoted fields, embedded commas, escaped quotes, multiline values, and UTF-8 byte-order marks (BOMs).
- Recognize common source and destination column aliases.
- Identify missing required fields and safely reject malformed records.
- Display an import summary, recognized columns, parsing notes, and a **preview of the first 10 packets**.
- Process uploaded data locally in the browser.

### Phase 2 — Network Traffic Dashboard

- Total imported packet count.
- Unique source hosts, destination hosts, and overall hosts.
- Sum of valid captured packet lengths.
- Protocol distribution and top source/destination rankings.
- Descriptive counts based on **CSV rows**, not reconstructed network sessions.

### Phase 3 — Explainable Security Triage

The application evaluates imported packet records using transparent, rule-based heuristics:

| Detection | Observation |
|---|---|
| **High traffic volume** | High packet counts associated with one source |
| **ICMP burst** | Elevated ICMP packet counts |
| **DNS burst** | Elevated DNS activity |
| **Destination sweep** | One source communicating with numerous destination labels |
| **Port sweep** | Multiple explicitly identified destination ports in packet information |

Each alert includes the observed pattern and supporting evidence to guide further investigation. **Thresholds apply to the entire imported CSV**, not to measured time-window rates. The tool does not infer malicious intent or confirm an attack.

## 🧪 Demonstration Datasets

Use the application's sample buttons to load fictional packet records without supplying your own capture.
=======
Network Traffic Triage Tool
Cybersecurity Portfolio Project | Phase 3 Complete

A browser-based, educational network traffic triage application that parses Wireshark-exported CSV packet lists, summarizes observed traffic, and generates explainable, rule-based alerts. The tool is designed for hands-on SOC analysis practice and runs locally in the browser without uploading packet data to a server.

Launch the application · Run the 32 automated tests · View source
Project overview
This project demonstrates a practical network security analysis workflow: import a packet list, validate and inspect its fields, review traffic patterns, and prioritize observations for further investigation. Alerts are heuristics, not evidence of compromise.
Phase	Capability	Status
1	Secure Wireshark CSV parsing, validation, packet preview, and sample datasets	Complete
2	Traffic statistics dashboard, protocol distribution, and top hosts	Complete
3	Explainable security triage rules and automated regression tests	Complete
>>>>>>> 1962b393e96fc3ba42105a7ff7f32a14c4cf3f9a

| Dataset | Packets | Expected triage result |
|---|---:|---|
| **Normal traffic** | 12 | 0 alerts |
| **High-volume traffic** | 72 | 1 medium-severity alert |
| **Mixed SOC lab** | 167 | 4 alerts: 3 medium, 1 low |

<<<<<<< HEAD
> **Note:** These fictional examples support repeatable learning and verification. They are not real-world threat baselines.

## 🚀 Getting Started

### Option A — GitHub Pages

Open the **[live application](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/)** and select a fictional sample or import an authorized Wireshark CSV export.

### Option B — Run Locally
=======
Features
Phase 1 — CSV import and validation
- Import Wireshark packet-list exports in CSV format, with a 10 MB file limit.
- Parse quoted fields, embedded commas, escaped quotes, multiline values, and UTF-8 BOMs.
- Recognize common source and destination column aliases.
- Identify missing required fields and reject malformed records safely.
- Display an import summary, recognized columns, parsing notes, and a preview of the first 10 packets.
- Keep uploaded packet data in the browser; no server-side upload is required.
Phase 2 — Traffic dashboard
- Total imported packet count.
- Unique source hosts, destination hosts, and overall hosts.
- Sum of valid captured packet lengths.
- Protocol distribution and top source/destination rankings.
- Descriptive counts based on CSV rows—not reconstructed network sessions.
Phase 3 — Explainable security triage
Rule-based observations include:
- High traffic volume: unusually high packet counts from one source within the imported dataset.
- ICMP burst: elevated ICMP packet counts.
- DNS burst: elevated DNS activity.
- Destination sweep: one source communicating with numerous destination labels.
- Port sweep: multiple explicitly identified destination ports in packet information.
Each alert presents the observed pattern and supporting evidence to help an analyst decide what to investigate next. Thresholds apply to the entire imported CSV, not to a measured time window; the tool does not infer intent or confirm an attack.
Try the demonstration datasets
Use the buttons in the application to load fictional traffic samples without uploading a file.
Dataset	Packets	Expected triage result
Normal traffic	12	0 alerts
High-volume traffic	72	1 medium-severity alert
Mixed SOC lab	167	4 alerts: 3 medium, 1 low
>>>>>>> 1962b393e96fc3ba42105a7ff7f32a14c4cf3f9a

1. Download or clone the [Cybersecurity repository](https://github.com/jr6793108/Cybersecurity).
2. Open `Network-Traffic-Triage-Tool/index.html` in a modern browser.
3. Select a fictional sample or import an authorized CSV file.
4. Review the import summary, dashboard, and triage alerts.
5. Open `Network-Traffic-Triage-Tool/tests/index.html` to run the regression suite.

<<<<<<< HEAD
The application is static and does not require a backend service or account.

## ✅ Automated Testing

**Latest user-verified result: 32 / 32 tests passed** on the GitHub Pages test runner (November 2026).

The browser-based regression suite covers:

- CSV structure, aliases, quoted and multiline values, malformed input, and UTF-8 BOM handling.
- Demonstration sample packet counts.
- Safe treatment of HTML-like payloads as inert text.
- Dashboard totals, protocol grouping, host rankings, and missing-field behavior.
- Detection rules, threshold boundaries, false-positive safeguards, and empty inputs.

**[▶ Open the live Phase 3 test runner](https://jr6793108.github.io/Cybersecurity/Network-Traffic-Triage-Tool/tests/index.html)**

## 🗂️ Project Structure

```text
Network-Traffic-Triage-Tool/
├── README.md
├── index.html                 # Main application interface
├── script.js                  # CSV parsing, statistics, detection logic
├── styles.css                 # Dark-theme UI
├── samples/                   # Fictional demonstration CSV files
=======
The examples are intended for repeatable learning and verification, not as real-world threat baselines.
Run locally
1. Download or clone the Cybersecurity repository.
2. Open Network-Traffic-Triage-Tool/index.html in a modern browser.
3. Select a fictional sample or import an authorized Wireshark CSV export.
4. Review the import summary, dashboard, and triage alerts.
5. Open Network-Traffic-Triage-Tool/tests/index.html to run the regression suite.
For the deployed version, use the Launch the application link above. The application is static and designed to work without a backend.
Automated testing
Latest user-verified result: 32 / 32 tests passed on the GitHub Pages test runner (November 2026).

The test suite covers:
- CSV structure, aliases, quoted and multiline values, malformed input, and UTF-8 BOM handling.
- Demonstration sample packet counts.
- Safe treatment of HTML-like payloads as text.
- Dashboard totals, protocol grouping, host rankings, and missing-field behavior.
- Detection rules, thresholds, false-positive safeguards, and empty inputs.
Open the live test runner
Project structure
Network-Traffic-Triage-Tool/
├── README.md
├── index.html             # Main application interface
├── script.js              # CSV parsing, statistics, and detection logic
├── styles.css             # Dark-theme UI
├── samples/               # Fictional demonstration CSV files
>>>>>>> 1962b393e96fc3ba42105a7ff7f32a14c4cf3f9a
│   ├── normal-traffic.csv
│   ├── high-volume-traffic.csv
│   └── mixed-soc-lab.csv
└── tests/
<<<<<<< HEAD
    ├── index.html             # Browser test runner
    └── test.js                # 32 regression tests
```

## 🔒 Privacy and Responsible Use

- Packet-list CSV contents are processed **locally in the browser**; no account or backend upload is required.
- The application uses a restrictive Content Security Policy (CSP) and treats CSV-supplied HTML-like content as data rather than executable markup.
- Packet lists can contain sensitive addresses, hostnames, and metadata. Analyze only traffic from systems and networks you own or are authorized to monitor.
- **An alert is not proof of malicious activity; the absence of alerts does not establish safety.**
- This educational project is not a substitute for a production IDS, SIEM, or full packet-capture analysis platform.

## 🧠 Skills Demonstrated

`Network Security Analysis` · `Wireshark CSV Interpretation` · `SOC Triage` · `JavaScript` · `Defensive Input Validation` · `Traffic Statistics` · `Explainable Detection Rules` · `Browser Regression Testing` · `GitHub Pages` · `Technical Documentation`

## 📚 Portfolio Context

Part of the [Cybersecurity portfolio](https://github.com/jr6793108/Cybersecurity), alongside hands-on identity and access management (IAM) and SOC monitoring labs.
=======
    ├── index.html         # Browser test runner
    └── test.js            # 32 regression tests
Privacy and responsible use
- CSV contents are processed locally in the browser; the application does not require an account or backend upload.
- The page uses a restrictive Content Security Policy and avoids rendering CSV-supplied HTML as executable markup.
- Packet lists may contain sensitive addresses, hostnames, and metadata. Analyze only traffic from systems and networks you own or are authorized to monitor.
- A heuristic alert is not proof of malicious activity. No alert does not establish that traffic is safe.
- This tool is educational and is not a replacement for a production IDS, SIEM, or full packet-capture analysis platform.
Skills demonstrated
Network security analysis · Wireshark CSV interpretation · SOC triage · JavaScript · Defensive input validation · Traffic statistics · Explainable detection rules · Browser-based regression testing · GitHub Pages deployment · Technical documentation
Portfolio context
Part of the Cybersecurity portfolio, alongside hands-on identity and access management and SOC monitoring labs.
>>>>>>> 1962b393e96fc3ba42105a7ff7f32a14c4cf3f9a
