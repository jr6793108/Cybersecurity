# Project 01 — Isolated IAM Lab Infrastructure and Secure Remote Access

**Portfolio focus:** network segmentation, firewall policy, VPN administration, Windows Active Directory infrastructure, connectivity validation, and troubleshooting documentation.

## Executive summary
Built a VMware ESXi-hosted identity and access management lab with a separate `192.168.150.0/24` network protected by OPNsense. Configured an **internal-only WireGuard VPN** so a Windows workstation on the home network can securely reach the lab's Windows management workstation over RDP, without internet-facing router port forwarding. Verified WireGuard handshake and traffic counters, VPN gateway ping, and successful RDP login to `IAM-MGMT01`.

**Current status:** Remote access works. **Known issue:** OPNsense 25.1 sometimes boots without the IPv4 default route, even though `WAN_GW` remains selected and reachable. Manual restoration works; persistent fix remains outstanding. AD DNS over VPN and backup completion have not been confirmed.

## Lab inventory

| System | Role | Address / network |
|---|---|---|
| VMware ESXi 8.0.3 | Hypervisor | Home infrastructure |
| IAM-FW01 (OPNsense 25.1) | WAN / LAN firewall and WireGuard endpoint | WAN `192.168.1.249/24` (`vmx1`), LAN `192.168.150.1/24` (`vmx0`), WG `10.77.77.1/24` (`wg0`) |
| Home router | WAN gateway | `192.168.1.254` |
| Home Windows workstation | WireGuard client | Home `192.168.1.214`; WG `10.77.77.2/32` |
| IAM-DC01 | Active Directory / DNS | `192.168.150.10` |
| IAM-MGMT01 | Management workstation | `192.168.150.30` |
| IAM-APP01 | Windows Server 2025 Standard Evaluation; app / lab file server | `192.168.150.40` |

AD domain: `corp.example.test`. The ESXi port group `IAM-LAB-NET` hosts the isolated LAN. The WAN interface connects to `VM Network` on the home subnet.

## Network architecture

See [docs/network-topology.md](docs/network-topology.md) for a Mermaid diagram and traffic-flow explanation.

## What was implemented

1. Created the isolated VMware network and attached OPNsense LAN (`vmx0`) to it.
2. Configured OPNsense WAN (`vmx1`) with static address and gateway.
3. Installed Windows AD/DNS and management systems on the lab LAN.
4. Configured WireGuard with one internal Windows client, split-tunnel AllowedIPs, and no router port forwarding.
5. Restricted inbound WAN UDP 51820 to the home workstation and allowed only necessary WireGuard-to-LAN services.
6. Verified VPN handshake, tunnel ICMP, RDP TCP 3389, and interactive RDP login to `IAM-MGMT01`.
7. Diagnosed the missing post-reboot IPv4 default route and documented a temporary recovery procedure.

## Evidence and verification

See [docs/test-results.md](docs/test-results.md), [docs/firewall-policy.md](docs/firewall-policy.md), and [docs/troubleshooting.md](docs/troubleshooting.md). Sanitized evidence screenshots are in `screenshots/`.

## Security decisions

- **Internal-only VPN endpoint:** `192.168.1.249:51820`; no public port forward.
- **Split tunnel:** home client routes only `10.77.77.0/24` and `192.168.150.0/24` into WireGuard.
- **Least privilege:** source-limited VPN access to RDP on the management workstation; separate DNS policy planned/needs verification.
- **No VPN private keys, passwords, or full firewall backups in the repository.**
- **AD administration via IAM-MGMT01**, rather than direct RDP to the domain controller.

## Outstanding work

- [ ] Verify AD DNS over WireGuard using an actual SRV lookup against `192.168.150.10`.
- [ ] Confirm encrypted OPNsense configuration backup has been downloaded and stored securely outside GitHub.
- [ ] Permanently fix post-reboot default-route persistence and repeat a controlled reboot test.
- [ ] Verify all VPN firewall rules against the intended least-privilege policy and disable unneeded diagnostic logging.

## Reproduction and documentation

Start with [docs/implementation.md](docs/implementation.md), then follow the verification checklist and troubleshooting guide. Scripts in `powershell/` are read-only checks; they do not create VPN tunnels or modify firewall rules.

## Related portfolio work

Project 02 implements AD user provisioning, AGDLP RBAC, and departmental SMB/NTFS authorization testing on this infrastructure.
