# Implementation and validation procedure

## Read-only baseline
Run `scripts/Get-PrivilegedGroupInventory.ps1` from an authorized RSAT PowerShell session. Preserve the seven-group output as evidence.

## Delegation
In ADUC, select `IAM-Lab > Users > IT` > Delegate Control > `GG_IAM_UserOperators`. Select only **Reset user passwords and force password change at next logon**. Do not select account creation/deletion or group modification. Record final wizard settings.

## Controlled tests
- Log in as `CORP\iam.admin01`, confirm `whoami` and `whoami /groups`.
- In ADUC, reset `pam.test01` in IT; capture success dialog.
- On IAM-DC01, run the read-only password reset audit script; confirm actor `iam.admin01`, target `pam.test01`.
- Attempt to reset `pam.finance01` in Finance; capture Access is denied. Use only dedicated lab accounts.
- Confirm all seven privileged group checks show False for `iam.admin01`.

## Scope and caveats
A successful delegated password reset and denial in another OU demonstrate the tested access boundary. They do not prove the complete absence of other delegated ACL permissions or other privileged paths. If an earlier wizard with broader options was ever finished, inspect and remediate inherited and explicit ACEs on the IT OU before claiming exclusive password-reset authority.
