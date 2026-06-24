/* =================================================================
   IFCAR SOLUTIONS — Proposition 3 · interactions éditoriales
   ================================================================= */
(function () {
  "use strict";
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header hide/scroll ---- */
  const header = document.querySelector(".header");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 10);
      const open = document.body.classList.contains("nav-open");
      if (!open && y > 300 && y > lastY + 6) header.classList.add("hidden");
      else if (y < lastY - 6 || y < 300) header.classList.remove("hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const burger = document.querySelector(".burger");
  const mobile = document.querySelector(".mobile");
  const setM = (o) => {
    if (!burger || !mobile) return;
    mobile.classList.toggle("open", o);
    burger.setAttribute("aria-expanded", String(o));
    mobile.setAttribute("aria-hidden", String(!o));
    document.body.classList.toggle("nav-open", o);
    document.body.style.overflow = o ? "hidden" : "";
  };
  if (burger) {
    burger.addEventListener("click", () => setM(burger.getAttribute("aria-expanded") !== "true"));
    mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setM(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setM(false));
    window.addEventListener("resize", () => window.innerWidth > 1040 && setM(false));
  }

  /* ---- Active link ---- */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });

  /* ---- Rotating word ---- */
  const rotor = document.querySelector(".rotor");
  if (rotor && !rm) {
    const words = (rotor.dataset.words || "").split("|").filter(Boolean);
    if (words.length) {
      rotor.innerHTML = "";
      const spans = words.map((w, i) => {
        const s = document.createElement("span");
        s.textContent = w;
        if (i === 0) s.classList.add("in");
        rotor.appendChild(s);
        return s;
      });
      // width sizing to longest word
      let cur = 0;
      setInterval(() => {
        const prev = spans[cur];
        cur = (cur + 1) % spans.length;
        const next = spans[cur];
        prev.classList.remove("in"); prev.classList.add("out");
        next.classList.remove("out"); next.classList.add("in");
        setTimeout(() => prev.classList.remove("out"), 650);
      }, 2200);
    }
  } else if (rotor) {
    const words = (rotor.dataset.words || "").split("|").filter(Boolean);
    rotor.textContent = words[0] || "";
  }

  /* ---- Accordions ---- */
  document.querySelectorAll(".acc").forEach((acc) => {
    const single = acc.dataset.single === "true";
    acc.querySelectorAll(".acc-item").forEach((item) => {
      const head = item.querySelector(".acc-head");
      const body = item.querySelector(".acc-body");
      if (!head) return;
      head.addEventListener("click", () => {
        const open = item.classList.contains("open");
        if (single) acc.querySelectorAll(".acc-item.open").forEach((o) => { o.classList.remove("open"); o.querySelector(".acc-body").style.maxHeight = null; });
        if (open) { item.classList.remove("open"); body.style.maxHeight = null; }
        else { item.classList.add("open"); body.style.maxHeight = body.scrollHeight + "px"; }
      });
    });
  });
  window.addEventListener("resize", () => {
    document.querySelectorAll(".acc-item.open .acc-body").forEach((b) => (b.style.maxHeight = b.scrollHeight + "px"));
  });

  /* ---- Reveal ---- */
  const reveals = document.querySelectorAll(".reveal, .reveal-line");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach((r) => io.observe(r));
  } else reveals.forEach((r) => r.classList.add("in"));

  /* ---- Counters ---- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const run = (el) => {
      const t = parseFloat(el.dataset.count), suf = el.dataset.suffix || "", dur = 1600, s = performance.now();
      const step = (now) => {
        const p = Math.min((now - s) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (Number.isInteger(t) ? Math.round(t * e) : (t * e).toFixed(1)) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---- Parallax ---- */
  if (!rm) {
    const px = document.querySelectorAll("[data-parallax]");
    if (px.length) window.addEventListener("scroll", () => {
      const vy = window.scrollY;
      px.forEach((el) => { const r = el.getBoundingClientRect(); const off = (r.top + r.height / 2 - window.innerHeight / 2); el.style.transform = `translateY(${off * (parseFloat(el.dataset.parallax) || 0.06)}px)`; });
    }, { passive: true });
  }

  /* ---- Forms ---- */
  document.querySelectorAll("form[data-demo]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const m = form.querySelector(".form-msg");
      if (m) { m.textContent = "✓ Merci ! Votre demande a bien été envoyée. Nous revenons vers vous sous 24 h ouvrées."; m.classList.add("ok"); m.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.reset();
    });
  });

  /* ---- Year ---- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
