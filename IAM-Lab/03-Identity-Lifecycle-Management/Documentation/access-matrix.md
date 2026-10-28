# JML access matrix — Jordan Taylor

| Stage | Account | OU | Group membership beyond Domain Users | Finance share | HR share | Evidence |
|---|---|---|---|---|---|---|
| Joiner | Enabled | Finance | `GG_Finance_Users` | Create/read **allowed** | Browse **denied** | Successful Finance file test, HR denied |
| Mover | Enabled | Human Resources | `GG_HR_Users` | Browse/write **denied** | Create/read **allowed** | HR file test, Finance denied |
| Leaver | Disabled | Disabled Accounts | None | New sign-in denied; share not independently retested | New sign-in denied; share not independently retested | AD disabled state and `runas` error 1327 |

**AGDLP:** User account → Global departmental group (`GG_*`) → Domain Local share permission group (`DL_*_Share_RW`) → SMB/NTFS resource. Share and NTFS permissions must both allow access for success.

**Note:** During Mover testing, one `whoami /groups` output still contained `GG_Finance_Users`; this is inconsistent with the AD membership query and merits a token/session investigation. The *effective share access* tests nonetheless showed Finance denial and HR success.
