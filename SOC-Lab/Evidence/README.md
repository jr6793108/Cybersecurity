# Evidence inventory — publication-safe index

The actual evidence remains on IAM-MGMT01 under `C:\SOC-Lab08\Evidence` and its `LAB08-SOC-003` subfolder. **Raw evidence is intentionally excluded** from this repository.

| File | Purpose | Public upload |
|---|---|---|
| `LAB08-SOC-003-Windows-4625-Verified.xml` | Original Windows event | **Do not upload unredacted** |
| `LAB08-SOC-003-Wazuh-Alert-60122.csv` | Wazuh alert export | Review and sanitize first |
| `Incident-Timeline.md` | Incident chronology | Review and sanitize first |
| `Incident-Response-Actions.md` | Investigation actions | Review and sanitize first |
| `SOC-Incident-Report.md` | Formal report | Review and sanitize first |

## Before adding evidence

- Remove credentials, session tokens, private keys, account identifiers, personal information, and unnecessary internal metadata.
- Review computer names, user names, domain names, IP addresses, and event details for acceptable public disclosure.
- Prefer screenshots or curated redacted excerpts over full logs.
- Keep unmodified originals in a private evidence location and record hashes separately.
- Never commit raw exports first and delete them later: Git history may retain them.
