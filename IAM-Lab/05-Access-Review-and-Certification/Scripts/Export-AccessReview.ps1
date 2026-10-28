# Read-only AD membership inventory. Run with RSAT ActiveDirectory module.
# Usage: .\Export-AccessReview.ps1 -OutputPath C:\IAM-Project05\Access-Certification-Register.csv
param([string]$OutputPath = 'C:\IAM-Project05\Access-Certification-Register.csv')
Import-Module ActiveDirectory -ErrorAction Stop
$groups = @('GG_Finance_Users','GG_HR_Users','GG_IT_Users','GG_Helpdesk_PasswordReset')
$rows = foreach ($group in $groups) {
  Get-ADGroupMember -Identity $group -ErrorAction Stop |
    Where-Object ObjectClass -eq 'user' |
    ForEach-Object {
      $user = Get-ADUser -Identity $_.DistinguishedName -Properties Department,Enabled -ErrorAction Stop
      [pscustomobject]@{
        UserName=$user.Name; SamAccountName=$user.SamAccountName
        Department=$user.Department; Enabled=$user.Enabled
        SecurityGroup=$group; Reviewer=''; Decision='Pending Review'
        ReviewDate=''; Comments=''
      }
    }
}
$dir = Split-Path $OutputPath -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
if (Test-Path $OutputPath) { throw "Output exists: $OutputPath. Choose a new filename to preserve prior evidence." }
$rows | Export-Csv -Path $OutputPath -NoTypeInformation
$rows | Format-Table UserName,Department,SecurityGroup,Decision -AutoSize
