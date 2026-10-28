# Read-only inventory. Run with AD module and authorized read access.
Import-Module ActiveDirectory
$PrivilegedGroups = @('Domain Admins','Enterprise Admins','Schema Admins','Administrators','Account Operators','Server Operators','Backup Operators')
$Results = foreach ($Group in $PrivilegedGroups) {
    $Members = @(Get-ADGroupMember -Identity $Group -Recursive -ErrorAction Stop)
    [pscustomobject]@{PrivilegedGroup=$Group; IAMOperatorMember=($Members.SamAccountName -contains 'iam.admin01'); RecursiveMemberCount=$Members.Count}
}
$Results | Format-Table -AutoSize
