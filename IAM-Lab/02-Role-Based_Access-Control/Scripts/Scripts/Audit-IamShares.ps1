# Read-only audit. Run on IAM-APP01 in an authorized administrative PowerShell session.
$shares = @('Finance','HR','IT')
Write-Host 'Host:' $env:COMPUTERNAME
Write-Host 'Domain:' (Get-CimInstance Win32_ComputerSystem).Domain
Write-Host 'Secure channel:' (Test-ComputerSecureChannel)
foreach ($name in $shares) {
    $path = Join-Path 'C:\IAM-Shares' $name
    Write-Host "`n=== $name ==="
    Get-SmbShare -Name $name -ErrorAction Stop | Select-Object Name,Path
    Get-SmbShareAccess -Name $name -ErrorAction Stop |
        Format-Table AccountName,AccessControlType,AccessRight -AutoSize
    (Get-Acl -LiteralPath $path -ErrorAction Stop).Access |
        Format-Table IdentityReference,FileSystemRights,AccessControlType,IsInherited -AutoSize
}
