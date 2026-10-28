# Implementation guide — recorded lab design

## Infrastructure
- AD DS/DNS: `IAM-DC01`, `192.168.150.10`
- Administration and test client: `IAM-MGMT01`, `192.168.150.30`
- File/resource server: `IAM-APP01`, `192.168.150.40`, Windows Server 2025 Standard Evaluation
- OPNsense LAN gateway: `192.168.150.1`
- AD DNS name: `corp.example.test`; NetBIOS name observed in ACLs: `CORP`
- IAM-APP01 secure channel was verified with `Test-ComputerSecureChannel` returning `True`.

## Organizational units
```text
corp.example.test
└── IAM-Lab
    ├── Users
    │   ├── Finance
    │   ├── Human Resources
    │   └── IT
    ├── Groups
    ├── Service Accounts
    ├── Workstations
    ├── Servers
    └── Disabled Accounts
```
Built-in AD containers and Domain Controllers OU were not moved.

## Test identities and role memberships
| OU | User | Account | Global Security group |
|---|---|---|---|
| Finance | Olivia Carter | `ocarter` | `GG_Finance_Users` |
| Finance | Marcus Reed | `mreed` | `GG_Finance_Users` |
| Human Resources | Sophia Bennett | `sbennett` | `GG_HR_Users` |
| Human Resources | Daniel Brooks | `dbrooks` | `GG_HR_Users` |
| IT | Ethan Parker | `eparker` | `GG_IT_Users` |
| IT | Grace Mitchell | `gmitchell` | `GG_IT_Users` |

`GG_Helpdesk_PasswordReset` exists but is reserved for a later project.

## AGDLP model
**Accounts → Global Groups → Domain Local Groups → Permissions**

- Finance: `GG_Finance_Users` → `DL_Finance_Share_RW` → Finance folder Modify / share Change.
- HR: `GG_HR_Users` → `DL_HR_Share_RW` → HR folder Modify / share Change.
- IT: `GG_IT_Users` → `DL_IT_Share_RW` → IT folder Modify / share Change.

## NTFS configuration
On each departmental folder under `C:\IAM-Shares`, inheritance was disabled, existing inherited ACEs converted to explicit, broad user entries removed, and these ACEs retained or added:
- `NT AUTHORITY\SYSTEM` — Full Control
- `BUILTIN\Administrators` — Full Control
- Corresponding `CORP\DL_*_Share_RW` — Modify (including Synchronize)

These operations were limited to departmental lab folders, not the drive root or parent folder.

## SMB configuration
The share ACLs were configured with `New-SmbShare` and verified with `Get-SmbShareAccess`:
```powershell
New-SmbShare -Name 'Finance' -Path 'C:\IAM-Shares\Finance' -ChangeAccess 'CORP\DL_Finance_Share_RW' -FullAccess 'BUILTIN\Administrators'
New-SmbShare -Name 'HR' -Path 'C:\IAM-Shares\HR' -ChangeAccess 'CORP\DL_HR_Share_RW' -FullAccess 'BUILTIN\Administrators'
New-SmbShare -Name 'IT' -Path 'C:\IAM-Shares\IT' -ChangeAccess 'CORP\DL_IT_Share_RW' -FullAccess 'BUILTIN\Administrators'
```
**Do not rerun these creation commands against an existing share**; they are historical implementation examples. Use the read-only verification script in `powershell/` to audit the current state.

## Validation
From IAM-MGMT01, `Test-NetConnection IAM-APP01 -Port 445` returned `TcpTestSucceeded : True`. Representative users signed in as themselves and performed UNC browse and file read/write operations. See [test-results.md](../test-results.md).
