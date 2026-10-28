# IAM Project 06 — Privileged Access Management and Least-Privilege Delegation

## Objective
Demonstrate administrative account separation, OU-scoped password reset delegation, successful authorized activity, denied out-of-scope activity, and audit evidence in an isolated Active Directory lab.

## Lab environment
- VMware ESXi lab; domain: `corp.example.test`
- Domain controller: `IAM-DC01`; management workstation: `IAM-MGMT01`
- Administrative test identity: `iam.admin01` in `OU=Administrative Users,OU=IAM-Lab`
- Role group: `GG_IAM_UserOperators` in `OU=Groups,OU=IAM-Lab`
- Delegation scope: `OU=IT,OU=Users,OU=IAM-Lab`
- Test accounts: `pam.test01` (IT), `pam.finance01` (Finance)

## Implementation
1. Inventoried Domain Admins, Enterprise Admins, Schema Admins, Administrators, Account Operators, Server Operators, and Backup Operators.
2. Created dedicated `iam.admin01` identity with only Domain Users membership initially.
3. Created `GG_IAM_UserOperators` security group and added `iam.admin01`.
4. Delegated **Reset user passwords and force password change at next logon** on the IT OU using ADUC. Broader account creation/deletion and group modification tasks were left unchecked in the corrected wizard selection.
5. Used a dedicated IT account to verify an authorized password reset.
6. Used a dedicated Finance account to verify an out-of-scope password reset was denied.
7. Checked recursive membership of seven privileged groups; all returned False for `iam.admin01`.

## Validated results
| Control | Observed result |
|---|---|
| Dedicated operator group | `iam.admin01` member of `GG_IAM_UserOperators` |
| IT test reset | ADUC displayed password changed confirmation |
| Audit | Security Event ID 4724 on IAM-DC01; actor `iam.admin01`, target `pam.test01`, 2026-10-27 08:56:23 AM |
| Finance test reset | ADUC displayed Access is denied under `iam.admin01` |
| Privileged group membership | False for all seven groups (recursive check) |

**Evidence limitation:** Event 4724 records a password-reset attempt; the ADUC success dialog is separate corroboration of success. This lab is not a complete PAM deployment (no vaulting, JIT elevation, MFA, or session recording), nor a full ACL audit. The provided screenshots show the corrected delegation selections; they do not independently prove whether any earlier broader delegation was completed. Review OU ACLs before making comprehensive least-privilege claims.

## Repository structure
- `scripts/` — read-only discovery and audit commands
- `docs/` — implementation, validation, and GitHub instructions
- `evidence/` — screenshot checklist (no credentials or private screenshots published)
- `IAM_Project06_Completion_Sheet.pdf` — project summary

## Security and privacy
Do not publish passwords, private keys, production account details, unredacted security logs, or real user information. Use synthetic lab identifiers and redact screenshots as needed.

## Next: Project 07
IAM Security Assessment, Compliance Review, and Capstone Portfolio. See `docs/Project07_Kickoff.md`.
