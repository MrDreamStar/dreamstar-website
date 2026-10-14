(function () {
  var dicts = window.DS;
  var stored = null;
  try { stored = localStorage.getItem("dreamstar.lang"); } catch (error) { stored = null; }
  var lang = stored === "en" ? "en" : "zh";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function text(key) {
    var table = dicts[lang] || dicts.zh;
    return table[key] != null ? table[key] : (dicts.zh[key] || "");
  }

  function apply(fade) {
    if (fade && !reduce) document.body.classList.add("is-fading");
    window.setTimeout(function () {
      document.documentElement.lang = lang === "en" ? "en" : "zh-Hans";
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = text(el.getAttribute("data-i18n"));
      });
      document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
        el.setAttribute("aria-label", text(el.getAttribute("data-i18n-aria")));
      });
      var page = document.body.getAttribute("data-page") || "home";
      document.title = text(page + ".title");
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", text(page + ".desc"));
      var ogTitle = document.querySelector('meta[property="og:title"]');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      var twTitle = document.querySelector('meta[name="twitter:title"]');
      var twDesc = document.querySelector('meta[name="twitter:description"]');
      if (ogTitle) ogTitle.setAttribute("content", text(page + ".title"));
      if (ogDesc) ogDesc.setAttribute("content", text(page + ".desc"));
      if (twTitle) twTitle.setAttribute("content", text(page + ".title"));
      if (twDesc) twDesc.setAttribute("content", text(page + ".desc"));
      var ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.setAttribute("content", lang === "en" ? "en_US" : "zh_CN");
      document.querySelectorAll("[data-lang]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
      });
      document.body.classList.remove("is-fading");
    }, fade && !reduce ? 140 : 0);
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-lang]");
    if (!button) return;
    var next = button.getAttribute("data-lang");
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem("dreamstar.lang", lang); } catch (error) { /* 隐私模式仍可切换这一次 */ }
    apply(true);
  });

  document.querySelectorAll(".faq button").forEach(function (button) {
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      var panel = document.getElementById(button.getAttribute("aria-controls"));
      if (panel) panel.classList.toggle("is-open", !open);
    });
  });

  var orbit = document.getElementById("orbit");
  var desc = document.getElementById("product-desc");
  if (orbit && desc) {
    orbit.addEventListener("click", function (event) {
      var node = event.target.closest("[data-topic]");
      if (!node) return;
      orbit.querySelectorAll("[data-topic]").forEach(function (item) {
        var on = item === node;
        item.classList.toggle("is-selected", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      desc.setAttribute("data-i18n", "topic." + node.getAttribute("data-topic") + ".body");
      desc.textContent = text(desc.getAttribute("data-i18n"));
    });

    var angle = 0;
    var speed = reduce ? 0 : 0.045;
    var target = speed;
    orbit.parentElement.addEventListener("pointerenter", function () { target = 0.012; });
    orbit.parentElement.addEventListener("pointerleave", function () { target = reduce ? 0 : 0.045; });
    var faces = orbit.querySelectorAll(".face");
    function spin() {
      speed += (target - speed) * 0.04;
      if (speed > 0.0001) {
        angle = (angle + speed) % 360;
        orbit.style.transform = "rotate(" + angle + "deg)";
        faces.forEach(function (face) {
          face.style.transform = "rotate(" + (-angle) + "deg)";
        });
      }
      if (!reduce) requestAnimationFrame(spin);
    }
    if (!reduce) requestAnimationFrame(spin);
  }

  var mark = document.getElementById("mark");
  var egg = document.getElementById("egg");
  if (mark && egg) {
    var taps = 0;
    var last = 0;
    var timer = 0;
    mark.addEventListener("click", function () {
      var now = Date.now();
      taps = now - last < 900 ? taps + 1 : 1;
      last = now;
      if (taps < 5) return;
      taps = 0;
      egg.hidden = false;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { egg.hidden = true; }, 3000);
    });
  }

  var theme = document.querySelector('meta[name="theme-color"]');
  var dark = window.matchMedia("(prefers-color-scheme: dark)");
  function paintChrome() {
    if (theme) theme.setAttribute("content", dark.matches ? "#141513" : "#f3f1eb");
  }
  paintChrome();
  dark.addEventListener("change", paintChrome);

  apply(false);
})();
