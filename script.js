/* =========================================================
   JN BEAUTY STUDIO — Extensão e Design de Cílios
   Dados e interações. Edite os arrays abaixo para atualizar
   serviços, galeria e depoimentos sem mexer no HTML/CSS.
   ========================================================= */

/* [EDITAR] Preços de exemplo — ajuste para os valores reais. */
const SERVICES_DATA = [
  {
    name: "Volume Brasileiro",
    desc: "Técnica para quem deseja um efeito realçado e natural.",
    price: "R$ 120 - M: R$90"
  },
  {
    name: "Volume Egípcio",
    desc: "Técnica para quem deseja um olhar mais volumoso.",
    price: "R$ 140 - M: R$105"
  },
  {
    name: "Volume Fox Eyes",
    desc: "Técnica para quem deseja um olhar mais marcante e delineado.",
    price: "R$ 160 - M: R$120"
  },
  {
    name: "Remoção",
    desc: "Retirada segura da extensão com produto próprio, sem danificar o fio natural.",
    price: "R$ 30"
  },
];

/* [EDITAR] Cole aqui o link de cada foto (antes/depois). Deixe "" para manter
   o cartão placeholder enquanto não tiver a foto daquele item ainda. */
const GALLERY_DATA = [
  { img: "https://i.imgur.com/7c9zWd9.jpeg", label: "Antes & depois 01" },
  { img: "https://i.imgur.com/8Ebczm9.jpeg", label: "Antes & depois 02" },
  { img: "https://i.imgur.com/AILjsim.jpeg", label: "Antes & depois 03" },
];

/* ---------- helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- render: serviços ---------- */
function renderServices() {
  const list = $("#servicosList");
  const select = $("#servico");
  if (!list) return;

  SERVICES_DATA.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "servico-row";
    row.setAttribute("data-reveal", "");
    row.style.setProperty("--i", i % 4);
    row.innerHTML = `
      <span class="servico-row__name">${s.name}</span>
      <span class="servico-row__leader"></span>
      <span class="servico-row__meta"><span class="price">${s.price}</span></span>
      <p class="servico-row__desc">${s.desc}</p>
    `;
    row.addEventListener("click", () => row.classList.toggle("is-open"));
    list.appendChild(row);

    if (select) {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = `${s.name} — ${s.price}`;
      select.appendChild(opt);
    }
  });
}

/* ---------- render: galeria ---------- */
function renderGallery() {
  const grid = $("#galeriaGrid");
  if (!grid) return;
  const lashIcon = `<svg viewBox="0 0 100 60" fill="none"><path d="M8 35C25 15 75 15 92 35" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M25 22l-3-8M45 15v-9M65 15l3-9M82 24l5-7" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>`;

  GALLERY_DATA.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "galeria__card";
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--i", i % 3);
    const label = item.label || `Antes & depois ${String(i + 1).padStart(2, "0")}`;
    card.innerHTML = item.img
      ? `<img src="${item.img}" alt="${label}" loading="lazy"><span>${label}</span>`
      : `${lashIcon}<span>${label}</span>`;
    grid.appendChild(card);
  });
}

/* ---------- render: depoimentos ---------- */
function renderTestimonials() {
  const track = $("#depoimentosTrack");
  if (!track) return;
  const items = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];
  track.innerHTML = items
    .map(
      (t) => `
      <div class="quote-card">
        <p>&ldquo;${t.quote}&rdquo;</p>
        <cite>${t.name}</cite>
      </div>`
    )
    .join("");
}

/* ---------- nav: scroll state + mobile toggle ---------- */
function initNav() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  $$(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    })
  );
}

/* ---------- barra de progresso de leitura ---------- */
function initScrollProgress() {
  const bar = $("#scrollProgress");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = `${Math.min(scrolled * 100, 100)}%`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- cursor customizado (desktop, ponteiro fino) ---------- */
function initCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const dot = $("#cursorDot");
  if (!dot) return;
  let x = 0, y = 0, cx = 0, cy = 0;

  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.classList.add("is-active");
  });

  function loop() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  $$("a, button, .servico-row").forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("is-big"));
    el.addEventListener("mouseleave", () => dot.classList.remove("is-big"));
  });
}

/* ---------- revelar ao rolar ---------- */
function initReveal() {
  const targets = $$("[data-reveal]");
  if (!("IntersectionObserver" in window) || !targets.length) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------- formulário -> WhatsApp ---------- */
/* [EDITAR] Troque o número abaixo pelo WhatsApp real do estúdio (código do país + DDD + número, só dígitos). */
const WHATSAPP_NUMBER = "5511937445379";

function initForm() {
  const form = $("#agendaForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#nome").value.trim();
    const servico = $("#servico").value;
    const horario = $("#horario").value.trim();
    const mensagem = $("#mensagem").value.trim();

    let text = `Olá! Meu nome é ${nome} e gostaria de agendar: ${servico}.`;
    if (horario) text += ` Prefiro: ${horario}.`;
    if (mensagem) text += ` Obs: ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderGallery();
  renderTestimonials();
  initNav();
  initScrollProgress();
  initCursor();
  initReveal();
  initForm();
});
