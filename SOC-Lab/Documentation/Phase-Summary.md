# Phase-by-phase completion summary

| Phase | Focus | Outcome |
|---|---|---|
| 1 | SOC infrastructure | Ubuntu 24.04.3 SOC VM deployed on VMware ESXi; network verified |
| 2 | Wazuh stack | Manager, indexer, dashboard and Filebeat operational; Wazuh 4.14.9 |
| 3 | Endpoint integration | Windows 11 agent 001 active; Application Event 101 ingestion verified |
| 4 | File integrity monitoring | File create (554), modify (550), delete (553) alerts verified |
| 5 | Security posture and event monitoring | SCA 125 pass / 348 fail / 9 N/A (26%); Event 4624 verified; no AD policy modifications |
| 6 | Controlled failure | Local test authentication failure generated; Event 4625, Record 46309, Wazuh rule 60122; account removed |
| 7 | Investigation and closure | Incident LAB08-SOC-003 documented; five files inventoried; CSV copy hash verified; benign authorized test disposition |

See the PDF manual for verification boundaries, commands, and troubleshooting details.
