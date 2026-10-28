# PowerShell command reference (LAB ONLY)

**WARNING:** The commands in the first sections **change AD**. Use only in a dedicated lab after confirming targets and privileges. They are examples of steps already performed, not an unattended deployment script.

## FGPP creation and group assignment
```powershell
New-ADFineGrainedPasswordPolicy `
  -Name 'PSO_IAM_Lockout_Test' -Precedence 10 `
  -ComplexityEnabled $true -MinPasswordLength 14 `
  -PasswordHistoryCount 5 -MinPasswordAge '00:00:00' `
  -MaxPasswordAge '90.00:00:00' -LockoutThreshold 3 `
  -LockoutDuration '00:10:00' -LockoutObservationWindow '00:10:00' `
  -ReversibleEncryptionEnabled $false
Add-ADFineGrainedPasswordPolicySubject -Identity 'PSO_IAM_Lockout_Test' -Subjects 'GG_IAM_Lockout_Test'
```

## JML — Mover
```powershell
Remove-ADGroupMember -Identity 'GG_Finance_Users' -Members 'jtaylor' -Confirm:$false
Add-ADGroupMember -Identity 'GG_HR_Users' -Members 'jtaylor'
Set-ADUser -Identity 'jtaylor' -Department 'Human Resources'
Get-ADUser 'jtaylor' | Move-ADObject -TargetPath 'OU=Human Resources,OU=Users,OU=IAM-Lab,DC=corp,DC=example,DC=test'
```

## JML — Leaver
```powershell
Disable-ADAccount -Identity 'jtaylor'
Remove-ADGroupMember -Identity 'GG_HR_Users' -Members 'jtaylor' -Confirm:$false
Get-ADUser 'jtaylor' | Move-ADObject -TargetPath 'OU=Disabled Accounts,OU=IAM-Lab,DC=corp,DC=example,DC=test'
Set-ADUser -Identity 'jtaylor' -Description 'Project 03 - JML Offboarding Test - Disabled'
```

## Read-only checks
```powershell
Get-ADUserResultantPasswordPolicy 'lockout.test01' | Format-List Name,LockoutThreshold,LockoutDuration,LockoutObservationWindow
Get-ADUser 'lockout.test01' -Properties LockedOut,badPwdCount | Select-Object SamAccountName,LockedOut,badPwdCount
Get-ADUser 'jtaylor' -Properties Department,Enabled,Description | Select-Object Name,SamAccountName,Enabled,Department,Description,DistinguishedName
Get-ADPrincipalGroupMembership 'jtaylor' | Select-Object Name
whoami
```

## SMB access validation (run in intended test user's session)
```powershell
# Joiner: Finance create/read; HR should deny browsing
'JML Joiner Test - Jordan Taylor - Finance' | Set-Content '\\IAM-APP01\Finance\jordan-finance-test.txt' -ErrorAction Stop
Get-Content '\\IAM-APP01\Finance\jordan-finance-test.txt'
Get-ChildItem '\\IAM-APP01\HR' -ErrorAction Stop

# Mover: HR create/read; Finance should deny browsing/writing
'JML Mover Test - Jordan Taylor - Human Resources' | Set-Content '\\IAM-APP01\HR\jordan-hr-test.txt' -ErrorAction Stop
Get-Content '\\IAM-APP01\HR\jordan-hr-test.txt'
Get-ChildItem '\\IAM-APP01\Finance' -ErrorAction Stop
```

## New-authentication denial (test account only)
```powershell
runas /user:CORP\jtaylor cmd
```
