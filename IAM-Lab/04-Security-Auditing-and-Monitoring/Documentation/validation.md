# Project 04 validation and investigation notes

**Observed:** On October 26, 2026, the reporting dashboard showed 173 events and 48 triage candidates across nine monitored event types. The CSV row counts matched those dashboard totals. Four report files were present with matching generation timestamps.

| Event ID | Total events |
|---|---:|
| 4720 | 23 |
| 4722 | 17 |
| 4724 | 19 |
| 4725 | 4 |
| 4726 | 11 |
| 4728 | 15 |
| 4729 | 2 |
| 4738 | 81 |
| 4740 | 1 |

## Investigation examples
- **4740**: `lockout.test01` lockout recorded by `IAM-DC01`, caller `IAM-MGMT01`, during controlled lockout testing.
- **4726**: 11 account-deletion records observed, with `Administrator` as actor. Review against authorized change records before closing.
- **4729**: Jordan Taylor removed from `GG_HR_Users` by `Administrator`, consistent with a documented JML lab exercise. Correlation does not replace approval evidence.

## Follow-up actions
1. Review each of the 48 candidate events for authorization and context.
2. Record disposition, reviewer, date, and notes separately; preserve the original CSV unchanged.
3. Consider a dedicated read-only reporting account, retention policy, and scheduling only after review.
4. Confirm audit policy via GPO and document the effective settings.
5. Add redacted screenshots only after checking identifiers.
