# Read-only validation from the home Windows workstation with WireGuard connected.
# Requires no administrator privileges for the basic tests.
$targets = @(
    @{ Name = 'RDP IAM-MGMT01'; Address = '192.168.150.30'; Port = 3389 },
    @{ Name = 'DNS IAM-DC01 (TCP)'; Address = '192.168.150.10'; Port = 53 }
)
Write-Host 'VPN gateway ICMP (may be blocked by firewall):'
Test-Connection -ComputerName 10.77.77.1 -Count 2 -ErrorAction Continue
foreach ($t in $targets) {
    Write-Host "Testing $($t.Name)"
    Test-NetConnection -ComputerName $t.Address -Port $t.Port |
        Select-Object ComputerName, RemoteAddress, RemotePort, TcpTestSucceeded
}
Write-Host 'Note: TCP/53 connectivity does not prove UDP DNS resolution works.'
Write-Host 'For functional AD DNS: Resolve-DnsName -Name _ldap._tcp.dc._msdcs.corp.example.test -Type SRV -Server 192.168.150.10'
