# Implementation runbook (sanitized)

This is a reconstruction of the verified setup, not a claim that every original GUI action was captured. Always back up OPNsense and retain ESXi console access before changes.

## 1. VMware networking

- Attach `IAM-FW01` WAN adapter (`vmx1`) to home-side `VM Network`.
- Attach LAN adapter (`vmx0`) and lab VMs to isolated port group `IAM-LAB-NET`.
- Do not attach domain-joined lab systems directly to the home network.

## 2. OPNsense interfaces and gateway

- WAN: `192.168.1.249/24`, gateway `WAN_GW = 192.168.1.254`.
- LAN: `192.168.150.1/24`.
- `WAN_GW`: IPv4, WAN interface, upstream gateway selected, gateway monitoring disabled, enabled.
- System > Gateways > Settings: Default Gateway IPv4 = `WAN_GW`.
- On this private-addressed WAN, **Block private networks** was unchecked.

## 3. WireGuard instance and peer

- OPNsense instance: tunnel `10.77.77.1/24`, UDP listen port `51820`, peer `IAM-RemoteVPN` enabled.
- OPNsense peer Allowed IPs: `10.77.77.2/32`; endpoint blank; no preshared key.
- Windows client: `10.77.77.2/32`, endpoint `192.168.1.249:51820`, AllowedIPs `10.77.77.0/24, 192.168.150.0/24`, keepalive 25 seconds.
- Cross-check the public keys on both sides locally; **never commit private keys**.
- A redacted configuration example is in `config/wireguard-client.example.conf`.

## 4. Firewall rules

- WAN ingress: pass UDP 51820 from `192.168.1.214/32` to `192.168.1.249/32`.
- WireGuard inbound: allow ICMP from `10.77.77.2/32` to `10.77.77.1/32` for gateway connectivity test.
- WireGuard inbound: allow TCP 3389 from `10.77.77.2/32` to `192.168.150.30/32` for management RDP.
- Proposed DNS rule: TCP/UDP 53 from `10.77.77.2/32` to `192.168.150.10/32`; functional test not yet confirmed.
- Keep default deny for all other traffic; do not add broad `any-to-any` rules to finish the lab.

## 5. Validation

From Windows client with WireGuard active:

```powershell
ping 10.77.77.1
Test-NetConnection 192.168.150.30 -Port 3389
mstsc /v:192.168.150.30
```

On OPNsense shell:

```sh
wg show
netstat -rn -f inet
ping -c 3 192.168.1.254
```

`wg show` showed latest handshake and bidirectional transfer; the RDP login was successful. The DNS and persistent-route tests are still pending completion.
