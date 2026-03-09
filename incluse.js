/* ============================================================
   include.js — Universal HTML Includes for Static Websites
   Works on Netlify / static hosting (Madawork, MyTeams, etc.)
   Naomi — 2026
   ============================================================ */

(function () {
  "use strict";

  // ===== SETTINGS =====
  const CONFIG = {
    headerTargetId: "site-header",    // <div id="site-header"></div>
    footerTargetId: "site-footer",    // <div id="site-footer"></div>
    headerFile: "header.html",
    footerFile: "footer.html",

    // Floating buttons
    enableFloatingBack: true,
    enableFloatingTop: true,

    // Smooth scroll
    smoothScroll: true,

    // Auto set current year into elements having [data-year]
    enableAutoYear: true,
  };

  // ===== HELPERS =====
  function $(id) {
    return document.getElementById(id);
  }

  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" }); // no-store => update always
    if (!res.ok) throw new Error("Fetch failed: " + url);
    return await res.text();
  }

  async function includeInto(targetId, file) {
    const target = $(targetId);
    if (!target) return false;

    try {
      const html = await fetchText(file);
      target.innerHTML = html;
      return true;
    } catch (e) {
      console.warn("Include error:", file, e);
      // Fallback minimal display
      target.innerHTML = "";
      return false;
    }
  }

  function injectStyleOnce(cssText, id = "includejs-style") {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  function createFloatingButton({ className, html, onClick, href, ariaLabel }) {
    const btn = document.createElement("a");
    btn.className = className;
    btn.innerHTML = html;
    btn.setAttribute("aria-label", ariaLabel || "Button");

    if (href) {
      btn.href = href;
    } else {
      btn.href = "javascript:void(0)";
    }

    btn.addEventListener("click", function (e) {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    });

    document.body.appendChild(btn);
    return btn;
  }

  function setAutoYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach(el => {
      el.textContent = year;
    });
  }

  // ===== FLOATING BUTTONS CSS =====
  const FLOATING_CSS = `
    .float-tool{
      position:fixed;
      z-index:99999;
      right:16px;
      padding:12px 14px;
      border-radius:999px;
      font-weight:1200;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:10px;
      text-decoration:none;
      border:2px solid rgba(255,255,255,.18);
      box-shadow:0 14px 30px rgba(0,0,0,.22);
      transition:.15s ease;
      user-select:none;
      -webkit-tap-highlight-color:transparent;
    }
    .float-tool:hover{ transform:translateY(-1px); }
    .float-tool:active{ transform:scale(.99); }

    .float-back{
      bottom:16px;
      background:#0b1220;
      color:#fff;
    }

    .float-top{
      bottom:74px;
      background:linear-gradient(135deg,#1e90ff,#ff2d55);
      color:#fff;
    }

    @media(max-width:520px){
      .float-tool{ right:12px; }
      .float-back{ bottom:12px; }
      .float-top{ bottom:68px; }
    }
  `;

  // ===== MAIN =====
  document.addEventListener("DOMContentLoaded", async () => {
    // ✅ Inject CSS for floating tools once
    injectStyleOnce(FLOATING_CSS);

    // ✅ Header & Footer includes
    await includeInto(CONFIG.headerTargetId, CONFIG.headerFile);
    await includeInto(CONFIG.footerTargetId, CONFIG.footerFile);

    // ✅ Auto year
    if (CONFIG.enableAutoYear) setAutoYear();

    // ✅ Smooth scroll enabled globally (optional)
    if (CONFIG.smoothScroll) {
      document.documentElement.style.scrollBehavior = "smooth";
    }

    // ✅ Floating back button (history)
    if (CONFIG.enableFloatingBack) {
      createFloatingButton({
        className: "float-tool float-back",
        html: "⬅ Retour",
        ariaLabel: "Retour",
        onClick: () => {
          // If no history, go to index.html
          if (window.history.length > 1) window.history.back();
          else window.location.href = "index.html";
        }
      });
    }

    // ✅ Floating top button
    if (CONFIG.enableFloatingTop) {
      createFloatingButton({
        className: "float-tool float-top",
        html: "⬆ Haut",
        ariaLabel: "Retour en haut",
        onClick: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  });

})();