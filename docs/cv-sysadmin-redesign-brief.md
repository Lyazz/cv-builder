# CV update brief — Systems Administrator application
**For:** designer holding the master file for `lyazzcv_NEW.pdf`
**From:** Yazid AITALLALA
**Reference:** `Yazid-AITALLALA-SysAdmin-draft.pdf` (same folder) — a rendered draft of everything below, if you'd rather look than read.

The design does not change. Copy changes throughout; the skills, education and languages cards need restructuring; the portrait is replaced; and all six section headings should be set uppercase and positioned the way EXPERIENCE is — baseline 3.43 pt below the top edge of their card, straddling it. In the current file EXPERIENCE and PERSONAL PROJECTS straddle their cards while SKILLS, EDUCATION and LANGUAGES sit 15–30 pt inside, which is what makes them look mismatched.

---

## 0. Source file facts (measured from the current PDF — no need to re-derive)

| | |
|---|---|
| Page size | **216 × 303 mm** = A4 (210 × 297) + **3 mm bleed**, crop marks present |
| Typeface | **Jost** — three weights in use: Light 300, Regular 400, SemiBold 600 |
| Purple | `#6152A3` (a few objects use `#6153A3` — same ink) |
| Body grey | `#6D6E71` / `#6D6F72` · profile paragraph `#6B6B6B` |
| Card fill | `#F5F6F7` (page 1) · `#F5F6F8` (page 2) · corner radius **6 pt** |
| Language-bar track | `#D1D3D4`, 4 pt stroke, 150.6 pt long |
| Page number ink | `#231F20` |

**Type scale in use** (size / tracking in 1/1000 em):

| Style | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Name | 30 | 400 | +25 | — |
| Job subtitle | 12 | 400 | +150 | — |
| Section heading (EXPERIENCE, SKILLS…) | 14 | 400 | +50 | — |
| Entry title (Freelancer, Swekly SaaS…) | 10.14 | **600** | +60 | — |
| Education entry title | 10.14 | **600** | +7 | 12 |
| Org / place line | 7 | 400 | 0 | — |
| Date (purple) | 6.8 | 400 | +59 | — |
| Experience bullets | 6.61 | 400 | −13 | 12 |
| Skills list | 7.78 | 400 | −12 | 12 |
| Project label (purple) | 6.8 | 400 | +59 | — |
| Project description | 6.8 | 400 | −11 | 7.93 |
| "Click or Scan" | 7.05 | **300** | +8 | — |

---

## 1. Header

Subtitle stays **Full-Stack Developer** at the current 12 pt / +150 tracking — no change to the styling, just the wording. Location stays **Algiers, Algeria** in the contact card and both page footers. (D-Soft Solutions' own line keeps **Béjaia** — that's the employer's office, not his.)

---

## 2. Profile paragraph (page 1, right column)

Replace the paragraph. Fits the existing 6-line box at 7 pt / 11 pt leading:

> Full-stack developer with an Information Systems Engineering degree and over five years of experience building and running production software. Alongside development I administer the infrastructure my SaaS platform runs on — Linux servers, Docker, PostgreSQL and AWS — and designed its encryption architecture and data protection compliance. Academic grounding in Windows Server, Active Directory and networking (Cisco Packet Tracer / CCNA).

---

## 3. SKILLS card — **restructure to five groups**

**Delete the Flutter / Java / JS logo strip.** Five groups need the space, and those marks argue for a developer on a CV that has to argue for infrastructure work.

Set the gap between groups to **15 pt** (from 18 pt) so all five fit the existing card. Group titles and list lines keep their current styles.

**Systems & Virtualization**
Linux server administration (Ubuntu/Debian) - Windows Server & Active Directory - Docker (production) - Kubernetes (fundamentals) - VMware / VirtualBox

**Networking & Security**
TCP/IP - Routing & switching - Firewall configuration - WAF / ADC concepts - Cisco Packet Tracer / CCNA fundamentals - Network troubleshooting

**Storage, Backup & Cryptography**
RAID configurations - Backup & recovery strategies - AES-256-GCM - Argon2id - Envelope encryption - HMAC-based indexing

**Cloud, Databases & Programming**
AWS (S3) - Git - CI/CD - PostgreSQL - MySQL - Supabase - Dart / Flutter - Java - PHP - JavaScript - Python - C++

**Other**
IoT / Arduino - PCB design - 3D design (AutoCAD, Tinkercad)

---

## 4. EXPERIENCE card — new bullets

Keep the three roles, their titles, dates and the D-Soft / Sonatrach logos. Replace the bullet text only.

**Freelancer — Lead Developer & Founder — 2023 - present**
- Architected and operate the backend infrastructure for Swekly.com (MySaaS), a multi-tenant e-commerce SaaS platform: PostgreSQL administration, AWS S3 storage and Linux/Docker deployment.
- Designed and implemented an enterprise-grade encryption architecture (AES-256-GCM, Argon2id, envelope encryption, blind HMAC indexing) protecting multi-tenant customer data.
- Managed data protection compliance under Algerian law (loi 25-11) and ANPDP requirements, including a local PII hosting architecture.
- Handled end-to-end technical operations: server deployment, monitoring and release management.

> This runs one line longer than the current block. The card has the room — pull the "Mobile applications developer" entry down by 12 pt.

**Mobile applications developer — D-Soft Solutions. Béjaia, Algeria — May 2021 – April 2023**
- Built and maintained cross-platform POS applications (Flutter, Java) with integrated database and inventory systems.
- Designed custom IoT devices with proprietary PCB circuits and 3D-printed enclosures: hands-on embedded and hardware experience.
- Developed full-stack e-commerce websites and internal supplier evaluation platforms.

**Intern — Sonatrach refinery. Algiers, Algeria — January 2019 - June 2019**
- Designed and implemented a full-stack web application to evaluate enterprise supplier performance within a large industrial IT environment.

---

## 5. Education card — **add a coursework line**

This block is what evidences the systems background, so it should not be cut. Add it under the "2019" date at **6.2 pt / 7.6 pt leading**, body grey:

> Relevant coursework: Windows Server Administration, Active Directory, Computer Networks (Cisco Packet Tracer / CCNA fundamentals), Network Security & Cryptography, Database Systems.

The card needs about **7 pt more height** to take it — extend the bottom edge and pull the Bachelor's block up ~4 pt to open the gap.

---

## 6. Page 2

**Swekly SaaS** — replace the description and tech line; project type and QR stay:
- *Description:* A multi-tenant e-commerce platform built for the Algerian market, with fully isolated store environments per retailer, a centralized administrative suite and an encrypted tenant-data architecture. The backend runs on PostgreSQL with AWS S3 object storage and Linux/Docker-based deployment; the storefront engine uses server-side rendering for SEO and carries localized delivery integrations and multi-language support. Customer data is protected with AES-256-GCM envelope encryption and blind HMAC indexing.
- *Used Technologies:* Nuxt 3, Vue 3, Express, Prisma ORM, PostgreSQL, AWS S3, Docker, REST APIs.

**NexSync POS / Nokhba Store / Matima App** — no change. They're genuine work and they fill the column; dropping them leaves page 2 two-thirds empty.

**Languages card — grows to carry two certificate QR codes.** Bars and their fills are unchanged. Below the Spanish bar, add a "Click or Scan" label and three QR codes in the page-2 style (purple `#6153A3`, ~36 pt square), each captioned at 5 pt over two lines:

| QR | Caption | Links to |
|---|---|---|
| 1 | French / TCF SO - C2 | `https://yazidaitallala.com/certifications/french.pdf` |
| 2 | English / EF SET C2 | `https://yazidaitallala.com/certifications/english1.pdf` |
| 3 | English / EnglishScore B2 | `https://yazidaitallala.com/certifications/english2.pdf` |

Three codes, 38 pt square, at x 340 / 412 / 484. Encode them at **error-correction level M** — on URLs this length that lands on a 33-module grid, matching the density of the project codes above, and keeps each module near 0.4 mm so a phone can actually read them off paper.

> ⚠️ The three certificate PDFs are not live yet — all three URLs 404 at the time of writing. Confirm they resolve before this goes out.

---

## 7. Portrait

**New headshot** — Yazid is supplying the file. Cut it out against the white studio background and drop it into the existing photo frame unchanged: 217.97 × 361.44 pt at x 59.03, y 44.35 (trim space), i.e. a 0.603 aspect. Frame it the way the current one is framed — head flush near the top edge so it sits inside the purple arch, crop centred on the head rather than the body, arms clipped at the frame sides, and the lower torso running behind the contact card.

## 8. Nothing else changes

Purple arch, corner triangle, ring grids, contact card, page-1 QR panel, footers and page numbers all stay exactly as they are.

---

### QR codes currently in the file (for reference)
| Code | Encodes |
|---|---|
| Page 1 · LinkedIn | `https://www.linkedin.com/in/lyazz00/` |
| Page 1 · Portfolio | `https://www.yazidaitallala.com` |
| Page 1 · GitHub | `https://www.github.com/Lyazz` |
| Page 2 · Swekly | `http://yazidaitallala.com/projects/1` |
| Page 2 · NexSync | `http://yazidaitallala.com/projects/2` |
| Page 2 · Matima | `http://yazidaitallala.com/projects/4` |
| Page 2 · Nokhba | `https://nokhba-store.vercel.app` |
| Page 2 · French cert | `https://yazidaitallala.com/certifications/french.pdf` |
| Page 2 · English cert 1 | `https://yazidaitallala.com/certifications/english1.pdf` |
| Page 2 · English cert 2 | `https://yazidaitallala.com/certifications/english2.pdf` |
