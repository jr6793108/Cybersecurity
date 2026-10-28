# PowerShell verification scripts

- `Audit-IamShares.ps1`: **read-only** inventory of domain trust, SMB share ACLs, and NTFS folder ACLs. Run elevated on IAM-APP01. Does not modify access or create shares.
- `Test-IamShareAccess.ps1`: employee-context read/write probe for a single specified share. Run **only** in a dedicated test account's Windows session, after checking `whoami`. Authorized test writes a unique marker file; use `-ReadOnly` for an unauthorized browse-only probe. An unauthorized write test can fail with an expected Access Denied error; it does not change ACLs.

Never include credentials in command lines or publish private configuration exports.
