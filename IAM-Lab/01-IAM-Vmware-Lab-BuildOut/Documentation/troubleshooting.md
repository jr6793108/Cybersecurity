# Troubleshooting and known limitations

## Known issue: missing default route after OPNsense reboot

**Environment:** OPNsense 25.1, WAN `vmx1 = 192.168.1.249/24`, upstream `WAN_GW = 192.168.1.254`.

**Observed:** `System > Gateways > Settings` still selects `WAN_GW`; gateway status was reported as **Active**; the home router responds to ping; but `netstat -rn -f inet` lacks a `default` entry after reboot.

**Temporary recovery from ESXi console (not a permanent fix):**

```sh
route -n add default 192.168.1.254
netstat -rn -f inet
```

**Evidence:** A previous boot log showed `ROUTING: setting inet default route to 192.168.1.254`; after a later controlled reboot, the default route was absent. The exact event causing the discrepancy remains unknown.

**Follow-up investigation:**

1. Download a secure OPNsense config backup; maintain ESXi console access.
2. Record gateway configuration, version, routing table, and logs immediately after reboot **before** manual route recovery.
3. Check for other upstream gateways, boot-time route installation, and later route removal.
4. Review supported OPNsense updates for this installed version; do not assume a particular release bug without corroborating logs.
5. Only after a root cause or supported remedy is identified, test a controlled reboot and verify the default route and WireGuard/RDP functionality.

**Do not** install an unreviewed startup script or modify working WireGuard keys to compensate for an unrelated IPv4 default-route issue.

## VPN handshake checklist

- Verify OPNsense listens on UDP 51820 and the peer is enabled.
- Verify Windows endpoint is `192.168.1.249:51820` and peer AllowedIPs are correct.
- Verify the WAN source-limited pass rule and that the WAN private-network block is disabled for this internal RFC1918 setup.
- Verify public keys match their opposite peer; never expose private keys.
- Check `wg show` for handshake and traffic counters; use interface packet captures if necessary.
- An ICMP timeout alone does not prove the handshake failed; ICMP may be filtered.

## VPN-to-LAN checklist

- Windows route to `192.168.150.0/24` should use WireGuard.
- Allow traffic on the correct WireGuard firewall rules tab; WAN UDP 51820 alone is not sufficient.
- Check destination host firewall and service listening (RDP 3389, DNS 53).
- Confirm lab hosts use `192.168.150.1` as their default gateway.
