# Phishing Email Analyser — Functional and Privacy Test Record

Test date: 2026-11-07  
Environment: Chrome browser; published static GitHub Pages application  
Method: Manual black-box testing using synthetic email samples and Chrome DevTools  
Status: Initial functional and privacy checks passed; not a comprehensive security audit.

## Functional test results

| ID | Test case | Expected | Observed | Outcome |
| --- | --- | --- | --- | --- |
| F-01 | Synthetic credential-phishing email with failed authentication headers, IP-based link and macro request | High Risk | 100/100, High Risk | Pass |
| F-02 | Ordinary team meeting email | 0/100, Low Risk | Initially 28/100 due to false positive; after code fix and fresh browser load, 0/100, Low Risk | Pass after correction |
| F-03 | Invoice reminder with outstanding balance | 12/100, Low Risk | 12/100, Low Risk | Pass |
| F-04 | Urgent overdue invoice | 21/100, Low Risk | 21/100, Low Risk | Pass |
| F-05 | Urgent overdue invoice with shortened URL | 37/100, Suspicious | 37/100, Suspicious | Pass |
| F-06 | Risk dashboard layout at tested desktop viewport | No overlapping score and classification | No overlap after CSS correction | Pass |

## Privacy checks

| ID | Method | Observation | Outcome |
| --- | --- | --- | --- |
| P-01 | Clear Chrome DevTools Network log, load demonstration, run analysis | No requests appeared in Network panel during analysis | Pass for tested interaction |
| P-02 | Switch Chrome DevTools Network throttling to Offline without reloading, then run demonstration analysis | 100/100 High Risk displayed; Network panel empty | Pass for already-loaded application |

## Defect and correction

The initial legitimate-email test produced 28/100 because the executable-attachment rule matched a `.com` email domain. The `.com` extension was removed from that rule. The corrected application returned 0/100 after a fresh browser load. This demonstrates both a false-positive remediation and the importance of verifying that deployed JavaScript is current.

## Scope and limitations

- Test messages were synthetic, not a representative real-world phishing dataset.
- A heuristic risk score is not a probability of maliciousness, and Low Risk does not guarantee safety.
- The tool does not open URLs, scan attachments, independently validate SPF/DKIM/DMARC, or verify sender identity.
- The Network-tab check and offline test support local processing for the tested workflow; they do not establish that every browser extension, hosting service, or possible workflow makes no network requests.
- Browser extensions can interact with page content; use a clean browser profile when conducting sensitive privacy tests.
- Additional testing recommended: each detection rule, benign messages containing filenames and URLs, mobile layout, keyboard accessibility, CSP behavior, and regression tests.

## Reproduction

1. Open https://jr6793108.github.io/Cybersecurity/Phishing-Email-Analyser/.
2. Paste each synthetic test message and click **Analyse Email**.
3. Compare the score and warning signs with the table above.
4. For P-01, open Chrome DevTools → Network, clear the log, and analyse a sample without reloading.
5. For P-02, select **Offline** in the Network throttling dropdown, do not reload, and analyse the demonstration sample.

Evidence source: user-observed screenshots from manual testing on 2026-11-07. Screenshots are not included in this repository document.
