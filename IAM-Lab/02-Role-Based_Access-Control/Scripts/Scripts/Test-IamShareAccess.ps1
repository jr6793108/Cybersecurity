# Run as a dedicated LAB TEST USER, never as Administrator.
# Example: .\Test-IamShareAccess.ps1 -Share HR
# Example: .\Test-IamShareAccess.ps1 -Share Finance -ReadOnly
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('Finance','HR','IT')]
    [string]$Share,
    [switch]$ReadOnly
)
$ErrorActionPreference = 'Stop'
$identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$path = "\\IAM-APP01\$Share"
Write-Host "Identity: $identity"
Write-Host "Resource: $path"
try {
    Get-ChildItem -LiteralPath $path | Select-Object -First 5 Name
    Write-Host 'BROWSE: ALLOWED'
} catch {
    Write-Host "BROWSE: DENIED or ERROR - $($_.Exception.Message)"
    if ($ReadOnly) { return }
}
if ($ReadOnly) { return }
$file = Join-Path $path ("iam-rbac-test-" + $env:USERNAME + '-' + [guid]::NewGuid().ToString('N') + '.txt')
try {
    "IAM RBAC verification: $identity" | Set-Content -LiteralPath $file -ErrorAction Stop
    $readback = Get-Content -LiteralPath $file -ErrorAction Stop
    Write-Host "WRITE/READ: ALLOWED - $readback"
    Remove-Item -LiteralPath $file -ErrorAction Stop
    Write-Host 'TEST FILE CLEANUP: SUCCESS'
} catch {
    Write-Host "WRITE/READ: DENIED or ERROR - $($_.Exception.Message)"
    Write-Host 'If a file was created before the error, remove it manually after verifying ownership.'
}
