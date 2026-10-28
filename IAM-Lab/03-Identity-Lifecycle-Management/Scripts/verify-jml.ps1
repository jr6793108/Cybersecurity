# Read-only verification for IAM Project 03. Requires ActiveDirectory module.
# Run from an authorized, domain-connected management workstation.
# No account or group is modified.
#Requires -Modules ActiveDirectory
$ErrorActionPreference = 'Stop'
Write-Host '=== IAM Project 03: Current Directory State ==='
Write-Host ('Executing as: ' + (whoami))
foreach ($sam in @('helpdesk01','lockout.test01','jtaylor')) {
    try {
        $u = Get-ADUser -Identity $sam -Properties Enabled,Department,LockedOut,PasswordExpired,PasswordLastSet,Description
        $u | Select-Object Name,SamAccountName,Enabled,Department,LockedOut,PasswordExpired,PasswordLastSet,Description,DistinguishedName | Format-List
        Get-ADPrincipalGroupMembership -Identity $sam | Select-Object -ExpandProperty Name | Sort-Object | ForEach-Object { '  Group: ' + $_ }
    } catch { Write-Warning "Unable to query ${sam}: $($_.Exception.Message)" }
}
try {
    Get-ADUserResultantPasswordPolicy -Identity 'lockout.test01' |
        Select-Object Name,LockoutThreshold,LockoutDuration,LockoutObservationWindow,MinPasswordLength | Format-List
} catch { Write-Warning "Cannot query resultant password policy: $($_.Exception.Message)" }
Write-Host 'Read-only verification complete.'
