# Incident LAB08-SOC-003 — SOC investigation summary

**Classification:** Authorized laboratory authentication test  
**SOC severity:** Low  
**Disposition:** Closed — benign authorized activity (investigation decision)  
**Endpoint:** IAM-MGMT01 · **Wazuh agent:** 001  
**Date:** November 2, 2026

## Detection

- Windows Security Event ID: **4625**
- Windows Event Record ID: **46309**
- Wazuh rule: **60122**, level **5**
- Logon type: **3** (network)
- Authentication: **NTLM**
- Test account: **SOC-Lab08-Test** (removed after testing)
- Source: **127.0.0.1** (local test)
- Windows event timestamp: **18:11:28** (local)

## Analyst actions

1. Filtered Wazuh by agent `001` and Event `4625`; correlated rule `60122`.
2. Located the native Windows event and validated the correct host, Event ID, and Record ID. An initial XML export inadvertently selected a different event on IAM-DC01; the export was corrected using an Event ID + Record ID filter on IAM-MGMT01.
3. Checked for account lockout Event `4740` in the reviewed hour; none was found on the endpoint.
4. Confirmed the activity was a controlled test and the temporary account was removed.
5. Inventoried five evidence/documentation files; verified the Wazuh CSV copy using SHA-256 equality.

## Evidence inventory

| Original local artifact | Size |
|---|---:|
| `LAB08-SOC-003-Windows-4625-Verified.xml` | 1,462 bytes |
| `LAB08-SOC-003-Wazuh-Alert-60122.csv` | 149 bytes |
| `Incident-Timeline.md` | 1,655 bytes |
| `Incident-Response-Actions.md` | 1,996 bytes |
| `SOC-Incident-Report.md` | 3,843 bytes |

These source artifacts remain on the lab endpoint; **they are not included** in this public-repository package. The CSV copy was confirmed byte-identical by PowerShell SHA-256 comparison. File presence and nonzero sizes do not by themselves verify the full contents of all documents.

## Scope limitation

Findings are confined to IAM-MGMT01 and the reviewed 18:00–19:00 local window. This exercise does not establish the absence of unrelated events elsewhere in the environment.
