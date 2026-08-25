/* =========================================================
   CV Builder
   The paper is built at true A4 (794 x 1123 @96dpi) and the
   content is really paginated: blocks are measured off-screen,
   then packed into as many sheets as they need. What you see
   on the dark desk is what comes out of the printer.
   ========================================================= */
(() => {
  'use strict';

  const API = '/api/cv';

  /* ---------- page geometry (px @96dpi) ---------- */
  const SHEET_H = 1123;
  const HEADER_H = 200;
  const PAD_V = 60;          // 30 top + 30 bottom
  const PAD_V_CONT = 72;     // continuation sheets breathe more at the top
  const CONT_RESERVE = 36;   // room for a repeated "(suite)" heading
  const COL_P1 = SHEET_H - HEADER_H - PAD_V;
  const COL_PN = SHEET_H - PAD_V_CONT;

  const SWATCHES = ['#1c3d5e', '#123f36', '#5c1c3d', '#3a2a6b', '#7a3b12', '#1f4f6b', '#232a33', '#8a1f1f'];

  const LEVELS = ['Débutant', 'Élémentaire', 'Intermédiaire', 'Courant', 'Bilingue'];

  const ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    cake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4 21v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7M12 8V4M9 4.5 12 2l3 2.5"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6.5 17V9.5l1.8-3.6A2 2 0 0 1 10.1 5h3.8a2 2 0 0 1 1.8 1l1.8 3.6V17M3 12h18"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>'
  };

  /* ---------- state ---------- */
  const defaults = () => ({
    fullName: '',
    jobTitle: '',
    profile: '',
    showProfile: false,
    photo: null,
    showPhoto: true,
    photoZoom: 100,
    phone: '', showPhone: true,
    email: '', showEmail: true,
    location: '', showLocation: true,
    linkedin: '', showLinkedin: false,
    licence: '', showLicence: false,
    birthdate: '', age: '', birthdateMode: 'date', showBirthdate: false,
    accentColor: '#1c3d5e',
    fontFamily: 'Carlito',
    textScale: 100,
    density: 100,
    sidebarWidth: 34,
    titles: {
      contact: 'Contact',
      languages: 'Langues',
      skills: 'Compétences',
      interests: "Centres d'intérêt",
      experiences: 'Expériences professionnelles',
      educations: 'Diplômes / Formations',
      profile: 'Profil'
    },
    visible: {
      languages: true, skills: true, interests: true,
      experiences: true, educations: true
    },
    languages: [{ name: 'Français', level: 4 }],
    skills: ['Communication'],
    interests: [],
    experiences: [{ role: '', company: '', location: '', period: '', description: '' }],
    educations: [{ degree: '', school: '', location: '', period: '' }]
  });

  let cv = defaults();
  let dirty = false;
  let zoom = null;          // null = auto-fit
  let activePage = 0;

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function fmtDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return (y && m && d) ? `${d}/${m}/${y}` : iso;
  }
  function hexToRgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function darken(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const to = (v) => Math.round(v * (1 - amt)).toString(16).padStart(2, '0');
    return `#${to(r)}${to(g)}${to(b)}`;
  }
  // Blends hexA toward hexB by t (0 = hexA, 1 = hexB) — same math as
  // CSS color-mix(), computed in JS because html2canvas's CSS parser
  // (used for the PDF export) doesn't understand color-mix() and
  // throws on any stylesheet rule that contains it.
  function mix(hexA, hexB, t) {
    const a = hexToRgb(hexA), b = hexToRgb(hexB);
    const to = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
    return `#${to(a.r, b.r)}${to(a.g, b.g)}${to(a.b, b.b)}`;
  }
  // WCAG relative luminance → contrast against the white page.
  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const f = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  // The eight swatches are all safe, but the colour picker will
  // happily hand us a pale yellow. Fills keep the chosen colour;
  // anything set in type uses this darkened-until-legible version.
  function readableInk(hex) {
    let out = hex;
    for (let i = 0; i < 24 && 1.05 / (luminance(out) + 0.05) < 4.5; i++) out = darken(out, 0.08);
    return out;
  }
  // What to set *on* the accent block. White is right for the eight
  // swatches, but a pale pick from the colour input would make a
  // white monogram vanish — so take whichever side contrasts more.
  function onAccent(hex) {
    const L = luminance(hex);
    return (1.05 / (L + 0.05)) >= ((L + 0.05) / (luminance('#1f2933') + 0.05))
      ? '#ffffff' : '#1f2933';
  }
  function applyAccent(hex) {
    const root = document.documentElement.style;
    const on = onAccent(hex);
    const { r, g, b } = hexToRgb(hex);
    const onRgb = hexToRgb(on);
    root.setProperty('--accent', hex);
    root.setProperty('--accent-ink', readableInk(hex));
    root.setProperty('--on-accent', on);
    // "r, g, b" tokens for rgba(var(--accent-rgb), alpha) — replaces
    // color-mix(var(--accent) X%, transparent), which html2canvas can't parse.
    root.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    root.setProperty('--on-accent-rgb', `${onRgb.r}, ${onRgb.g}, ${onRgb.b}`);
    // Same reason: precomputed opaque blends instead of color-mix(accent, #fff).
    root.setProperty('--tint-1', mix(hex, '#ffffff', 0.95));
    root.setProperty('--tint-2', mix(hex, '#ffffff', 0.89));
    root.setProperty('--tint-3', mix(hex, '#ffffff', 0.80));
    root.setProperty('--tint-hover', mix(hex, '#ffffff', 0.94));
    root.setProperty('--tint-strong', mix(hex, '#ffffff', 0.28));
  }

  /* =========================================================
     BUILDING THE PAPER: every block is atomic and measurable
     ========================================================= */
  const heading = (section, cont) =>
    ({ section, isHeading: true, html: `<h3 class="b b-h3 is-h${cont ? ' cont' : ''}">${esc(cv.titles[section])}</h3>` });

  function contactBlocks() {
    const out = [];
    const row = (icon, text) =>
      `<div class="b b-contact">${ICONS[icon]}<span>${esc(text)}</span></div>`;
    const items = [];
    if (cv.showPhone && cv.phone) items.push(['phone', cv.phone]);
    if (cv.showEmail && cv.email) items.push(['mail', cv.email]);
    if (cv.showLocation && cv.location) items.push(['pin', cv.location]);
    if (cv.showLinkedin && cv.linkedin) items.push(['link', cv.linkedin]);
    if (cv.showLicence && cv.licence) items.push(['car', cv.licence]);
    if (cv.showBirthdate) {
      if (cv.birthdateMode === 'age' && cv.age) items.push(['cake', `${cv.age} ans`]);
      else if (cv.birthdateMode === 'date' && cv.birthdate) items.push(['cake', fmtDate(cv.birthdate)]);
    }
    if (!items.length) return out;
    out.push(heading('contact'));
    items.forEach(([i, t]) => out.push({ section: 'contact', isHeading: false, html: row(i, t) }));
    return out;
  }

  function sidebarBlocks() {
    let out = contactBlocks();

    if (cv.visible.languages) {
      const langs = cv.languages.filter((l) => l.name.trim());
      if (langs.length) {
        out.push(heading('languages'));
        langs.forEach((l) => out.push({
          section: 'languages', isHeading: false,
          html: `<div class="b b-lang"><span class="n">${esc(l.name)}</span>
                 <span class="lv">${esc(LEVELS[l.level - 1] || '')}</span></div>`
        }));
      }
    }
    if (cv.visible.skills) {
      const skills = cv.skills.filter((s) => s.trim());
      if (skills.length) {
        out.push(heading('skills'));
        skills.forEach((s) => out.push({
          section: 'skills', isHeading: false,
          html: `<div class="b b-dot">${esc(s)}</div>`
        }));
      }
    }
    if (cv.visible.interests) {
      const its = cv.interests.filter((s) => s.trim());
      if (its.length) {
        out.push(heading('interests'));
        its.forEach((s) => out.push({
          section: 'interests', isHeading: false,
          html: `<div class="b b-dot">${esc(s)}</div>`
        }));
      }
    }
    return out;
  }

  function entryHtml(title, org, place, period, description) {
    const orgLine = [org, place].filter(Boolean).map(esc).join(', ');
    const bullets = String(description || '')
      .split('\n').map((s) => s.trim()).filter(Boolean);
    return `<div class="b b-entry">
      <p class="role">${esc(title)}</p>
      ${orgLine || period ? `<p class="meta"><b>${orgLine}</b>${period ? ` | ${esc(period)}` : ''}</p>` : ''}
      ${bullets.length ? `<ul class="desc">${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }

  function mainBlocks() {
    const out = [];

    if (cv.showProfile && cv.profile.trim()) {
      out.push(heading('profile'));
      out.push({
        section: 'profile', isHeading: false,
        html: `<p class="b b-profile">${esc(cv.profile)}</p>`
      });
    }
    if (cv.visible.experiences) {
      const exps = cv.experiences.filter((e) => e.role.trim() || e.company.trim());
      if (exps.length) {
        out.push(heading('experiences'));
        exps.forEach((e) => out.push({
          section: 'experiences', isHeading: false,
          html: entryHtml(e.role, e.company, e.location, e.period, e.description)
        }));
      }
    }
    if (cv.visible.educations) {
      const edus = cv.educations.filter((e) => e.degree.trim() || e.school.trim());
      if (edus.length) {
        out.push(heading('educations'));
        edus.forEach((e) => out.push({
          section: 'educations', isHeading: false,
          html: entryHtml(e.degree, e.school, e.location, e.period, e.description)
        }));
      }
    }
    return out;
  }

  /* =========================================================
     MEASURE + PACK
     ========================================================= */
  function measure(host, blocks) {
    host.innerHTML = blocks.map((b) => b.html).join('');
    return Array.from(host.children).map((el) => {
      const cs = getComputedStyle(el);
      return el.offsetHeight + parseFloat(cs.marginTop || 0) + parseFloat(cs.marginBottom || 0);
    });
  }

  // Greedy top-down packer. A heading never ends a page (it drags the
  // first item of its section along), and a section that spills is
  // re-announced as "(suite)" at the top of the next sheet.
  function pack(blocks, heights) {
    const cap = (p) => (p === 0 ? COL_P1 : COL_PN - CONT_RESERVE);
    const pages = [[]];
    const used = [0];

    for (let i = 0; i < blocks.length; i++) {
      const h = heights[i];
      const p = pages.length - 1;
      // a heading must be able to carry its first item
      let need = h;
      if (blocks[i].isHeading && i + 1 < blocks.length) need += heights[i + 1];

      if (used[p] > 0 && used[p] + need > cap(p)) {
        pages.push([]); used.push(0);
      }
      const cur = pages.length - 1;
      pages[cur].push(blocks[i]);
      used[cur] += h;
    }

    // re-announce a section that continues onto a new sheet
    for (let p = 1; p < pages.length; p++) {
      const first = pages[p][0];
      if (first && !first.isHeading && first.section && first.section !== 'contact') {
        pages[p].unshift(heading(first.section, true));
        used[p] += CONT_RESERVE;
      }
    }
    return { pages, used, cap };
  }

  // A junior CV — three entries, no bullet lists — used to sit in the
  // top half of the sheet with the bottom third blank, and no slider
  // could reach that far. When a single page is well under-filled, the
  // slack goes back into the gaps between sections instead of pooling
  // at the bottom. Mutates used[] so the page gauge reports what the
  // sheet actually looks like.
  function reflow(pk) {
    if (pk.pages.length !== 1) return 0;
    const gaps = pk.pages[0].filter((b) => b.isHeading).length - 1;
    const free = COL_P1 - pk.used[0];
    if (gaps < 1 || free < COL_P1 * 0.28) return 0;
    // never more than ~1.6 section gaps of extra air: past that the
    // spacing itself starts to look like a mistake, and the slider
    // scale has to move with the density setting to stay coherent
    const per = Math.min((free * 0.8) / gaps, 30 * (cv.density / 100) * 1.6);
    pk.used[0] += per * gaps;
    return per;
  }

  /* =========================================================
     RENDER THE SHEETS
     ========================================================= */
  const stack = $('stack');
  const stackFit = $('stackFit');
  const canvas = $('canvas');

  // initials, up to two words — the monogram's whole content
  const initials = (name) => String(name || '').trim().split(/\s+/)
    .filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  function headerHtml() {
    const zoomStyle = `transform:scale(${(cv.photoZoom || 100) / 100})`;
    // The accent block always carries something. A real photo when
    // there is one; otherwise the initials, which say more than the
    // generic silhouette did. The silhouette is now only the fallback
    // of the fallback — a CV with no photo and no name yet.
    const mono = initials(cv.fullName);
    const photo = cv.showPhoto && cv.photo
      ? `<div class="cv-photo"><img src="${cv.photo}" alt="" style="${zoomStyle}"></div>`
      : mono
        ? `<div class="cv-monogram">${esc(mono)}</div>`
        : `<div class="cv-photo"><span class="ph">${ICONS.user}</span></div>`;
    return `<div class="cv-header">
      ${photo}
      <div class="cv-head-text">
        <h1 class="cv-name">${esc(cv.fullName) || 'Votre nom'}</h1>
        ${cv.jobTitle ? `<p class="cv-tagline">${esc(cv.jobTitle)}</p>` : ''}
      </div>
    </div>`;
  }

  let raf = null;
  function paint() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(doPaint);
  }

  function doPaint() {
    raf = null;
    applyAccent(cv.accentColor);

    // paper-wide variables, mirrored onto the measuring rig
    const vars = {
      '--ts': cv.textScale / 100,
      '--dn': cv.density / 100,
      '--cv-font': `"${cv.fontFamily}"`,
      '--side-w': `${cv.sidebarWidth}%`
    };
    const rig = document.querySelector('.measure-rig');
    [stack, rig].forEach((el) => {
      Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
    });

    const sideAll = sidebarBlocks();
    const mainAll = mainBlocks();

    const sidePack = pack(sideAll, measure($('measureSidebar'), sideAll));
    const mainPack = pack(mainAll, measure($('measureMain'), mainAll));

    const total = Math.max(sidePack.pages.length, mainPack.pages.length, 1);
    const empty = !sideAll.length && !mainAll.length;

    // only worth doing when the whole CV is one page — on a two-page
    // CV the blank is at the end of sheet 2, where it belongs
    const flowSide = total === 1 ? reflow(sidePack) : 0;
    const flowMain = total === 1 ? reflow(mainPack) : 0;

    let html = '';
    for (let p = 0; p < total; p++) {
      const side = (sidePack.pages[p] || []).map((b) => b.html).join('');
      const main = (mainPack.pages[p] || []).map((b) => b.html).join('');
      html += `<div class="sheet${p > 0 ? ' cont' : ''}" data-page="${p}">
        ${p === 0 ? headerHtml() : ''}
        <div class="cv-body">
          <aside class="cv-sidebar" style="--sp-flow:${flowSide}px">${side}</aside>
          <div class="cv-main" style="--sp-flow:${flowMain}px">${main || (p === 0 && empty
            ? '<p class="cv-blank">Remplissez le formulaire — votre CV se construit ici.</p>' : '')}</div>
        </div>
      </div>`;
    }
    stack.innerHTML = html;

    paintChips(total, sidePack, mainPack);
    fit();
  }

  function paintChips(total, sidePack, mainPack) {
    const chips = $('pageChips');
    let html = '';
    for (let p = 0; p < total; p++) {
      const cap = p === 0 ? COL_P1 : COL_PN;
      const fillPct = Math.min(100, Math.round(
        Math.max((sidePack.used[p] || 0), (mainPack.used[p] || 0)) / cap * 100));
      html += `<button class="chip" data-page="${p}" aria-current="${p === activePage}"
                 title="Page ${p + 1} — ${fillPct} % remplie">
                 <span class="fill" style="height:${fillPct}%"></span>
                 <span class="num">${p + 1}</span></button>`;
    }
    chips.innerHTML = html;
  }

  /* ---------- zoom / fit ---------- */
  function fit() {
    const avail = canvas.clientWidth - 52;
    const s = zoom !== null ? zoom : Math.min(Math.max(avail / 794, 0.25), 1.4);
    stack.style.transform = `scale(${s})`;
    stackFit.style.width = `${794 * s}px`;
    stackFit.style.height = `${stack.scrollHeight * s}px`;
    $('zoomVal').textContent = `${Math.round(s * 100)}%`;
  }

  /* =========================================================
     THE FORM
     ========================================================= */
  const lbl = (t, input, full) =>
    `<div class="blk-f${full ? ' full' : ''}"><label>${t}</label>${input}</div>`;

  function tools(i, len, kind) {
    return `<div class="blk-tools">
      <button class="ico" data-act="up" data-kind="${kind}" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Monter">↑</button>
      <button class="ico" data-act="down" data-kind="${kind}" data-i="${i}" ${i === len - 1 ? 'disabled' : ''} aria-label="Descendre">↓</button>
      <button class="ico" data-act="dup" data-kind="${kind}" data-i="${i}" aria-label="Dupliquer">⧉</button>
      <button class="ico danger" data-act="del" data-kind="${kind}" data-i="${i}" aria-label="Supprimer">✕</button>
    </div>`;
  }

  function drawExperiences() {
    $('experiencesList').innerHTML = cv.experiences.map((e, i, a) => `
      <div class="blk" data-i="${i}" data-kind="exp">
        <div class="blk-head"><span class="blk-n">Poste ${i + 1}</span>${tools(i, a.length, 'exp')}</div>
        <div class="blk-grid">
          ${lbl('Poste occupé', `<input type="text" data-k="role" value="${esc(e.role)}" placeholder="Vendeuse">`, true)}
          ${lbl('Employeur', `<input type="text" data-k="company" value="${esc(e.company)}" placeholder="Librairie Kalam">`)}
          ${lbl('Lieu', `<input type="text" data-k="location" value="${esc(e.location)}" placeholder="Béjaia, Algérie">`)}
          ${lbl('Période', `<input type="text" data-k="period" value="${esc(e.period)}" placeholder="Juin – Août 2024">`, true)}
          ${lbl('Missions — une par ligne', `<textarea data-k="description" rows="2" placeholder="Conseil client et encaissement">${esc(e.description || '')}</textarea>`, true)}
        </div>
      </div>`).join('') || '<p class="hint">Aucune expérience pour le moment.</p>';
  }

  function drawEducations() {
    $('educationsList').innerHTML = cv.educations.map((e, i, a) => `
      <div class="blk" data-i="${i}" data-kind="edu">
        <div class="blk-head"><span class="blk-n">Formation ${i + 1}</span>${tools(i, a.length, 'edu')}</div>
        <div class="blk-grid">
          ${lbl('Diplôme', `<input type="text" data-k="degree" value="${esc(e.degree)}" placeholder="Master en management">`, true)}
          ${lbl('Établissement', `<input type="text" data-k="school" value="${esc(e.school)}" placeholder="Université de Béjaia">`)}
          ${lbl('Lieu', `<input type="text" data-k="location" value="${esc(e.location)}" placeholder="Béjaia, Algérie">`)}
          ${lbl('Période', `<input type="text" data-k="period" value="${esc(e.period)}" placeholder="2024 – 2026">`, true)}
          ${lbl('Précisions — une par ligne', `<textarea data-k="description" rows="2" placeholder="Mention bien">${esc(e.description || '')}</textarea>`, true)}
        </div>
      </div>`).join('') || '<p class="hint">Aucune formation pour le moment.</p>';
  }

  function drawLanguages() {
    $('languagesList').innerHTML = cv.languages.map((l, i, a) => `
      <div class="row" data-i="${i}" data-kind="lang">
        ${lbl('Langue', `<input type="text" data-k="name" value="${esc(l.name)}" placeholder="Français">`)}
        <div class="blk-f lvl"><label>Niveau</label>
          <select data-k="level">${LEVELS.map((n, v) =>
            `<option value="${v + 1}"${v + 1 === l.level ? ' selected' : ''}>${n}</option>`).join('')}</select>
        </div>
        <button class="ico danger" data-act="del" data-kind="lang" data-i="${i}" aria-label="Supprimer">✕</button>
      </div>`).join('') || '<p class="hint">Aucune langue.</p>';
  }

  function drawList(kind) {
    const arr = kind === 'skill' ? cv.skills : cv.interests;
    const host = kind === 'skill' ? $('skillsList') : $('interestsList');
    const ph = kind === 'skill' ? 'Esprit d\'équipe' : 'Lecture';
    host.innerHTML = arr.map((v, i, a) => `
      <div class="row" data-i="${i}" data-kind="${kind}">
        <div class="blk-f"><input type="text" data-k="value" value="${esc(v)}" placeholder="${ph}"></div>
        <button class="ico" data-act="up" data-kind="${kind}" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Monter">↑</button>
        <button class="ico danger" data-act="del" data-kind="${kind}" data-i="${i}" aria-label="Supprimer">✕</button>
      </div>`).join('') || `<p class="hint">Rien pour l'instant.</p>`;
  }

  function drawSwatches() {
    $('swatches').innerHTML = SWATCHES.map((c) =>
      `<button class="swatch" data-color="${c}" style="background:${c}"
        aria-pressed="${c.toLowerCase() === cv.accentColor.toLowerCase()}"
        aria-label="Accent ${c}"></button>`).join('');
  }

  function drawForm() {
    const set = (id, val) => { const el = $(id); if (el) el.value = val ?? ''; };
    const chk = (id, val) => { const el = $(id); if (el) el.checked = !!val; };

    set('fullName', cv.fullName); set('jobTitle', cv.jobTitle);
    set('profile', cv.profile); chk('showProfile', cv.showProfile);
    set('phone', cv.phone); chk('showPhone', cv.showPhone);
    set('email', cv.email); chk('showEmail', cv.showEmail);
    set('location', cv.location); chk('showLocation', cv.showLocation);
    set('linkedin', cv.linkedin); chk('showLinkedin', cv.showLinkedin);
    set('licence', cv.licence); chk('showLicence', cv.showLicence);
    set('birthdate', cv.birthdate); set('age', cv.age); chk('showBirthdate', cv.showBirthdate);

    set('accentColor', cv.accentColor);
    set('fontFamily', cv.fontFamily);
    set('textScale', cv.textScale); $('textScaleOut').textContent = `${cv.textScale} %`;
    set('density', cv.density); $('densityOut').textContent =
      cv.density < 95 ? 'Compact' : cv.density > 105 ? 'Aéré' : 'Normal';
    set('sidebarWidth', cv.sidebarWidth);
    $('sidebarWidthOut').textContent = `${cv.sidebarWidth} % de la largeur de la page`;
    chk('showPhoto', cv.showPhoto);
    set('photoZoom', cv.photoZoom); $('photoZoomOut').textContent = `${cv.photoZoom} %`;

    Object.entries(cv.titles).forEach(([k, v]) => {
      const el = $('title' + k.charAt(0).toUpperCase() + k.slice(1));
      if (el) el.value = v;
    });
    Object.entries(cv.visible).forEach(([k, v]) => {
      const el = $('show' + k.charAt(0).toUpperCase() + k.slice(1));
      if (el) el.checked = v;
    });

    const thumb = $('photoThumb');
    thumb.hidden = !cv.photo;
    if (cv.photo) thumb.src = cv.photo;
    $('photoDropText').querySelector('strong').textContent =
      cv.photo ? 'Remplacer la photo' : 'Choisir une photo';

    drawBirthMode();
    drawSwatches();
    drawExperiences(); drawEducations(); drawLanguages();
    drawList('skill'); drawList('interest');
    countProfile();
  }

  function drawBirthMode() {
    const isAge = cv.birthdateMode === 'age';
    $('modeDateBtn').classList.toggle('active', !isAge);
    $('modeAgeBtn').classList.toggle('active', isAge);
    $('birthdate').hidden = isAge;
    $('age').hidden = !isAge;
  }
  function countProfile() {
    const n = (cv.profile || '').length;
    $('profileCount').textContent = n === 0 ? '0 caractère'
      : `${n} caractères${n > 600 ? ' — pensez à raccourcir' : ''}`;
  }

  function redraw() { drawForm(); paint(); }

  /* =========================================================
     EVENTS
     ========================================================= */
  function touch() {
    dirty = true;
    $('saveDot').dataset.state = 'dirty';
    $('saveText').textContent = 'Modifié';
    queueAutosave();
  }
  function onEdit(field, value, heavy) {
    cv[field] = value;
    touch();
    if (heavy) redraw(); else paint();
  }

  // simple fields
  [['fullName', 'input'], ['jobTitle', 'input'], ['phone', 'input'], ['email', 'input'],
   ['location', 'input'], ['linkedin', 'input'], ['licence', 'input'],
   ['birthdate', 'input'], ['age', 'input']].forEach(([id]) => {
    $(id).addEventListener('input', (e) => onEdit(id, e.target.value));
  });
  $('profile').addEventListener('input', (e) => { cv.profile = e.target.value; countProfile(); touch(); paint(); });

  ['showPhone', 'showEmail', 'showLocation', 'showLinkedin', 'showLicence',
   'showBirthdate', 'showPhoto', 'showProfile'].forEach((id) => {
    $(id).addEventListener('change', (e) => onEdit(id, e.target.checked));
  });

  $('modeDateBtn').addEventListener('click', () => { cv.birthdateMode = 'date'; drawBirthMode(); touch(); paint(); });
  $('modeAgeBtn').addEventListener('click', () => { cv.birthdateMode = 'age'; drawBirthMode(); touch(); paint(); });

  // style controls
  $('accentColor').addEventListener('input', (e) => { cv.accentColor = e.target.value; drawSwatches(); touch(); paint(); });
  $('swatches').addEventListener('click', (e) => {
    const b = e.target.closest('.swatch'); if (!b) return;
    cv.accentColor = b.dataset.color; $('accentColor').value = cv.accentColor;
    drawSwatches(); touch(); paint();
  });
  $('fontFamily').addEventListener('change', (e) => onEdit('fontFamily', e.target.value));
  $('textScale').addEventListener('input', (e) => {
    cv.textScale = +e.target.value; $('textScaleOut').textContent = `${cv.textScale} %`; touch(); paint();
  });
  $('density').addEventListener('input', (e) => {
    cv.density = +e.target.value;
    $('densityOut').textContent = cv.density < 95 ? 'Compact' : cv.density > 105 ? 'Aéré' : 'Normal';
    touch(); paint();
  });
  $('sidebarWidth').addEventListener('input', (e) => {
    cv.sidebarWidth = +e.target.value;
    $('sidebarWidthOut').textContent = `${cv.sidebarWidth} % de la largeur de la page`;
    touch(); paint();
  });
  $('photoZoom').addEventListener('input', (e) => {
    cv.photoZoom = +e.target.value; $('photoZoomOut').textContent = `${cv.photoZoom} %`; touch(); paint();
  });

  // section titles + visibility
  ['Experiences', 'Educations', 'Skills', 'Languages', 'Interests'].forEach((K) => {
    const k = K.toLowerCase();
    $('title' + K).addEventListener('input', (e) => { cv.titles[k] = e.target.value; touch(); paint(); });
    $('show' + K).addEventListener('change', (e) => { cv.visible[k] = e.target.checked; touch(); paint(); });
  });

  // photo
  function readPhoto(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => { cv.photo = r.result; touch(); redraw(); };
    r.readAsDataURL(file);
  }
  $('photoInput').addEventListener('change', (e) => readPhoto(e.target.files[0]));
  const drop = $('photoDrop');
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => {
    e.preventDefault(); drop.classList.add('over');
  }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
    e.preventDefault(); drop.classList.remove('over');
  }));
  drop.addEventListener('drop', (e) => readPhoto(e.dataTransfer.files[0]));
  $('removePhotoBtn').addEventListener('click', () => {
    cv.photo = null; $('photoInput').value = ''; touch(); redraw();
  });

  // list mutation (add / move / duplicate / delete)
  const listOf = { exp: 'experiences', edu: 'educations', lang: 'languages', skill: 'skills', interest: 'interests' };
  const blank = {
    exp: () => ({ role: '', company: '', location: '', period: '', description: '' }),
    edu: () => ({ degree: '', school: '', location: '', period: '', description: '' }),
    lang: () => ({ name: '', level: 3 }),
    skill: () => '', interest: () => ''
  };

  $('addExperience').addEventListener('click', () => { cv.experiences.push(blank.exp()); touch(); redraw(); });
  $('addEducation').addEventListener('click', () => { cv.educations.push(blank.edu()); touch(); redraw(); });
  $('addLanguage').addEventListener('click', () => { cv.languages.push(blank.lang()); touch(); redraw(); });
  $('addSkill').addEventListener('click', () => { cv.skills.push(''); touch(); redraw(); });
  $('addInterest').addEventListener('click', () => { cv.interests.push(''); touch(); redraw(); });

  $('railScroll').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]'); if (!btn) return;
    const { act, kind } = btn.dataset;
    const i = +btn.dataset.i;
    const arr = cv[listOf[kind]];
    if (!arr) return;
    if (act === 'del') arr.splice(i, 1);
    else if (act === 'dup') arr.splice(i + 1, 0, JSON.parse(JSON.stringify(arr[i])));
    else if (act === 'up' && i > 0) arr.splice(i - 1, 0, arr.splice(i, 1)[0]);
    else if (act === 'down' && i < arr.length - 1) arr.splice(i + 1, 0, arr.splice(i, 1)[0]);
    touch(); redraw();
  });

  $('railScroll').addEventListener('input', (e) => {
    const holder = e.target.closest('[data-kind][data-i]'); if (!holder) return;
    const k = e.target.dataset.k; if (!k) return;
    const kind = holder.dataset.kind;
    const i = +holder.dataset.i;
    const arr = cv[listOf[kind]];
    if (!arr) return;
    if (kind === 'skill' || kind === 'interest') arr[i] = e.target.value;
    else if (k === 'level') arr[i][k] = +e.target.value;
    else arr[i][k] = e.target.value;
    touch(); paint();
  });
  $('railScroll').addEventListener('change', (e) => {
    if (e.target.dataset.k === 'level') {
      const holder = e.target.closest('[data-kind][data-i]');
      cv[listOf[holder.dataset.kind]][+holder.dataset.i].level = +e.target.value;
      touch(); paint();
    }
  });

  // tabs
  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((x) => {
      x.classList.toggle('active', x === t);
      x.setAttribute('aria-selected', x === t);
    });
    document.querySelectorAll('.tab-panel').forEach((p) =>
      p.classList.toggle('active', p.dataset.panel === t.dataset.tab));
    $('railScroll').scrollTop = 0;
  }));

  // zoom + page rail
  $('zoomIn').addEventListener('click', () => {
    zoom = Math.min((zoom ?? currentScale()) + 0.1, 2); fit();
  });
  $('zoomOut').addEventListener('click', () => {
    zoom = Math.max((zoom ?? currentScale()) - 0.1, 0.2); fit();
  });
  $('fitBtn').addEventListener('click', () => { zoom = null; fit(); });
  function currentScale() {
    const m = /scale\(([\d.]+)\)/.exec(stack.style.transform || '');
    return m ? parseFloat(m[1]) : 1;
  }
  $('pageChips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip'); if (!c) return;
    activePage = +c.dataset.page;
    const sheet = stack.children[activePage];
    if (sheet) canvas.scrollTo({ top: sheet.offsetTop * currentScale() - 20, behavior: 'smooth' });
    document.querySelectorAll('.chip').forEach((x) =>
      x.setAttribute('aria-current', x === c));
  });

  new ResizeObserver(() => { if (zoom === null) fit(); }).observe(canvas);

  /* =========================================================
     PERSISTENCE
     ========================================================= */
  async function apiFetch(url, opts) {
    const res = await fetch(url, opts);
    if (res.status === 401) { window.location.href = '/login.html'; throw new Error('redirect'); }
    return res;
  }

  let toastT = null;
  function toast(msg, ms = 2300) {
    const t = $('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), ms);
  }
  function markClean() {
    dirty = false;
    $('saveDot').dataset.state = 'clean';
    $('saveText').textContent = 'Enregistré';
  }

  let autoT = null;
  function queueAutosave() {
    clearTimeout(autoT);
    autoT = setTimeout(() => save(true), 1100);
  }

  async function save(silent) {
    try {
      const res = await apiFetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv)
      });
      if (!res.ok) throw new Error('Enregistrement refusé par le serveur');
      markClean();
      if (!silent) toast('CV enregistré');
    } catch (err) {
      toast(err.message);
    }
  }

  function hydrate(raw) {
    const base = defaults();
    const merged = { ...base, ...raw };
    merged.titles = { ...base.titles, ...(raw.titles || {}) };
    merged.visible = { ...base.visible, ...(raw.visible || {}) };
    ['languages', 'skills', 'interests', 'experiences', 'educations'].forEach((k) => {
      if (!Array.isArray(merged[k])) merged[k] = base[k];
    });
    return merged;
  }

  async function loadCurrent() {
    const res = await apiFetch(API);
    if (!res.ok) return;
    const data = await res.json();
    cv = hydrate(data.data);
    markClean();
    redraw();
  }

  function newCv() {
    cv = defaults();
    $('photoInput').value = '';
    touch(); redraw();
  }

  // Rendered client-side with html2canvas + jsPDF instead of window.print():
  // the browser's own print pipeline is what stamps a URL/date/page-number
  // strip at the bottom of the page, and no page CSS can turn that off —
  // it's the browser's call, not ours. Rasterizing each .sheet (already
  // laid out at true A4 size, 794×1123px) into its own PDF page sidesteps
  // the print dialog entirely, so there's nothing left to stamp a footer on.
  let exporting = false;
  async function exportPdf() {
    if (exporting) return;
    const sheets = Array.from(stack.querySelectorAll('.sheet'));
    if (!sheets.length) return;
    exporting = true;
    const btn = $('exportBtn');
    btn.disabled = true;
    const prevTransform = stack.style.transform;
    stack.style.transform = 'none';
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
      for (let i = 0; i < sheets.length; i++) {
        // On a flaky connection html2canvas can stall indefinitely trying to
        // re-read an external stylesheet (Google Fonts) for CSSOM access —
        // a hard timeout turns that into a clear failure instead of a dead
        // button with no feedback.
        const canvas = await Promise.race([
          html2canvas(sheets[i], { scale: 2, backgroundColor: '#ffffff', useCORS: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
        ]);
        if (i > 0) pdf.addPage('a4', 'p');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      pdf.save(`${slug(cv.fullName)}.pdf`);
    } catch (err) {
      console.error('export PDF failed', err);
      toast('Échec de la génération du PDF — vérifiez votre connexion et réessayez');
    } finally {
      stack.style.transform = prevTransform;
      btn.disabled = false;
      exporting = false;
    }
  }

  $('saveBtn').addEventListener('click', () => save(false));
  $('newBtn').addEventListener('click', () => {
    if (!confirm('Repartir d\'un CV vierge ? Le contenu actuel sera remplacé (et enregistré automatiquement).')) return;
    newCv();
  });
  $('deleteBtn').addEventListener('click', async () => {
    if (!confirm('Supprimer définitivement ce CV ? Son code PIN redeviendra disponible.')) return;
    const res = await apiFetch(API, { method: 'DELETE' });
    if (res.ok || res.status === 204) window.location.href = '/login.html';
    else toast('Suppression impossible');
  });
  $('exportBtn').addEventListener('click', exportPdf);
  $('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login.html';
  });

  // JSON in / out
  const slug = (s) => (String(s || 'cv').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cv');

  $('exportJsonBtn').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `${slug(cv.fullName)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Fichier JSON téléchargé');
  });
  $('importJsonBtn').addEventListener('click', () => $('importJsonInput').click());
  $('importJsonInput').addEventListener('change', (e) => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      let parsed;
      try { parsed = JSON.parse(r.result); }
      catch { return toast('Ce fichier n\'est pas un JSON valide'); }
      cv = hydrate(parsed);
      touch();
      redraw();
      toast('CV importé — enregistrement automatique en cours');
    };
    r.readAsText(f);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(false); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); exportPdf(); }
  });
  window.addEventListener('beforeunload', (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- go ---------- */
  markClean();
  redraw();
  loadCurrent();
  document.fonts?.ready.then(paint);
  if (sessionStorage.getItem('cv_justCreated')) {
    sessionStorage.removeItem('cv_justCreated');
    toast('Nouveau CV créé pour ce code — gardez-le précieusement');
  }
})();
