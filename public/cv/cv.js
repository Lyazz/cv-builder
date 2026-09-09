/* =========================================================================
   Yazid AITALLALA — CV page behaviour

   Three jobs:
     1. draw the QR codes from their URLs (so a changed link re-renders),
     2. let the text be edited in place and remember the edits,
     3. hand back a PDF — vector via the print pipeline, or a pixel-exact
        raster built with html2canvas + jsPDF.
   ========================================================================= */
(function () {
  'use strict';

  var STORE_KEY = 'cv.yazid.v1';
  var sheet = document.getElementById('sheet');
  var status = document.getElementById('status');

  /* ------------------------------------------------------------ QR codes */

  // qrcode-generator draws a module grid; we emit it as one SVG path and
  // hand it over as a data URI. That keeps the marks vector-sharp when the
  // page is printed and still rasterises predictably under html2canvas.
  function qrDataUri(text, color, ec) {
    var qr = qrcode(0, ec);             // 0 = pick the smallest version that fits
    qr.addData(text);
    qr.make();

    var n = qr.getModuleCount();
    var d = '';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z';
      }
    }
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" ' +
      'shape-rendering="crispEdges"><path fill="' + color + '" d="' + d + '"/></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function paintQrCodes() {
    Array.prototype.forEach.call(document.querySelectorAll('.qr'), function (box) {
      var url = box.getAttribute('href') || '';
      var color = box.getAttribute('data-color') || '#231f20';
      var ec = box.getAttribute('data-ec') || 'M';
      if (!url) { box.innerHTML = ''; return; }

      var img = box.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.alt = '';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';
        box.appendChild(img);
      }
      img.src = qrDataUri(url, color, ec);

      // the anchor itself carries the link, in the page and in the exported PDF
      box.target = '_blank';
      box.rel = 'noopener';
    });
  }

  /* ----------------------------------------------------- edit + persist */

  function editables() {
    return document.querySelectorAll('.page .t');
  }

  function saveEdits() {
    var out = {};
    Array.prototype.forEach.call(editables(), function (el, i) {
      out[i] = el.innerText;
    });
    try { localStorage.setItem(STORE_KEY, JSON.stringify(out)); } catch (e) { /* private mode */ }
  }

  function loadEdits() {
    var raw;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { return; }
    if (!raw) return;
    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }
    Array.prototype.forEach.call(editables(), function (el, i) {
      if (typeof data[i] === 'string') el.innerText = data[i];
    });
  }

  var editBtn = document.getElementById('editBtn');
  editBtn.addEventListener('click', function () {
    var on = editBtn.getAttribute('aria-pressed') !== 'true';
    editBtn.setAttribute('aria-pressed', String(on));
    document.body.classList.toggle('editing', on);
    Array.prototype.forEach.call(editables(), function (el) {
      if (on) el.setAttribute('contenteditable', 'true');
      else el.removeAttribute('contenteditable');
    });
    say(on ? 'Editing — click any text' : 'A4 · 2 pages');
  });

  sheet.addEventListener('input', function (e) {
    if (e.target.closest('.t')) saveEdits();
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    if (!window.confirm('Discard your edits and restore the original CV?')) return;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    window.location.reload();
  });

  function say(msg) { status.textContent = msg; }

  /* ------------------------------------------------------- PDF: vector */

  document.getElementById('printBtn').addEventListener('click', function () {
    say('Opening the print dialog…');
    // Chrome/Edge: choose "Save as PDF" and untick "Headers and footers"
    // to get the page exactly as it appears here.
    window.print();
    setTimeout(function () { say('A4 · 2 pages'); }, 1500);
  });

  /* -------------------------------------------------------- PDF: raster */

  var SCALE = 3;              // ~225 dpi at A4 — sharp without a huge file
  var PT_W = 595.28, PT_H = 841.89;

  document.getElementById('imageBtn').addEventListener('click', function () {
    var btn = this;
    btn.disabled = true;

    var wasEditing = document.body.classList.contains('editing');
    document.body.classList.remove('editing');

    say('Rendering page 1…');

    document.fonts.ready
      .then(function () {
        var pdf = new window.jspdf.jsPDF({ unit: 'pt', format: [PT_W, PT_H], compress: true });
        var pages = document.querySelectorAll('.page');

        return Array.prototype.reduce.call(pages, function (chain, page, i) {
          return chain.then(function () {
            say('Rendering page ' + (i + 1) + '…');
            return html2canvas(page, {
              scale: SCALE,
              backgroundColor: '#ffffff',
              useCORS: true,
              logging: false,
              imageTimeout: 0
            }).then(function (canvas) {
              if (i > 0) pdf.addPage([PT_W, PT_H]);
              pdf.addImage(canvas.toDataURL('image/jpeg', 0.96), 'JPEG', 0, 0, PT_W, PT_H);
            });
          });
        }, Promise.resolve()).then(function () {
          pdf.save('Yazid-AITALLALA-CV.pdf');
        });
      })
      .then(function () { say('PDF downloaded'); })
      .catch(function (err) {
        console.error(err);
        say('Export failed — try the vector button');
      })
      .then(function () {
        btn.disabled = false;
        if (wasEditing) document.body.classList.add('editing');
        setTimeout(function () { say('A4 · 2 pages'); }, 2500);
      });
  });

  /* ------------------------------------------------------------- start */

  loadEdits();
  paintQrCodes();
})();
