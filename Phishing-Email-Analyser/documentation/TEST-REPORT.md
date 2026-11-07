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

## Production v1.1 final browser verification — 2026-11-07

Evidence: two user-provided Chrome DevTools screenshots of the live production application. The screenshots are retained in the conversation, not committed to the repository.

| ID | Check | Observation | Result |
| --- | --- | --- | --- |
| V11-01 | Automated browser regression tests | 13 / 13 tests passed in the hosted test runner | Pass |
| V11-02 | Live production UI | v1.1 label and prominent disclaimer visible in screenshot | Pass |
| V11-03 | Online analysis with DevTools Network open | Synthetic demonstration yielded 100/100, High Risk, with 12 warning signs; Network log displayed no requests during the tested interaction | Pass for observed workflow |
| V11-04 | Offline analysis without reloading | Synthetic demonstration still yielded 100/100, High Risk, with 12 warning signs | Pass for already-loaded app |
| V11-05 | Offline Network panel | One `data:image/svg+xml` resource entry appeared, status 200 and 0 B transferred; this is an embedded data URL, not evidence of an outbound HTTP request | No observed email-content upload |

**Privacy conclusion:** The tested v1.1 workflow operated in the browser without observed outbound email-content transmission and continued functioning while DevTools was set to Offline. This is a scoped manual verification, **not** a comprehensive privacy/security audit or proof of all possible browser, extension, or hosting behavior.

**Remaining optional checks:** mobile responsiveness, keyboard navigation, broader detection coverage, and verification in a clean browser profile without extensions. These are not marked complete by the screenshots.
