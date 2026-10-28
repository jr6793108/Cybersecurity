# Screenshot evidence index

Screenshots are copies of the lab captures provided during the project. They show fictional lab identities, hostnames, and internal RFC1918 addresses. Review each image for information you do not wish to publish before pushing to a public repository.

## AD design and memberships
- `ou-hierarchy.png` — IAM-Lab OU tree
- `users-finance.png`, `users-hr.png`, `users-it.png` — two users in each department
- `group-finance.png`, `group-hr.png`, `group-it.png` — Global group memberships
- `nested-finance.png`, `nested-hr.png`, `nested-it.png` — Domain Local nesting

## Permission verification
- `finance-ntfs.png`, `finance-smb.png`
- `hr-it-ntfs.png`, `hr-it-smb.png`

## Access testing
- `finance-allowed.png` — Olivia authorized Finance read/write
- `sophia-finance-denied.png` — Sophia unauthorized Finance read
- `sophia-hr-allowed-it-denied.png` — Sophia authorized HR read/write and denied IT browse
- `sophia-it-write-denied.png` — Sophia denied IT write
- `ethan-finance-hr-denied.png` — Ethan denied Finance/HR browse
- `ethan-it-allowed.png` — Ethan identity and authorized IT read/write
- `olivia-hr-it-denied.png` — Olivia identity and denied HR/IT browse
