# Read-only post-remediation validation.
param([string]$TestUser='access.review01')
Import-Module ActiveDirectory -ErrorAction Stop
$user=Get-ADUser -Identity $TestUser -Properties Department,Enabled -ErrorAction Stop
$user | Select-Object Name,SamAccountName,Department,Enabled
$names=@(Get-ADPrincipalGroupMembership -Identity $TestUser | Select-Object -ExpandProperty Name)
[pscustomobject]@{
  TestUser=$TestUser
  FinanceMembershipPresent=('GG_Finance_Users' -in $names)
  ITMembershipPresent=('GG_IT_Users' -in $names)
  ExpectedState=(('GG_Finance_Users' -notin $names) -and ('GG_IT_Users' -in $names))
} | Format-List
