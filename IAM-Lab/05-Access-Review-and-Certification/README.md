# Project 05 — Active Directory Access Reviews and Certification

## Objective
Inventory AD security-group memberships, record access certification decisions, identify a controlled excess-access exception, and verify least-privilege remediation.

## Environment
Windows Server 2025 / Active Directory (`corp.example.test`), IAM-MGMT01, IAM-DC01, IAM-APP01.

## Validated results (October 27, 2026)
- 4 groups inventoried; 9 pre-remediation membership records.
- 2 controlled-test certification decisions: `GG_Finance_Users` **Revoke**, `GG_IT_Users` **Approve** for `access.review01`.
- Finance membership removed and IT membership retained, verified using `Get-ADGroupMember` and `Get-ADPrincipalGroupMembership`.
- **Seven other membership records remain Pending Review.** These are not manager-certified.
- Effective SMB permissions after a fresh logon were **not tested**.

## Workflow
1. Run `scripts/Export-AccessReview.ps1` on a domain-joined workstation with the AD PowerShell module.
2. Review the generated CSV and obtain documented owner/manager approval. Do not treat department alignment as approval.
3. For a controlled lab test only, create a dedicated test user and introduce one deliberate Finance membership exception.
4. Record `Revoke` for the excess membership and `Approve` for the correct IT membership; preserve the pre-remediation CSV.
5. Remove only the excess membership and run `scripts/Verify-AccessReview.ps1` to confirm final group state.
6. Optionally test effective file-share access after a fresh sign-in; record separately.

## Evidence
`evidence/SANITIZED-Review-Summary.csv` is a derived summary, **not** the original register. Keep original CSV and identity-bearing screenshots in private storage.

## Security
Never upload passwords, private keys, live user records, raw security logs, or unredacted screenshots. Validate every file before publishing.
