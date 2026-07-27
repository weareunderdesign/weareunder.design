(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const f = d.getElementsByTagName(s)[0];
  const j = d.createElement(s);
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-54NVWMCH");

(function (d) {
  const s = d.createElement("script");
  s.defer = true;
  s.dataset.domain = "weareunder.design";
  s.src = "https://plausible.io/js/plausible.js";
  d.head.appendChild(s);
})(document);
