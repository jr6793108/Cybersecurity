# Security and design notes

- **Separation of duties:** `helpdesk01` is not intended to be a Domain Admin. Delegate narrowly to specific user objects and attributes.
- **FGPP scoping:** A fine-grained policy applies to users and global security groups; verify the resultant policy on the target user rather than relying only on policy existence. The domain-wide default lockout threshold remained zero during the lab.
- **Least privilege:** Disabled Add/Remove buttons in ADUC are not a substitute for ACL/LDAP modification tests or security descriptor review.
- **Unlock evidence:** A `LockedOut=False` result after a ten-minute automatic unlock period does not prove a manual unlock caused the transition. Preserve that distinction in interviews and documentation.
- **Token and SMB caching:** Group membership changes may not immediately refresh existing Kerberos tickets, Windows tokens, or SMB sessions. A previous post-transfer `whoami /groups` showed Finance SID; investigate separately from effective resource authorization.
- **Offboarding:** Disabling an AD account blocks new AD authentication, not necessarily existing sessions or federated/cloud access. A full production workflow includes session revocation, service access review, asset return, and retention policy.
- **GitHub privacy:** Review screenshots for usernames, internal addresses, session identifiers, secrets, and personally identifiable information before making repository public. Screenshots here use lab identities; do not upload private keys or passwords.
- **Environment note:** OPNsense WAN default route persistence was an unrelated unresolved lab maintenance issue. Do not conflate it with Project 03 test results.
