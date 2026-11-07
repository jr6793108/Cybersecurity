# Phishing Email Analyser

**Release:** v1.1 — Production (educational use)  
**Live site:** https://jr6793108.github.io/Cybersecurity/Phishing-Email-Analyser/  
**Release date:** 2026-11-07  
**Verification:** [Manual functional and privacy test report](documentation/TEST-REPORT.md) · [Browser regression tests](tests/) (execution pending)

> This is a rule-based educational screening tool, not a guarantee that any email is safe or malicious. Avoid pasting confidential or regulated information into websites you do not trust.


An educational, fully static phishing warning-sign analyser. No backend, dependencies, accounts, APIs, analytics, tracking, or persistent storage.

## Run locally

Open `index.html` in a modern web browser. Paste email text and click **Analyse Email**. Use **Load safe demonstration** for a synthetic example.

## Deploy

Upload `index.html`, `styles.css`, and `app.js` to any static host (for example, GitHub Pages). No build step is required. The Content Security Policy blocks outbound connections, external scripts, and external resources. Hosting providers may independently log requests for the site's static files; the app itself sends no email content or telemetry.

## Detection and scoring

Each matching rule adds a documented weight. Each warning category is counted at most once; total is capped at 100. Low Risk: 0–24; Suspicious: 25–59; High Risk: 60–100. This is an educational heuristic, not a validated probability of maliciousness. Rules can have false positives and false negatives.

## Limitations

Pasted plain text usually cannot reveal the true target of a visually disguised HTML link. The misleading-link rule works when literal HTML anchors are pasted. The tool does not fetch URLs, validate DNS, authenticate sender identity, scan attachments, or independently validate SPF/DKIM/DMARC. Authentication checks only read pasted Authentication-Results/Received-SPF header text, which may be untrusted. Sender mismatches can be legitimate.

## Privacy and security

The app never calls `fetch`, XHR, WebSocket, or external APIs. It does not use cookies, localStorage, or analytics. User-supplied content is rendered with `textContent`, not `innerHTML`. CSP uses `connect-src 'none'` and `default-src 'none'`. Visitors should still avoid pasting confidential information into untrusted copies of the site. Static hosting infrastructure may log ordinary site visits.

## Production v1.1 improvements

- More readable risk dashboard with a 0–100 score, category thresholds, detected indicator count, and accessible progress information.
- Prominent security notice before the input and a detailed privacy/security disclaimer below the analyser.
- Keyboard focus styling and responsive layout refinements.
- Dependency-free regression tests covering scoring, authentication headers, suspicious links, attachment filenames, and a prior false positive.

## Run automated regression tests

Open [tests/index.html](tests/index.html) in a browser, or visit the [hosted test page](https://jr6793108.github.io/Cybersecurity/Phishing-Email-Analyser/tests/). The test runner displays individual PASS/FAIL results and a summary. No build step or server is needed. The tests use synthetic data and execute entirely in the browser. **These new automated tests have not yet been independently executed and verified.**

## Release checklist

- [x] Static GitHub Pages deployment
- [x] No application backend, user accounts, external API or telemetry
- [x] Manual High Risk, Suspicious, and Low Risk tests previously passed
- [x] Manual DevTools Network and offline checks previously passed
- [x] Visible warning and detailed disclaimer
- [x] Automated test suite committed
- [ ] Confirm the automated suite passes in a browser
- [ ] Repeat a privacy Network-tab check after v1.1 deployment
- [ ] Verify mobile layout and keyboard navigation

### Responsible use

This application is a learning aid, not a mail gateway or a replacement for organizational security procedures. Never treat a Low Risk score as proof of safety. Do not paste sensitive information into copies of the site you do not trust. GitHub Pages may log normal site access, but this application does not send pasted email content to a server.
