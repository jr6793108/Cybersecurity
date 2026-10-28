# Read-only audit. Run on the domain controller with permission to read Security log.
param([int]$Days = 7)
Get-WinEvent -FilterHashtable @{LogName='Security';Id=4724;StartTime=(Get-Date).AddDays(-$Days)} -ErrorAction SilentlyContinue |
ForEach-Object {
    $x = [xml]$_.ToXml(); $fields = @{}
    foreach ($item in @($x.Event.EventData.Data)) { if ($item.Name) { $fields[$item.Name] = $item.'#text' } }
    [pscustomobject]@{TimeCreated=$_.TimeCreated;EventID=$_.Id;Actor=$fields['SubjectUserName'];Target=$fields['TargetUserName'];Computer=$_.MachineName}
} | Sort-Object TimeCreated -Descending | Format-Table -AutoSize
