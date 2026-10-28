#requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateRange(1,365)][int]$Days = 7,
    [string]$OutputDirectory = 'C:\IAM-Audit\Reports'
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ids = @(4720,4722,4724,4725,4726,4728,4729,4738,4740)
$descriptions = @{
    4720='User created';4722='User enabled';4724='Password reset attempted';
    4725='User disabled';4726='User deleted';4728='Global group member added';
    4729='Global group member removed';4738='User changed';4740='Account locked out'
}
$start = (Get-Date).AddDays(-$Days)
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
try {
    $raw = @(Get-WinEvent -FilterHashtable @{LogName='Security';Id=$ids;StartTime=$start} -ErrorAction Stop)
} catch [System.Exception] {
    # No matching events is not a fatal condition; access or log errors are.
    if ($_.Exception.Message -match 'No events were found') { $raw = @() }
    else { throw }
}
$rows = @(
    foreach ($evt in $raw) {
        [xml]$xml = $evt.ToXml()
        $fields = @{}
        foreach ($item in @($xml.Event.EventData.Data)) {
            if ($null -ne $item -and $item.Name) { $fields[[string]$item.Name] = [string]$item.InnerText }
        }
        $target = if ($evt.Id -in @(4728,4729)) { $fields['TargetUserName'] } else { $fields['TargetUserName'] }
        $member = $fields['MemberName']
        $caller = $fields['CallerComputerName']
        $actor = $fields['SubjectUserName']
        $domain = $fields['TargetDomainName']
        $risk = if ($evt.Id -in @(4726,4740)) { 'Review' }
                elseif ($evt.Id -in @(4724,4728,4729)) { 'Inspect' }
                else { 'Info' }
        [pscustomobject]@{
            TimeCreated = $evt.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
            EventID = $evt.Id
            Action = $descriptions[[int]$evt.Id]
            Actor = $actor
            Target = $target
            TargetDomain = $domain
            Member = $member
            CallerComputer = $caller
            Computer = $evt.MachineName
            RecordId = $evt.RecordId
            ReviewLevel = $risk
        }
    }
)
$summary = @(
    foreach ($id in $ids) {
        [pscustomobject]@{
            EventID=$id
            Action=$descriptions[$id]
            Count=@($rows | Where-Object { $_.EventID -eq $id }).Count
        }
    }
)
$findings = @($rows | Where-Object { $_.ReviewLevel -ne 'Info' })
$rows | Export-Csv (Join-Path $OutputDirectory 'IAM-Audit-Events.csv') -NoTypeInformation -Encoding UTF8
$summary | Export-Csv (Join-Path $OutputDirectory 'IAM-Audit-Summary.csv') -NoTypeInformation -Encoding UTF8
$findings | Export-Csv (Join-Path $OutputDirectory 'IAM-Audit-Findings.csv') -NoTypeInformation -Encoding UTF8
function Encode([object]$v) { [System.Net.WebUtility]::HtmlEncode([string]$v) }
$summaryRows = ($summary | ForEach-Object { '<tr><td>'+ (Encode $_.EventID) +'</td><td>'+ (Encode $_.Action) +'</td><td class="num">'+ (Encode $_.Count) +'</td></tr>' }) -join "`n"
$detailRows = ($rows | Select-Object -First 300 | ForEach-Object {
    '<tr><td>'+(Encode $_.TimeCreated)+'</td><td>'+(Encode $_.EventID)+'</td><td>'+(Encode $_.Action)+'</td><td>'+(Encode $_.Actor)+'</td><td>'+(Encode $_.Target)+'</td><td>'+(Encode $_.Member)+'</td><td>'+(Encode $_.CallerComputer)+'</td><td>'+(Encode $_.ReviewLevel)+'</td></tr>'
}) -join "`n"
$total = $rows.Count
$review = $findings.Count
$generated = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$html = @"
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IAM Security Audit Dashboard</title>
<style>body{font-family:Segoe UI,Arial,sans-serif;background:#f5f7fa;color:#15253c;margin:0;padding:30px}main{max-width:1150px;margin:auto}header{border-bottom:3px solid #1c578a;padding-bottom:14px}.muted{color:#5c6b7a}.metrics{display:flex;gap:16px;flex-wrap:wrap;margin:24px 0}.metric{background:white;border:1px solid #dbe3ea;border-radius:10px;padding:20px;min-width:160px}.metric strong{font-size:32px;display:block}section{background:white;border:1px solid #dbe3ea;border-radius:10px;padding:20px;margin:18px 0;overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{padding:10px;border-bottom:1px solid #e7edf3;text-align:left}th{background:#eaf1f8}.num{text-align:right}footer{font-size:12px;color:#5c6b7a}</style></head><body><main>
<header><h1>IAM Security Audit Dashboard</h1><p class="muted">Domain controller: $(Encode $env:COMPUTERNAME) | Last $Days days | Generated $(Encode $generated)</p></header>
<div class="metrics"><div class="metric">Total events<strong>$total</strong></div><div class="metric">Triage candidates<strong>$review</strong></div><div class="metric">Event types<strong>$($ids.Count)</strong></div></div>
<section><h2>Event summary</h2><table><thead><tr><th>Event ID</th><th>Activity</th><th class="num">Count</th></tr></thead><tbody>$summaryRows</tbody></table></section>
<section><h2>Recent events</h2><p class="muted">Showing up to 300 events. Full results are in the CSV export.</p><table><thead><tr><th>Time</th><th>ID</th><th>Action</th><th>Actor</th><th>Target</th><th>Member</th><th>Caller</th><th>Review</th></tr></thead><tbody>$detailRows</tbody></table></section>
<footer>Read-only reporting. Review flags do not establish malicious activity. Audit event 4724 records an attempted reset; event 4740 caller may not identify a person. Protect reports as they may contain internal identities.</footer>
</main></body></html>
"@
[System.IO.File]::WriteAllText((Join-Path $OutputDirectory 'IAM-Audit-Dashboard.html'),$html,[System.Text.UTF8Encoding]::new($false))
Write-Host "Exported $total events and $review triage candidates to $OutputDirectory"
$summary | Format-Table -AutoSize
