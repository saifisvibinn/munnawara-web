/** Cinematic intro + logo handoff timing */

export const INTRO_STORAGE_KEY = "munawwara-intro-v4"

export const INTRO_DURATION = {
  settle: 0.55,
  hold: 0.4,
  morph: 0.9,
  siteReveal: 0.65,
  copy: 0.55,
} as const

export const INTRO_EASE = {
  reveal: "power3.out",
  morph: "power3.inOut",
  site: "power2.out",
} as const

export const INTRO_SKY_SRC = "/brand/landing-sky.jpg"

/** Fallback tone while sky image paints / for Lenis gaps during intro */
export const INTRO_COLORS = {
  plate: "#f5aa64",
} as const

/** Pre-paint boot — sky plate + logo; removed only after React logo is live */
export const INTRO_BOOT_SCRIPT = [
  "(function(){try{",
  'var p=location.pathname.replace(/\\/$/, "")||"/";',
  'if(p!=="/"&&p!=="/en"&&p!=="/ar")return;',
  `if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")==="1")return;`,
  'if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;',
  'document.documentElement.setAttribute("data-intro-active","");',
  "var b=document.createElement(\"div\");",
  'b.id="intro-boot";',
  'b.setAttribute("aria-hidden","true");',
  `b.style.cssText="position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;background:${INTRO_COLORS.plate}";`,
  "var s=document.createElement(\"img\");",
  `s.src="${INTRO_SKY_SRC}";`,
  's.alt="";s.decoding="sync";',
  's.style.cssText="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%";',
  "b.appendChild(s);",
  "var veil=document.createElement(\"div\");",
  'veil.style.cssText="position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 42%,rgba(255,248,240,.2),transparent 72%)";',
  "b.appendChild(veil);",
  "var i=document.createElement(\"img\");",
  'i.src="/logo-full.png";i.alt="";i.decoding="sync";',
  'i.style.cssText="position:relative;z-index:1;width:min(78vw,22rem);height:auto";',
  "b.appendChild(i);",
  "document.documentElement.appendChild(b)",
  "}catch(e){}})();",
].join("")
