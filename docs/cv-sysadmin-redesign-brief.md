# CV update brief — Systems Administrator version
**For:** designer working on the source file for `lyazzcv_NEW.pdf`
**From:** Yazid AITALLALA
**Goal:** repoint the same 2-page layout at a **Systems Administrator** application. Design stays as-is; copy and three blocks need restructuring.

---

## 0. Source file facts (measured from the current PDF — no need to re-derive)

| | |
|---|---|
| Page size | **216 × 303 mm** = A4 (210 × 297) + **3 mm bleed**, crop marks present |
| Typeface | **Jost** — three weights in use: Light 300, Regular 400, SemiBold 600 |
| Purple | `#6152A3` (a few objects use `#6153A3` — same ink) |
| Body grey | `#6D6E71` / `#6D6F72` · summary paragraph `#6B6B6B` |
| Card fill | `#F5F6F7` (page 1) · `#F5F6F8` (page 2) · corner radius **6 pt** |
| Language-bar track | `#D1D3D4`, 4 pt stroke, 150.6 pt long |
| Page number ink | `#231F20` |

**Type scale in use** (size / tracking in 1/1000 em):

| Style | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Name | 30 | 400 | +25 | — |
| Job subtitle | 12 | 400 | **+150** | — |
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

## 1. Global copy changes

| Where | From | To |
|---|---|---|
| Subtitle (both pages) | Full-Stack Software Engineer | **Systems Administrator \| Full-Stack Developer** |
| Contact card, city | Algiers, Algeria. | **Béjaïa, Algeria.** |
| Page footer, city (both pages) | Algiers, Algeria | **Béjaïa, Algeria** |

⚠️ **Subtitle width.** At the current 12 pt / +150 tracking the new subtitle runs ~300 pt — it will overflow the right column (usable width ≈ 250 pt). Two options, your call:
- **A (preferred):** keep the airy look, drop tracking to **+55** so the line matches the current 191 pt width.
- **B:** set the subtitle to **"Systems Administrator"** only and leave tracking at +150.

---

## 2. Profile paragraph (page 1, right column)

Replace the whole paragraph. Box is 6 lines at 7 pt / 11 pt leading — this copy is cut to fit:

> IT professional with an Information Systems Engineering degree and over four years of hands-on full-stack experience, now focused on systems administration. Academic foundation in Windows Server, Active Directory and networking (Cisco Packet Tracer / CCNA), with production experience running Linux servers, Docker containers and AWS infrastructure for a multi-tenant SaaS platform. Designed enterprise-grade encryption architecture and handled real-world data protection compliance.

---

## 3. SKILLS card — **restructure** (biggest change)

The card currently holds 3 groups + a Flutter/Java/JS logo strip. The new skill set is 4 groups and does not fit alongside the logos.

**Ask: delete the Flutter / Java / JS logo strip.** It reads as a developer signal and the space is needed. (If you want to keep a logo row, the sysadmin-appropriate marks would be Linux / Docker / Windows Server — but they'd need sourcing.)

New content, same card, same styles — 4 groups, list lines at 7.78 pt / 10 pt leading (tighten from 12 pt to fit):

**Systems & Virtualization**
Linux server administration (Ubuntu/Debian) - Windows Server & Active Directory - Docker (production) - Kubernetes (fundamentals) - VMware / VirtualBox

**Networking & Security**
TCP/IP - routing & switching - firewall configuration - WAF/ADC concepts - Cisco Packet Tracer / CCNA fundamentals - network troubleshooting

**Storage, Backup & Cryptography**
RAID configurations - backup & recovery strategies - AES-256-GCM - Argon2id - envelope encryption - HMAC-based indexing

**Cloud, Databases & Programming**
AWS (S3) - Git - CI/CD - PostgreSQL - MySQL - Supabase - Dart/Flutter - Java - PHP - JavaScript - Python - C++
IoT / Arduino - PCB design - 3D design (AutoCAD, Tinkercad)

---

## 4. EXPERIENCE card — new bullets

Keep the three roles, titles, dates and the D-Soft / Sonatrach logos. Replace the bullet text.

**Freelancer — Lead Developer & Founder — 2023 - present** *(needs ~10 lines; currently 9 — see note)*
- Architected and operate the backend infrastructure for Swekly.com (MySaaS), a multi-tenant e-commerce SaaS platform: PostgreSQL administration, AWS S3 storage, Linux/Docker deployment.
- Designed and implemented an enterprise-grade encryption architecture (AES-256-GCM, Argon2id, envelope encryption, blind HMAC indexing) protecting multi-tenant customer data.
- Managed data protection compliance under Algerian law (loi 25-11) and ANPDP requirements, including a local PII hosting architecture.
- Handled end-to-end technical operations — server deployment, monitoring and release management.

> Note: this is ~1 line longer than the current block. Gaining the line: pull the "Mobile applications developer" entry down by 12 pt, the card has the room.

**Mobile applications developer — D-Soft Solutions. Béjaïa, Algeria — May 2021 – April 2023**
- Built and maintained cross-platform POS applications (Flutter, Java) with integrated database and inventory systems.
- Designed custom IoT devices with proprietary PCB circuits and 3D-printed enclosures — hands-on embedded and hardware experience.
- Developed full-stack e-commerce websites and internal supplier evaluation platforms.

**Intern — Sonatrach refinery. Algiers, Algeria — January 2019 - June 2019**
- Designed and implemented a full-stack web application to evaluate enterprise supplier performance within a large industrial IT environment.

---

## 5. Education card — **add a coursework line**

This is the block that proves the sysadmin foundation, so it should not be cut. Add under the "2019" date, at **6.2 pt / 7.6 pt leading**, body grey:

> **Relevant coursework:** Windows Server Administration, Active Directory, Computer Networks (Cisco Packet Tracer / CCNA fundamentals), Network Security & Cryptography, Database Systems

The card needs about **20 pt more height** to take it — extend the bottom edge from y 755 to ~y 760 (trim space) and tighten the gap between the heading and the first entry by ~2 pt. Everything else in the card stays.

---

## 6. Page 2

- **Swekly SaaS** — replace the description and tech line, keep the project type and QR:
  - *Description:* A multi-tenant e-commerce platform for the Algerian market with fully isolated store environments, centralized admin, and an encrypted tenant-data architecture. Backend runs on PostgreSQL with AWS S3 storage and Linux/Docker-based deployment, with server-side rendering for SEO and localized delivery integrations.
  - *Used Technologies:* Nuxt 3, Vue 3, Express, Prisma ORM, PostgreSQL, AWS S3, Docker, REST APIs.
- **NexSync POS / Nokhba Store / Matima App** — leave as they are. They're genuine and fill the column; dropping them would leave page 2 half empty.
- **Languages** — labels stay, add the level wording: French (C2 – TCF SO), English (C2 – EF SET), Arabic (Native), Spanish (Basic). Bar fills are already correct.
- **Interests** — no change.

---

## 7. Nothing else changes

Photo, purple arch, corner triangle, ring grids, QR panel and codes, card positions, footers and page numbers all stay exactly as they are.

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
