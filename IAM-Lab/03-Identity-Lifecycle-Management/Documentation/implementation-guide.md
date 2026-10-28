# Implementation guide — reproducible lab steps

## Prerequisites
- Authorized lab administrator; RSAT Active Directory PowerShell module and ADUC on `IAM-MGMT01`.
- AD domain `corp.example.test` and OUs `IAM-Lab/Users/{Finance,Human Resources,IT}`, `IAM-Lab/Groups`, `IAM-Lab/Administrative Users`, `IAM-Lab/Disabled Accounts`.
- Project 02 AGDLP group chain: `GG_Finance_Users` → `DL_Finance_Share_RW`; `GG_HR_Users` → `DL_HR_Share_RW`; SMB shares `\\IAM-APP01\Finance`, `\\IAM-APP01\HR`.
- Isolated test accounts only. Use unique strong passwords; never commit them.

## A. Delegated password reset
1. Create `helpdesk01` in `Administrative Users`; assign membership in `GG_Helpdesk_PasswordReset` (not Domain Admins).
2. In ADUC, delegate **Reset user passwords and force password change at next logon** for the approved target OU(s). Scope delegation to intended users; do not delegate Full Control.
3. Sign in as `CORP\helpdesk01`, reset `mreed` and require change at next logon.
4. Confirm `PasswordExpired=True` and blank `PasswordLastSet` before user sign-in; then sign in as `mreed`, change password, and confirm `PasswordExpired=False` with timestamp.
5. Check group properties as `helpdesk01`: Finance Add/Remove disabled in ADUC. This is UI evidence, not an exhaustive authorization audit.

## B. Targeted account lockout
1. Create `lockout.test01` in IT OU; add only to `GG_IAM_Lockout_Test` (plus standard Domain Users).
2. With administrative privileges, create and assign the fine-grained password policy. Commands are in `scripts/commands-reference.md`.
3. Verify `Get-ADUserResultantPasswordPolicy lockout.test01` before testing. Threshold = 3; duration = 10 min; observation window = 10 min.
4. On the **IT OU**, use ADUC > Delegate Control > `GG_Helpdesk_PasswordReset` > custom task > user objects > property-specific > **Read lockoutTime** and **Write lockoutTime**. Do not grant unrelated permissions.
5. In a controlled lab session, attempt authentication with an intentionally wrong password at most three times for the test account. Confirm lockout. Do not target admin or real user accounts.
6. Promptly sign in as `helpdesk01`, clear the lockout in ADUC Account tab, click Apply/OK, and check `LockedOut=False`. **For stronger proof**, capture before/after timestamps and event logs before the 10-minute automatic unlock occurs.

## C. Joiner: Finance
1. Create `jtaylor` (Jordan Taylor) under Finance OU, enabled; set Department to `Finance`, require initial password change; add `GG_Finance_Users`.
2. Confirm account OU, department, and group memberships.
3. Sign in as `CORP\jtaylor`; create/read a test file on `\\IAM-APP01\Finance`; verify HR share browsing denied.

## D. Mover: Finance → HR
1. As administrator, remove `jtaylor` from `GG_Finance_Users`; add to `GG_HR_Users`.
2. Set Department to `Human Resources` and move account to Human Resources OU.
3. Confirm new group membership and distinguished name.
4. Fully sign out of `jtaylor`, sign back in, and check token/groups. Test HR file create/read; verify Finance browse and write denied.
5. Investigate any stale group SID shown in `whoami /groups`, including ticket/session caches, before claiming token freshness.

## E. Leaver: offboarding
1. Sign `jtaylor` out and use authorized administrator session.
2. Disable account; remove `GG_HR_Users`; move to `IAM-Lab/Disabled Accounts`; update description.
3. Verify `Enabled=False`, OU, and membership only in Domain Users.
4. Attempt a **new** authentication with `runas /user:CORP\jtaylor cmd`; error 1327 was observed in this lab.
5. For production use, additionally revoke active sessions/tokens, app entitlements, credentials, devices, and access outside AD.

## Rollback / safety
Do not automatically re-enable offboarded identities. For test reuse, obtain authorization, review all group memberships and password policies, and reset credentials. Never execute provisioning/mutation commands blindly against a production domain.
