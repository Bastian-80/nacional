
// ======================================
// CONFIGURACIÓN DE EMAILJS
// ======================================

const PUBLIC_KEY = "Bar1lgeVmtNYUihyT";
const SERVICE_ID = "service_wc82g7g";
const TEMPLATE_ID = "template_qxoxv7i";

document.addEventListener("DOMContentLoaded", () => {

  // Inicializar EmailJS
  const configured = [PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID]
    .every(value => value && !value.startsWith("TU_"));

  if (configured && window.emailjs) {
    emailjs.init({ publicKey: PUBLIC_KEY });
  }

  // ======================================
  // MENÚ PARA CELULARES
  // ======================================

  const menu = document.getElementById("menu");
  const nav = document.getElementById("nav");

  menu?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");

    menu.textContent = opened ? "×" : "☰";
    menu.setAttribute("aria-expanded", String(opened));
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu?.setAttribute("aria-expanded", "false");

      if (menu) {
        menu.textContent = "☰";
      }
    });
  });

  // ======================================
  // LETRAS QUE CAEN DESDE EL CIELO
  // ======================================

  const heroLines = document.querySelectorAll(".hero-title .title-line");

  heroLines.forEach(line => {
    let letterIndex = 0;

    const wrapLetters = node => {
      [...node.childNodes].forEach(child => {

        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();

          [...child.textContent].forEach(char => {

            if (char === " ") {
              fragment.appendChild(document.createTextNode(char));
              return;
            }

            const letter = document.createElement("span");
            letter.className = "fall-letter";
            letter.textContent = char;

            letter.style.setProperty(
              "--letter-delay",
              `${1.62 + letterIndex * 0.045}s`
            );

            letterIndex++;
            fragment.appendChild(letter);
          });

          child.replaceWith(fragment);

        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapLetters(child);
        }

      });
    };

    wrapLetters(line);
  });

  // ======================================
  // PARTÍCULAS VERDES EN EL FONDO
  // ======================================

  const hero = document.querySelector(".hero");

  if (
    hero &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const particleLayer = document.createElement("div");
    particleLayer.className = "particle-layer";
    particleLayer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < 34; i++) {
      const particle = document.createElement("span");

      particle.className = "particle";

      particle.style.left = `${Math.random() * 100}%`;

      particle.style.setProperty(
        "--size",
        `${2 + Math.random() * 4}px`
      );

      particle.style.setProperty(
        "--duration",
        `${7 + Math.random() * 12}s`
      );

      particle.style.setProperty(
        "--delay",
        `${-Math.random() * 16}s`
      );

      particle.style.setProperty(
        "--drift",
        `${-50 + Math.random() * 100}px`
      );

      particleLayer.appendChild(particle);
    }

    hero.appendChild(particleLayer);
  }

  // ======================================
  // ANIMACIONES AL HACER SCROLL
  // ======================================

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.12
    });

    revealItems.forEach(item => {
      observer.observe(item);
    });

  } else {
    revealItems.forEach(item => {
      item.classList.add("visible");
    });
  }

  // ======================================
  // BARRA DE PROGRESO DE LECTURA
  // ======================================

  const progress = document.getElementById("scrollProgress");
  let ticking = false;

  window.addEventListener("scroll", () => {

    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {

      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      progress.style.width =
        `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;

      ticking = false;

    });

  }, { passive: true });

  // ======================================
  // LUZ QUE SIGUE EL CURSOR
  // ======================================

  const glow = document.getElementById("glow");

  window.addEventListener("pointermove", event => {

    if (event.pointerType === "mouse" && glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }

  }, { passive: true });

  // ======================================
  // EFECTO 3D EN TARJETAS Y FORMULARIO
  // ======================================

  document.querySelectorAll(".benefit-card, .signup-panel")
    .forEach(card => {

      card.addEventListener("pointermove", event => {

        if (
          event.pointerType !== "mouse" ||
          window.innerWidth < 900
        ) return;

        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;

        card.style.transform =
          `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;

      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });

    });

  // ======================================
  // VALIDACIÓN VISUAL DEL CORREO
  // ======================================

  const form = document.getElementById("subscribeForm");
  const email = document.getElementById("email");
  const button = document.getElementById("sendButton");
  const message = document.getElementById("message");
  const inputCheck = document.getElementById("inputCheck");

  email?.addEventListener("input", () => {

    inputCheck?.classList.toggle(
      "show",
      email.validity.valid && email.value.trim().length > 0
    );

  });

  // ======================================
  // ENVÍO DEL CORREO CON EMAILJS
  // ======================================

  form?.addEventListener("submit", async event => {

    event.preventDefault();

    const address = email.value.trim();

    if (!email.checkValidity() || !address) {

      message.textContent = "Escribe un correo electrónico válido.";
      message.className = "form-message error";

      email.focus();
      return;
    }

    if (!configured || !window.emailjs) {

      message.textContent =
        "Faltan las credenciales de EmailJS. Configura PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID en js/main.js.";

      message.className = "form-message error";
      return;
    }

    button.disabled = true;

    button.querySelector(".button-label").textContent = "ENVIANDO...";

    message.textContent =
      "Estamos preparando tu bienvenida verdolaga...";

    message.className = "form-message";

    try {

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          email: address,
          to_email: address,
          subscriber_email: address
        }
      );

      message.textContent =
        "¡Listo! Tu suscripción fue recibida. Revisa tu bandeja de entrada. 💚";

      message.className = "form-message success";

      form.reset();
      inputCheck?.classList.remove("show");

    } catch (error) {

      console.error("Error de EmailJS:", error);

      message.textContent =
        "No se pudo enviar. Revisa las credenciales y las variables de tu plantilla EmailJS.";

      message.className = "form-message error";

    } finally {

      button.disabled = false;

      button.querySelector(".button-label").textContent =
        "UNIRME A LA COMUNIDAD";

    }

  });

});
