# Network Traffic Triage Tool — Phase 1

Educational, privacy-first, static browser application for importing and previewing Wireshark CSV packet lists.

## Run locally (Windows)

1. Extract the ZIP to a folder.
2. Double-click `index.html` to open it in Chrome or Edge.
3. Click **Load Normal Sample**, **Load High-Volume Sample**, or **Load Mixed SOC Lab**; or select a Wireshark `.csv` file.
4. Review import status, recognised columns, missing fields, and the first 10 packet records.
5. Open `tests/index.html` to run browser parser regression tests.

No installation, server, accounts, API keys, or internet connection is required. The sample buttons use generated, fictional CSV content and do not fetch files.

## Export from Wireshark

Capture only on systems or networks you own or are authorised to monitor. Stop capture, choose **File → Export Packet Dissections → As CSV**, save the file, and open it in this tool.

## Supported columns

Required for a fully valid import: source address, destination address, protocol. Optional: time, length, info. Common alternative labels include `src`, `ip.src`, `Source IP`, `dst`, `ip.dst`, `Destination IP`, `frame.len`, and `Information`. Missing required columns are reported rather than causing a crash.

CSV parsing supports quoted fields, commas, doubled quotes, CRLF/LF line endings, UTF-8 BOM, and embedded line breaks. Rows with inconsistent column counts fail safely. The limit is 10 MB / 100,000 packet rows / 100 columns.

## Privacy and security

All processing uses browser JavaScript and local File objects. There is no fetch, XMLHttpRequest, network API, analytics, telemetry, cookies, storage, or backend. A restrictive Content Security Policy blocks external connections. CSV values are displayed with `textContent`, not injected as HTML. Hosting providers may log ordinary requests for static site files, but the application does not transmit imported packet data.

## Sample datasets

- `samples/normal-traffic.csv`: 12 fictional packets.
- `samples/high-volume-traffic.csv`: 72 packets, including 60 from one host.
- `samples/mixed-soc-lab.csv`: 167 packets with high volume, ICMP, DNS, and many destinations.

The demo buttons generate equivalent samples in browser memory. All addresses are private lab ranges.

## Scope and limitations

**Phase 1 only:** no detection alerts, threshold settings, packet statistics dashboard, or filtering yet. CSV exports contain less detail than PCAP, encrypted traffic reduces visibility, NAT can affect attribution, and protocol labels depend on Wireshark. A CSV cannot prove compromise or replace Wireshark, IDS, SIEM, or professional monitoring. The app does not inspect payloads or perform malware analysis.

## Educational use

Only analyse authorised network traffic. **An anomaly is a starting point for investigation, not proof of compromise.**

## Planned next phases

Packet statistics; explainable high-volume detection (default >50 packets); configurable host-scanning, port-scanning where available, ICMP, DNS, and repeated-communication rules; dashboard filtering; expanded tests and accessibility review. Potential later work: PCAP/PCAPNG support, TCP flags, time windows, baselining, graphs, GeoIP, DNS-domain analysis, exportable SOC reports, and IDS-style rules. No external APIs are planned for Version 1.


## Phase 2 — descriptive network traffic dashboard

Phase 2 retains the Phase 1 CSV parser and adds total packet count, unique source and destination hosts, all unique hosts, protocol distribution, top sources, and top destinations. Packet-length totals are displayed only when every imported row has a valid non-negative integer length. These are descriptive statistics, not threat detections.

**Run:** Open `index.html` in Chrome or Edge, click the three sample buttons, and inspect the Network traffic dashboard below the import summary. Open `tests/index.html` to run the expanded 19-test browser suite. Files remain local and no backend or dependencies are required.

**Expected samples:** Normal: 12 packets, 3 unique sources, 1 unique destination. High-volume: 72 packets, top source `192.168.10.25` with 60 packets. Mixed SOC: 167 packets, TCP 83, DNS 49, ICMP 35.

**Privacy and limitations:** CSV content is not transmitted or stored by application code. The page uses a restrictive CSP. A packet-list CSV is not a complete flow log; counts cannot establish attack intent. Phase 3 will add explainable detection rules.


## Phase 3 — explainable security triage (pre-production)

Phase 3 adds browser-local heuristics to the Phase 2 dashboard. **Alerts are investigative leads, not attack verdicts.** All thresholds apply to the entire imported CSV, not a defined time interval. CSV exports are incomplete evidence of network sessions.

Rules (per source): at least 50 packet rows (Medium), 20 ICMP rows (Medium), 30 DNS rows (Low), 10 distinct destination labels (Medium), or 10 distinct destination/port combinations **explicitly labeled** `Dst Port:`, `Destination Port:` or `dport=` in the Info column (Medium). The last rule is not a reliable scan detector without explicit port information; many standard Wireshark CSV exports omit destination port fields.

### Verify before production

1. Open `tests/index.html` locally and confirm **32 / 32** tests pass.
2. Open `index.html`. Load Normal Sample: expect 12 rows and **0 alerts**.
3. Load High-Volume Sample: expect 72 rows and high packet volume from `192.168.10.25`.
4. Load Mixed SOC Lab: expect 167 rows and ICMP, DNS, and multiple-destination alerts; review explanations and recommendations.
5. Upload your own authorised Wireshark CSV (10 MB maximum). Verify Phase 2 statistics and preview remain intact.
6. Open browser DevTools → Network, reload once to capture local static asset loads, then clear the log and run samples and CSV analysis. Verify no outbound requests during analysis. The Content Security Policy sets `connect-src 'none'`; no analytics, external libraries, or remote endpoints are used.
7. Test offline after assets have loaded, inspect Console for errors, and test narrow/mobile viewport and keyboard navigation.
8. Keep this build in staging until the browser tests, privacy checks, and user acceptance are complete.

### Limitations

Heuristics are intentionally simple and may generate false positives or miss malicious traffic. No payload inspection, reputation checks, IP geolocation, live packet capture, or connection reconstruction is performed. The original CSV remains in browser memory and is not persisted. Use only authorised traffic.
