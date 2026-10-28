Project 07 — IAM Security Assessment
Project Overview
Completed a hands-on Identity and Access Management (IAM) security assessment within an isolated VMware ESXi and Microsoft Active Directory lab.
The assessment evaluated identity inventory, role-based access control, password policies, privileged access, security auditing, and evidence integrity.
Technologies Used
•	VMware ESXi 8.0.3
•	Windows Server and Active Directory Domain Services
•	Windows PowerShell
•	Windows Security Event Logs
•	Group Policy and fine-grained password policies
•	SHA-256 evidence integrity verification
Assessment Activities
1. Identity Inventory
Reviewed Active Directory user accounts, disabled identities, and password configuration exceptions.
2. Role-Based Access Control
Reviewed Finance, Human Resources, IT, helpdesk, and IAM operator group memberships to validate departmental access.
3. Password Policy Assessment
Reviewed the default domain password policy and a fine-grained password policy used for lockout testing.
4. Privileged Access Review
Examined privileged group membership and evaluated delegated administrative accounts against least-privilege principles.
5. Security Event Auditing
Collected and reviewed 204 Windows Security audit events across nine relevant event IDs over a seven-day assessment window.
6. Risk Assessment
Documented three security findings:
Finding	Severity	Status
Default domain password minimum length of 7	Medium	Open
Default domain account lockout threshold of 0	Medium	Open
Built-in Administrator password configured never to expire	High	Open
These findings reflect the lab assessment and are not presented as remediated vulnerabilities.
7. Evidence Integrity
Exported five assessment CSV datasets and generated a SHA-256 integrity manifest for evidence verification.
Key Results
•	Completed a structured seven-phase IAM security assessment.
•	Validated reviewed departmental access memberships.
•	Identified password policy and privileged account risks.
•	Created an evidence-based risk register.
•	Documented findings and recommended security improvements.
Project Documentation
•	Completion Sheet
•	Final Security Assessment
Professional Skills Demonstrated
Identity governance, Active Directory administration, RBAC validation, privileged access assessment, Windows Security auditing, risk documentation, and evidence handling.
Lab Disclaimer
This project was performed in a controlled training environment. It is not a production security assessment or formal compliance certification.
