// retour.js — Bouton Retour flottant au milieu (bottom center)

(function () {
  "use strict";

  // ✅ CSS
  const css = `
    .float-back-center{
      position:fixed;
      left:50%;
      bottom:16px;
      transform:translateX(-50%);
      z-index:999999;

      padding:12px 16px;
      border-radius:999px;
      font-weight:1200;
      font-size:14px;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;

      background:#0b1220;
      color:#fff;
      border:2px solid rgba(255,255,255,.18);
      box-shadow:0 14px 30px rgba(0,0,0,.25);

      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:10px;
      text-decoration:none;

      transition:.15s ease;
      user-select:none;
      -webkit-tap-highlight-color: transparent;
      white-space:nowrap;
    }
    .float-back-center:hover{ transform:translateX(-50%) translateY(-1px); }
    .float-back-center:active{ transform:translateX(-50%) scale(.99); }

    @media(max-width:520px){
      .float-back-center{ bottom:12px; padding:11px 14px; }
    }
  `;

  // ✅ Inject CSS once
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ✅ Create button
  const btn = document.createElement("a");
  btn.className = "float-back-center";
  btn.href = "#";
  btn.innerHTML = "⬅ Retour";
  btn.setAttribute("aria-label", "Retour");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (window.history.length > 1) window.history.back();
    else window.location.href = "index.html";
  });

  document.body.appendChild(btn);
})();