# PowerShell validation

`Test-IamVpnConnectivity.ps1` runs read-only ping and TCP connection checks from the Windows WireGuard client. Results may differ when firewall rules are tightened. It does not modify the VPN, routes, or OPNsense configuration. For functional DNS, use the SRV lookup described in the script; `Test-NetConnection` to TCP 53 is not a full DNS test.
