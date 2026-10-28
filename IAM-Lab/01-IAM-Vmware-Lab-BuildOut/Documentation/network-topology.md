# Network topology and traffic flow

```mermaid
flowchart LR
  HOME[Home Windows PC\n192.168.1.214\nWireGuard 10.77.77.2] -->|UDP 51820, home LAN only| FW[OPNsense IAM-FW01\nWAN 192.168.1.249\nLAN 192.168.150.1\nWG 10.77.77.1]
  ROUTER[Home router\n192.168.1.254] --- FW
  FW -->|Isolated IAM-LAB-NET\n192.168.150.0/24| MGMT[IAM-MGMT01\n192.168.150.30]
  FW --> DC[IAM-DC01\n192.168.150.10\nAD / DNS]
  FW --> APP[IAM-APP01\n192.168.150.40]
```

- ESXi `VM Network` carries the home-side OPNsense WAN; `IAM-LAB-NET` carries the isolated lab LAN.
- WireGuard is an encrypted logical overlay. Client traffic for `192.168.150.0/24` enters `wg0` and is routed toward `vmx0` according to firewall policy.
- The lab hosts use `192.168.150.1` as default gateway and `192.168.150.10` as DNS.
- No home-router UDP 51820 port forwarding is configured or required for same-home-LAN access.
- The gateway `192.168.1.254` is the upstream default route when installed, not a VPN endpoint.
