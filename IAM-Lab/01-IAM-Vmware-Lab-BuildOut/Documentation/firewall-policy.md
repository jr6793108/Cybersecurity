# Firewall policy matrix

| Interface / direction | Source | Destination | Protocol / port | Purpose | State |
|---|---|---|---|---|---|
| WAN inbound | `192.168.1.214/32` | `192.168.1.249/32` | UDP 51820 | Internal-only WireGuard handshake | Implemented; handshake verified |
| WireGuard inbound | `10.77.77.2/32` | `10.77.77.1/32` | ICMP | VPN gateway diagnostics | Implemented; ping verified |
| WireGuard inbound | `10.77.77.2/32` | `192.168.150.30/32` | TCP 3389 | RDP to management workstation | Implemented; login verified |
| WireGuard inbound | `10.77.77.2/32` | `192.168.150.10/32` | TCP/UDP 53 | AD DNS | Planned / not yet verified |
| Other | Other | Other | Any | Default deny | Intended baseline; verify effective policy |

## Operational notes

- On OPNsense, use the assigned WireGuard interface rule tab if one is assigned; otherwise the WireGuard group rule tab as appropriate.
- OPNsense WAN is RFC1918; private-network blocking was disabled on that interface to allow the internal VPN endpoint.
- WAN UDP 51820 rule was source-limited to the home workstation. No internet port forwarding was enabled.
- A prior firewall rule showed `reply-to` behavior; no specific root cause for the earlier handshake failure was established. Avoid asserting a proven causal fix.
- Prefer explicit destination/port restrictions and document temporary diagnostic rules before removal.
