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
│   ├── normal-traffic.csv
│   ├── high-volume-traffic.csv
│   └── mixed-soc-lab.csv
└── tests/
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
