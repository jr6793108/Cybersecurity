# Project 02 — Active Directory RBAC and Least-Privilege Access Control

**Status:** Implemented and validated for three representative department accounts (9/9 expected access outcomes).  
**Environment:** VMware ESXi, Windows Server 2025 Standard Evaluation, Active Directory Domain Services, Windows SMB/NTFS.  
**Domain:** `corp.example.test` (private lab).  
**Evidence date:** October 2026.

## Objective
Demonstrate identity provisioning, departmental role assignment, **AGDLP** group nesting, least-privilege NTFS/SMB authorization, and positive/negative access validation in an isolated enterprise-style Windows lab.

## Lab architecture

```text
Home workstation -- WireGuard VPN --> IAM-FW01 (OPNsense)
                                        | IAM-LAB-NET 192.168.150.0/24
                                        +-- IAM-DC01   192.168.150.10 (AD DS / DNS)
                                        +-- IAM-MGMT01 192.168.150.30 (RSAT / test workstation)
                                        +-- IAM-APP01  192.168.150.40 (department SMB shares)
```

The VPN is internal-only, with no public internet port-forwarding. It is not required for domain-member to domain-member SMB authorization tests.

## Implementation summary
1. Created `IAM-Lab` OU with `Users/Finance`, `Users/Human Resources`, `Users/IT`, `Groups`, `Service Accounts`, `Workstations`, `Servers`, and `Disabled Accounts`.
2. Provisioned six fictional users: `ocarter`, `mreed`, `sbennett`, `dbrooks`, `eparker`, `gmitchell`.
3. Assigned departmental users to `GG_Finance_Users`, `GG_HR_Users`, `GG_IT_Users` (Global Security groups). Created `GG_Helpdesk_PasswordReset` for a future delegation exercise; no delegation is claimed here.
4. Nested each Global group into its matching Domain Local Security group: `DL_Finance_Share_RW`, `DL_HR_Share_RW`, `DL_IT_Share_RW`.
5. Created `C:\IAM-Shares\{Finance,HR,IT}` on IAM-APP01. Applied NTFS Modify to each matching Domain Local group, retaining SYSTEM and BUILTIN\Administrators Full Control. Disabled inheritance on these specific folders.
6. Published `\\IAM-APP01\Finance`, `\\IAM-APP01\HR`, `\\IAM-APP01\IT`. Share permissions grant Change to the respective Domain Local group and Full to BUILTIN\Administrators.
7. Verified access using Windows logons of three representative employees. All 9 department-by-user outcomes matched the intended policy.

## Access policy and results

| Test identity | Finance | HR | IT |
|---|---|---|---|
| Olivia Carter (`CORP\ocarter`) | **Allowed** — create/read | **Denied** — browse | **Denied** — browse |
| Sophia Bennett (`CORP\sbennett`) | **Denied** — read/write | **Allowed** — create/read | **Denied** — browse/write |
| Ethan Parker (`CORP\eparker`) | **Denied** — browse | **Denied** — browse | **Allowed** — create/read |

**Scope:** These are 9 observed access outcomes for three representative users, not 9 individual operations or tests for all six accounts. Further negative read/write operations for each denied cell and all six-user coverage are possible extensions.

## Repository guide
- [Architecture and implementation](docs/implementation.md)
- [RBAC matrix](rbac-matrix.md)
- [Test results and limitations](test-results.md)
- [Evidence index](screenshots/README.md)
- [PowerShell read-only audit scripts](powershell/README.md)

## Security considerations
- All identities are fictional lab accounts. No passwords, private keys, or configuration exports are committed.
- Do not publish unredacted screenshots or config backups if they reveal secrets or identifying information.
- Share-level and NTFS ACLs both constrain access; access to a share requires permission at both layers.
- No explicit Deny ACEs were needed: lack of an Allow entry enforced department isolation.
- Do not run test scripts with domain-admin credentials when validating ordinary employee access.

## Known limitation / follow-up
OPNsense 25.1 intermittently failed to install the IPv4 default route `192.168.1.254` on boot, despite the gateway being configured and reachable. Manually restoring the route worked. This **infrastructure issue remains unresolved** and is outside the completed AD RBAC scope. The domain-member SMB tests were performed on the isolated LAN.

## Next project
Help Desk password-reset delegation, account lockout/recovery, onboarding/offboarding, and Windows security-event auditing.
