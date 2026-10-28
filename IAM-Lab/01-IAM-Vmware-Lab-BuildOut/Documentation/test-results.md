# Verification results — Project 01

| ID | Test | Evidence observed | Outcome |
|---|---|---|---|
| T01 | WireGuard handshake | OPNsense `wg show` showed latest handshake | PASS |
| T02 | Encrypted traffic | `wg show` showed nonzero transfer counts | PASS |
| T03 | VPN gateway ICMP | Windows ping to `10.77.77.1` succeeded after firewall rule | PASS |
| T04 | VPN-to-management RDP port | `Test-NetConnection 192.168.150.30 -Port 3389` returned `TcpTestSucceeded: True` | PASS |
| T05 | Interactive remote administration | Successful RDP login to `IAM-MGMT01` | PASS |
| T06 | ADUC on management workstation | `corp.example.test` visible in Active Directory Users and Computers | PASS |
| T07 | AD DNS across VPN | No confirmed successful `Resolve-DnsName` test | NOT YET VERIFIED |
| T08 | Gateway reachability after reboot | `ping -c 3 192.168.1.254`: 3 received, 0% loss | PASS |
| T09 | IPv4 default route persists after reboot | Missing after reboot despite gateway selected | FAIL / OPEN |
| T10 | Manual route recovery | `route -n add default 192.168.1.254` restored route | PASS (temporary) |
| T11 | OPNsense configuration backup | Completion not confirmed | NOT YET VERIFIED |

## Evidence standards

- Report actual observations, not expected results, as PASS.
- Screenshots should avoid public/private keys, passwords, session tokens, and full firewall configuration exports.
- Retest the default route after a permanent corrective change, and add date/time plus OPNsense version.
