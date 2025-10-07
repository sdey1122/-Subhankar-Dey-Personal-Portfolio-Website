// Header Section
document.querySelectorAll("#logo span").forEach((char) => {
  let tween;

  char.addEventListener("mouseenter", () => {
    tween = gsap.to(char, {
      y: -18,
      duration: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });
  });

  char.addEventListener("mouseleave", () => {
    if (tween) tween.kill();
    gsap.to(char, { y: 0, duration: 0.25, ease: "power2.out" });
  });
});

// Scroll Section
const items = document.querySelectorAll(".timeline-item.reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const item = entry.target;
      const typedBlocks = item.querySelectorAll(".typed");

      if (entry.isIntersecting) {
        item.classList.add("in-view");
        typedBlocks.forEach((el) => {
          const text = el.getAttribute("data-typed") || "";
          el.textContent = "";
          el.classList.remove("done");
          typeText(el, text, 14);
        });
      } else {
        item.classList.remove("in-view");
        typedBlocks.forEach((el) => {
          el.textContent = "";
          el.classList.remove("done");
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
);

items.forEach((el) => io.observe(el));
function typeText(node, text, speed = 16) {
  let i = 0;
  if (!text) {
    node.classList.add("done");
    return;
  }
  if (node._timer) clearInterval(node._timer);
  node.textContent = "";
  node._timer = setInterval(() => {
    node.textContent += text.charAt(i++);
    if (i >= text.length) {
      clearInterval(node._timer);
      node.classList.add("done");
    }
  }, speed);
}
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  items.forEach((item) => {
    item.classList.add("in-view");
    item.querySelectorAll(".typed").forEach((el) => {
      el.textContent = el.getAttribute("data-typed") || "";
      el.classList.add("done");
    });
  });
}

// Skills Card Animation
const skillsSection = document.querySelector(".skills");
if (skillsSection) {
  const cards = skillsSection.querySelectorAll(".skill-card");
  const delay = 1000;
  function showCards() {
    cards.forEach(function (card, index) {
      setTimeout(function () {
        card.classList.add("in-view");
      }, index * delay);
    });
  }
  function hideCards() {
    cards.forEach(function (card) {
      card.classList.remove("in-view");
    });
  }
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showCards();
        } else {
          hideCards();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(skillsSection);
}

// Project Swiper
const projSwiper = new Swiper(".projects-swiper", {
  loop: true,
  speed: 1000,
  slidesPerView: 1,
  spaceBetween: 20,
  autoplay: {
    delay: 4000,
    reverseDirection: true,
    disableOnInteraction: false,
  },
  navigation: {
    prevEl: ".projects-swiper .proj-btn.next",
    nextEl: ".projects-swiper .proj-btn.prev",
  },
  pagination: { el: ".projects-swiper .swiper-pagination", clickable: true },
});

// Contact Form Validation + EmailJS
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const emailEl = document.getElementById("cEmail");
  const msgEl = document.getElementById("cMsg");
  const emailErr = document.getElementById("emailErr");
  const msgErr = document.getElementById("msgErr");
  const note = document.getElementById("formNote");
  const sendBtn = document.getElementById("sendBtn");

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    emailErr.textContent = "";
    msgErr.textContent = "";
    note.textContent = "";
    note.style.color = "";

    const email = emailEl.value.trim();
    const message = msgEl.value.trim();
    let valid = true;

    if (!email) {
      emailErr.textContent = "Email is required.";
      valid = false;
    } else if (!isEmail(email)) {
      emailErr.textContent = "Please enter a valid email (example@gmail.com).";
      valid = false;
    }

    if (!message) {
      msgErr.textContent = "Message is required.";
      valid = false;
    } else if (message.length < 10) {
      msgErr.textContent = "Message must be at least 10 characters.";
      valid = false;
    }

    if (!valid) return;

    sendBtn.disabled = true;
    const btnLabel = sendBtn.querySelector("span");
    if (btnLabel) btnLabel.textContent = "Sending…";

    const params = { email, message };

    try {
      await emailjs.send("service_qklr5pf", "template_w0s4kt9", params);
      note.style.color = "lightgreen";
      note.textContent = "Message sent! I'll get back to you soon.";
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      note.style.color = "#ff6b6b";
      note.textContent = "Couldn't send. Please try again later.";
    } finally {
      sendBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = "Submit";
    }
  });
});

// Back to top visibility
const toTopBtn = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (!toTopBtn) return;
  toTopBtn.classList.toggle("show", window.scrollY > 400);
});
if (toTopBtn) {
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
