# Observed test results — Project 03

All entries below are based on screenshots and command output provided during the lab conversation. No results are simulated.

| ID | Control | Observed outcome | Assessment |
|---|---|---|---|
| T01 | Help Desk identity | `whoami` → `corp\helpdesk01`; group includes `GG_Helpdesk_PasswordReset` | Pass |
| T02 | Delegated password reset | ADUC confirmed Marcus Reed password changed | Pass |
| T03 | Force change at logon | Before: `mreed` `PasswordExpired=True`, blank `PasswordLastSet`; after: `corp\mreed`, timestamp `10/26/2026 11:52:03 AM`, `PasswordExpired=False` | Pass |
| T04 | Group membership least privilege | ADUC `GG_Finance_Users` Add and Remove disabled under helpdesk session | UI-level pass; API permissions not audited |
| T05 | FGPP target | `PSO_IAM_Lockout_Test` applied to `GG_IAM_Lockout_Test`; resultant policy verified on `lockout.test01` | Pass |
| T06 | Lockout enforcement | Three wrong passwords → error 1326; next attempt → error 1909; `LockedOut=True`, `badPwdCount=3` | Pass |
| T07 | Delegated unlock | IT OU delegation configured for Read/Write `lockoutTime`; after helpdesk action, `whoami=corp\helpdesk01`, `LockedOut=False`, `badPwdCount=0` | Access restored; manual vs automatic timing not proven |
| T08 | Joiner identity | `jtaylor` enabled, Finance department/OU, member `GG_Finance_Users` | Pass |
| T09 | Joiner access | As `corp\jtaylor`, Finance file create/read succeeded; HR browse denied | Pass |
| T10 | Mover directory | Department/OU changed to HR; group query showed `GG_HR_Users`, not Finance | Pass |
| T11 | Mover access | HR file create/read succeeded; Finance browse/write denied | Pass |
| T12 | Mover token | `whoami /groups` screenshot displayed `GG_Finance_Users` after transfer | Follow-up investigation |
| T13 | Leaver directory | `jtaylor` `Enabled=False`, Disabled Accounts OU, only Domain Users; description recorded | Pass |
| T14 | Leaver sign-in | `runas /user:CORP\jtaylor cmd` returned error 1327 | Pass — new authentication rejected |

## Outstanding production-grade checks
- Capture DC Security Event IDs **4740** (lockout), **4767** (unlock), **4724** (password reset), **4725** (disable), **4728/4729** (global group member add/remove) where auditing is enabled and events are available. These event logs were **not supplied**, so are not claimed as verified.
- Repeat unlock with timestamped evidence before automatic unlock, or configure a dedicated test-only policy with a sufficiently long unlock duration under change control.
- Investigate old Finance SID in the Windows token after transfer.
- Review existing sessions and external entitlements for production offboarding.
