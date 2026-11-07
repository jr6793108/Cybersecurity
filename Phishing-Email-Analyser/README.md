# Phishing Email Analyser

**Release:** v1.0 — Production (educational use)  
**Live site:** https://jr6793108.github.io/Cybersecurity/Phishing-Email-Analyser/  
**Release date:** 2026-11-07  
**Verification:** [Functional and privacy test report](documentation/TEST-REPORT.md)

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
