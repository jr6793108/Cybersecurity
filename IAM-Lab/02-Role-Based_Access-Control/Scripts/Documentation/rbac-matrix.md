# Department RBAC matrix

## Policy
| Role group | Domain Local resource group | Resource | NTFS | SMB |
|---|---|---|---|---|
| `GG_Finance_Users` | `DL_Finance_Share_RW` | `\\IAM-APP01\Finance` | Modify | Change |
| `GG_HR_Users` | `DL_HR_Share_RW` | `\\IAM-APP01\HR` | Modify | Change |
| `GG_IT_Users` | `DL_IT_Share_RW` | `\\IAM-APP01\IT` | Modify | Change |

## Representative user tests — expected = observed
| Account | Finance | HR | IT |
|---|---|---|---|
| `ocarter` | Allow ✓ | Deny ✓ | Deny ✓ |
| `sbennett` | Deny ✓ | Allow ✓ | Deny ✓ |
| `eparker` | Deny ✓ | Deny ✓ | Allow ✓ |

**Note:** `mreed`, `dbrooks`, and `gmitchell` were provisioned and placed in their Global groups, but were not individually access-tested in this project. No claim is made that all possible operations were tested for every matrix cell.
