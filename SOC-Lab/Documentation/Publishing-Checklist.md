# GitHub publication checklist

- [ ] Review README and diagrams for public-safe network information.
- [ ] Review PDF for credentials, internal data, or sensitive screenshots.
- [ ] Keep raw XML, CSV, EVTX, credentials, private keys, and unredacted evidence out of the repository.
- [ ] Verify the two SVG diagrams display in GitHub preview.
- [ ] Verify the PDF opens from `Documentation/`.
- [ ] Confirm links in README resolve.
- [ ] Confirm repository is in the intended GitHub account and visibility is appropriate.
- [ ] Inspect `git status` and staged files before pushing.

## Suggested destination

Existing portfolio repository: `jr6793108/Cybersecurity`  
Suggested folder: `Cybersecurity-Lab-08-Wazuh-SOC/`

## Option A — add to existing Cybersecurity repository (recommended)

On a workstation with a checked-out copy of `Cybersecurity`, extract this ZIP, then copy the contents of `Cybersecurity-Lab08-GitHub/` into `Cybersecurity-Lab-08-Wazuh-SOC/` inside that repository.

```bash
cd /path/to/Cybersecurity
git status
git add Cybersecurity-Lab-08-Wazuh-SOC
git diff --cached --stat
git commit -m "Document Cybersecurity Lab 08 Wazuh SOC project"
git push origin main
```

Adjust the branch name if the repository uses something other than `main`.

## Option B — standalone repository

Create an empty GitHub repository named `Cybersecurity-Lab-08-Wazuh-SOC` (do not auto-create README). Extract the package and copy its contents to your local repository folder, then:

```bash
git init
git branch -M main
git add .
git diff --cached --stat
git commit -m "Add Wazuh SOC Lab 08 portfolio"
git remote add origin git@github.com:YOUR_USERNAME/Cybersecurity-Lab-08-Wazuh-SOC.git
git push -u origin main
```

These are publishing instructions; **no remote GitHub repository has been created or modified by this package**.
