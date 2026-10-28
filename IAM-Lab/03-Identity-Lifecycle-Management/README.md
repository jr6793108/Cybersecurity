# Project 03 — Help Desk Delegation & Identity Lifecycle Management

**Portfolio lab:** Windows Server Active Directory, VMware ESXi, OPNsense/WireGuard, PowerShell, SMB/NTFS RBAC.  
**Domain:** `corp.example.test` (private lab)  
**Management workstation:** `IAM-MGMT01` (`192.168.150.30`)  
**Domain controller:** `IAM-DC01` (`192.168.150.10`)  
**File server:** `IAM-APP01` (`192.168.150.40`)

## Objective
Demonstrate least-privilege delegated help desk operations, targeted account-lockout controls, and an auditable Joiner–Mover–Leaver (JML) process. Builds on Project 01 (isolated infrastructure / remote administration) and Project 02 (AD group-based file share authorization).

## Demonstrated outcomes
- `CORP\helpdesk01` reset a Finance user's password; the user subsequently changed it at sign-in. AD reported `PasswordExpired=False` and a new `PasswordLastSet` timestamp.
- Help Desk could view `GG_Finance_Users` membership but Add/Remove were disabled in ADUC (UI-level evidence only).
- Created `PSO_IAM_Lockout_Test`, assigned to `GG_IAM_Lockout_Test`; verified resultant policy for `lockout.test01`: threshold **3**, duration **10 minutes**, observation window **10 minutes**.
- Three failed authentication attempts led to account lockout (`LockedOut=True`, `badPwdCount=3`); a subsequent `runas` returned error 1909.
- Delegated Read/Write `lockoutTime` for user objects in IT OU to `GG_Helpdesk_PasswordReset`. Subsequent `helpdesk01` query showed `LockedOut=False`, `badPwdCount=0`. **Attribution caveat:** 10-minute automatic unlock means screenshots alone do not conclusively prove manual unlock was responsible.
- Joiner: provisioned `jtaylor` in Finance and assigned `GG_Finance_Users`. File create/read succeeded on Finance share; HR access denied.
- Mover: changed `jtaylor` department/OU to HR, removed Finance group, added HR group. HR share create/read succeeded; Finance browse/write denied.
- Leaver: disabled `jtaylor`, removed HR membership, moved to `Disabled Accounts`, recorded description; only `Domain Users` remained. Fresh `runas` failed with error **1327**.

## Repository layout
```text
03-identity-lifecycle-management/
├── README.md
├── docs/
│   ├── implementation-guide.md
│   ├── test-results.md
│   ├── access-matrix.md
│   ├── security-notes.md
│   └── evidence-index.md
├── scripts/
│   ├── verify-jml.ps1
│   └── commands-reference.md
└── evidence/
    └── *.png
```

## Quick verification
Run the **read-only** script in `scripts/verify-jml.ps1` from an authorized management workstation with the ActiveDirectory PowerShell module:

```powershell
.\scripts\verify-jml.ps1
```

The script reports *current* directory state; it does not recreate historical test results. See `docs/test-results.md` for observations captured during the exercises.

## Scope / limitations
This is a controlled lab demonstration, not a production IAM implementation. AD account disablement prevents new logons but does not itself terminate all existing sessions or revoke external cloud tokens. Group membership changes may leave cached Kerberos tickets or SMB sessions; verify with a fresh sign-in and server-side permissions. A previous `whoami /groups` output showed a stale Finance group SID after the transfer even though access to the Finance share was denied; this remains an investigation note, not a claim of clean token refresh.

## Evidence and safe publishing
Screenshots included here were provided during lab testing. Review every image before publishing to GitHub; remove credentials, internal identifiers, sensitive metadata, and any material not intended for public distribution. No passwords or private VPN keys are included in the documentation or scripts.
