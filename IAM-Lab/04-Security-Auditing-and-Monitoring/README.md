# Project 04 — Active Directory Security Auditing and Monitoring

## Objective
Collect Windows Security account-management events on the domain controller, parse named event XML fields, and produce an HTML dashboard plus CSV evidence for IAM investigations.

## Lab environment
- VMware ESXi / OPNsense isolated IAM lab
- Windows Server 2025 Active Directory domain controller `IAM-DC01`
- Active Directory domain `corp.example.test`
- Administrative workstation `IAM-MGMT01`

## Verified outcomes (October 26, 2026)
- Audit policy: User Account Management, Security Group Management, and Account Lockout each configured for **Success** auditing.
- Event 4740 captured lockout of lab test account `lockout.test01`, caller workstation `IAM-MGMT01`.
- Reporting tool executed successfully after changing XML extraction from `'#text'` to `InnerText`.
- HTML dashboard rendered and all four exports generated.
- **173** total events, **48** triage candidates, **9** monitored event types; CSV counts matched dashboard.
- Triage event breakdown: 4724 (19), 4726 (11), 4728 (15), 4729 (2), 4740 (1).
- The 11 deletion events had `Administrator` as the recorded actor; this does not independently prove authorization.

## Quick start
On IAM-DC01, open Windows PowerShell 5.1 with permissions to read the Security event log:

```powershell
New-Item -ItemType Directory -Path C:\IAM-Audit -Force
Copy-Item .\scripts\Get-IAMAuditReport.ps1 C:\IAM-Audit\
& 'C:\IAM-Audit\Get-IAMAuditReport.ps1' -Days 7 -OutputDirectory 'C:\IAM-Audit\Reports'
Invoke-Item 'C:\IAM-Audit\Reports\IAM-Audit-Dashboard.html'
```

If execution policy blocks the script, first inspect `Get-ExecutionPolicy -List`. Follow your organization's signing and execution policy; for an approved lab-only temporary process change, `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` may be used if not overridden by Group Policy.

## Monitored event IDs
4720 account created; 4722 enabled; 4724 password reset attempted; 4725 disabled; 4726 deleted; 4728 added to global group; 4729 removed from global group; 4738 changed; 4740 locked out.

## Outputs
`IAM-Audit-Dashboard.html`, `IAM-Audit-Events.csv`, `IAM-Audit-Summary.csv`, `IAM-Audit-Findings.csv`. Findings are review candidates, not proven incidents.

## Privacy and publication
**Do not publish raw audit event exports or the generated dashboard without review.** They include usernames, hostnames, account distinguished names, and event records. This GitHub-ready package includes the tested script and aggregate summary only; raw reports remain in the original uploaded archive.

## Known limitations
- The script was validated in the user's lab, not independently executed against a Windows domain controller here.
- Reporting is point-in-time and read-only; no scheduled collection, SIEM ingestion, or approval workflow is implemented.
- The HTML detail table is limited to 300 rows; the events CSV includes the full selected range.
- 4724 denotes a password reset **attempt**, not necessarily a completed reset.
- ReviewLevel is heuristic and does not imply severity or maliciousness.
- The script does not automatically classify authorization or distinguish repeated account recreation by username.

## Evidence
See `evidence/IAM-Audit-Summary.csv` for the aggregate event distribution. See `docs/validation.md` for tested outcomes and next steps.
