# RBAC access-test results

**Test workstation:** IAM-MGMT01 (`192.168.150.30`)  
**Resource server:** IAM-APP01 (`192.168.150.40`)  
**Domain:** `corp.example.test`  
**Method:** Log on to Windows as the named employee, verify `whoami`, then access UNC paths using PowerShell. Avoid credential reuse from administrative sessions.

| ID | Logged-on identity | Action | Expected | Observed | Evidence |
|---|---|---|---|---|---|
| T01 | `ocarter` | Finance create/read `olivia-test.txt` | Allow | Allow | `finance-allowed.png` |
| T02 | `ocarter` | Browse HR | Deny | Access denied | `olivia-hr-it-denied.png` |
| T03 | `ocarter` | Browse IT | Deny | Access denied | `olivia-hr-it-denied.png` |
| T04 | `sbennett` | Finance read existing file / write new file | Deny | Access denied | `sophia-finance-denied.png` |
| T05 | `sbennett` | HR create/read `sophia-test.txt` | Allow | Allow | `sophia-hr-allowed-it-denied.png` |
| T06 | `sbennett` | IT browse/write | Deny | Access denied | `sophia-hr-allowed-it-denied.png`, `sophia-it-write-denied.png` |
| T07 | `eparker` | Browse Finance | Deny | Access denied | `ethan-finance-hr-denied.png` |
| T08 | `eparker` | Browse HR | Deny | Access denied | `ethan-finance-hr-denied.png` |
| T09 | `eparker` | IT create/read `ethan-test.txt` | Allow | Allow | `ethan-it-allowed.png` |

**Outcome:** 9/9 expected department-access outcomes observed. Several cells include multiple operations; 9/9 refers to the matrix cells, not the count of PowerShell commands.

## Configuration evidence
- OU structure and six test identities: `ou-hierarchy.png`, `users-*.png`
- AGDLP membership: `group-*.png`, `nested-*.png`
- Finance NTFS and SMB: `finance-ntfs.png`, `finance-smb.png`
- HR/IT NTFS and SMB: `hr-it-ntfs.png`, `hr-it-smb.png`

## Limits
The screenshots confirm access results but do not prove that every security-event audit policy was enabled. This project does not claim event-log auditing, exhaustive six-user coverage, or production hardening. The SMB `Get-SmbConnection` identity field proved ambiguous in an earlier administrator-session test, so subsequent negative tests used named Windows logons verified with `whoami`.
