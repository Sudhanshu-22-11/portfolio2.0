'use strict';

// Element toggle helper function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Sidebar variables and mobile toggle
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// Custom select & Filter variables for projects
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const itemCategories = (filterItems[i].dataset.category || '')
      .toLowerCase()
      .split(',')
      .map(s => s.trim());
    if (selectedValue === "all" || itemCategories.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// Select items event
if (selectItems.length > 0) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase().trim();
      if (selectValue) selectValue.innerText = this.innerText;
      if (select) elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

// Filter button items event for desktop
if (filterBtns.length > 0) {
  let lastClickedBtn = filterBtns[0];

  for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase().trim();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

// Page Navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

const switchPage = function (targetPageName) {
  targetPageName = targetPageName.toLowerCase().trim();

  // Handle aliases
  if (targetPageName === "portfolio") targetPageName = "projects";

  for (let i = 0; i < pages.length; i++) {
    const pageName = (pages[i].dataset.page || '').toLowerCase().trim();
    if (pageName === targetPageName) {
      pages[i].classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
      const articleTitle = pages[i].querySelector(".article-title");
      if (articleTitle && typeof runTextScramble === "function") {
        runTextScramble(articleTitle);
      }
    } else {
      pages[i].classList.remove("active");
    }
  }

  for (let i = 0; i < navigationLinks.length; i++) {
    const navTarget = (navigationLinks[i].dataset.navTarget || navigationLinks[i].innerText).toLowerCase().trim();
    if (navTarget === targetPageName) {
      navigationLinks[i].classList.add("active");
    } else {
      navigationLinks[i].classList.remove("active");
    }
  }
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = this.dataset.navTarget || this.innerText;
    switchPage(target);
  });
}

// Any button with [data-nav-target] (e.g. Hero CTA buttons)
const ctaNavButtons = document.querySelectorAll("[data-nav-target]");
for (let i = 0; i < ctaNavButtons.length; i++) {
  ctaNavButtons[i].addEventListener("click", function (e) {
    if (this.tagName.toLowerCase() === 'button') {
      e.preventDefault();
      switchPage(this.dataset.navTarget);
    }
  });
}

// Support hash-based navigation (#projects, #resume, #contact, etc.)
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "").trim();
  if (hash) switchPage(hash);
});
if (window.location.hash) {
  const hash = window.location.hash.replace("#", "").trim();
  if (hash) switchPage(hash);
}

// Certificate Modal Functionality
const certModalContainer = document.querySelector("[data-cert-modal-container]");
const certModalCloseBtn = document.querySelector("[data-cert-modal-close-btn]");
const certOverlay = document.querySelector("[data-cert-overlay]");
const certTriggerBtns = document.querySelectorAll("[data-open-cert-modal]");

const toggleCertModal = function () {
  if (certModalContainer && certOverlay) {
    certModalContainer.classList.toggle("active");
    certOverlay.classList.toggle("active");
  }
}

if (certTriggerBtns.length > 0) {
  certTriggerBtns.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCertModal();
    });
  });
}

if (certModalCloseBtn) certModalCloseBtn.addEventListener("click", toggleCertModal);
if (certOverlay) certOverlay.addEventListener("click", toggleCertModal);

// Generic Testimonials / Card Modal
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

if (modalContainer && modalCloseBtn && overlay) {
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt;
      }
      if (modalTitle && title) modalTitle.innerHTML = title.innerHTML;
      if (modalText && text) modalText.innerHTML = text.innerHTML;

      testimonialsModalFunc();
    });
  }

  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}

// Working Contact Form - genuinely opens user's email client with pre-filled message
const contactForm = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (contactForm && formBtn) {
  // Check form validity on input
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (contactForm.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nameInput = contactForm.querySelector("[name='fullname']");
    const emailInput = contactForm.querySelector("[name='email']");
    const messageInput = contactForm.querySelector("[name='message']");

    const senderName = nameInput ? nameInput.value.trim() : "";
    const senderEmail = emailInput ? emailInput.value.trim() : "";
    const messageBody = messageInput ? messageInput.value.trim() : "";

    const subject = encodeURIComponent(`Portfolio Inquiry from ${senderName}`);
    const body = encodeURIComponent(
      `Hi Sudhanshu,\n\n${messageBody}\n\n---\nFrom: ${senderName}\nEmail: ${senderEmail}`
    );

    // Open user's real email client
    window.location.href = `mailto:anshu402pandey@gmail.com?subject=${subject}&body=${body}`;

    const formFeedback = document.querySelector("[data-form-feedback]");
    if (formFeedback) {
      formFeedback.innerText = "Email client opened! You can review and send your message directly.";
      formFeedback.style.display = "block";
    }
  });
}

// Copy Email Utility Button
const copyEmailBtn = document.querySelector("[data-copy-email-btn]");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", function () {
    const email = "anshu402pandey@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const originalText = copyEmailBtn.innerText;
      copyEmailBtn.innerText = "Copied!";
      setTimeout(() => {
        copyEmailBtn.innerText = originalText;
      }, 2500);
    });
  });
}

// Neumorphic Theme Switcher (Light Neumorphism by default, Dark on toggle)
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeIcon = document.getElementById("theme-icon");

const applyTheme = function (theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (err) {}

  if (themeIcon) {
    if (theme === "dark") {
      themeIcon.setAttribute("name", "sunny-outline");
    } else {
      themeIcon.setAttribute("name", "moon-outline");
    }
  }
};

let storedTheme = "light";
try {
  storedTheme = localStorage.getItem("portfolio-theme") || "light";
} catch (err) {}
applyTheme(storedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
}

// -----------------------------------------------------------------------------
// Interactive Location Map Controller (GPS & Landmark Switcher)
// -----------------------------------------------------------------------------
const mapIframe = document.querySelector("[data-map-iframe]");
const locationStatus = document.querySelector("[data-location-status]");
const mapActionBtns = document.querySelectorAll("[data-map-target]");
const mapExternalLink = document.querySelector("[data-map-link]");

if (mapIframe && mapActionBtns.length > 0) {
  const mapLocations = {
    college: {
      embed: "https://maps.google.com/maps?q=PES+Institute+of+Technology+and+Management,+Shivamogga,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed",
      external: "https://maps.google.com/?q=PES+Institute+of+Technology+and+Management,+Shivamogga",
      label: "Current Base: <strong>PES Institute of Technology & Management (PESITM)</strong>, Shivamogga"
    },
    city: {
      embed: "https://maps.google.com/maps?q=Shivamogga,+Karnataka,+India&t=&z=13&ie=UTF8&iwloc=&output=embed",
      external: "https://maps.google.com/?q=Shivamogga,+Karnataka,+India",
      label: "Region: <strong>Shivamogga City Center</strong>, Karnataka, India"
    }
  };

  mapActionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const target = this.getAttribute("data-map-target");

      if (target === "gps") {
        if (!navigator.geolocation) {
          if (locationStatus) {
            locationStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Geolocation is not supported by your browser.</span>';
          }
          return;
        }

        const btnSpan = this.querySelector("span");
        const originalText = btnSpan ? btnSpan.innerText : "Detect Live GPS";
        if (btnSpan) btnSpan.innerText = "Locating GPS...";
        if (locationStatus) {
          locationStatus.innerHTML = '<span style="color:var(--neu-accent);">📡 Requesting browser GPS permission...</span>';
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = Math.round(position.coords.accuracy);

            mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
            if (mapExternalLink) {
              mapExternalLink.href = `https://maps.google.com/?q=${lat},${lng}`;
            }

            if (locationStatus) {
              locationStatus.innerHTML = `📍 Live GPS Detected: <strong>${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</strong> (±${accuracy}m accuracy)`;
            }

            mapActionBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            if (btnSpan) btnSpan.innerText = "📍 GPS Active";
          },
          (error) => {
            if (btnSpan) btnSpan.innerText = originalText;
            let errorMsg = "Unable to retrieve location.";
            if (error.code === error.PERMISSION_DENIED) {
              errorMsg = "Location permission denied. Please allow location access in your browser.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              errorMsg = "Location information is unavailable.";
            } else if (error.code === error.TIMEOUT) {
              errorMsg = "Request to get location timed out.";
            }
            if (locationStatus) {
              locationStatus.innerHTML = `<span style="color:#ef4444;">⚠️ ${errorMsg}</span>`;
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else if (mapLocations[target]) {
        mapActionBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const gpsBtnSpan = document.querySelector("[data-map-target='gps'] span");
        if (gpsBtnSpan) gpsBtnSpan.innerText = "Detect Live GPS";

        mapIframe.src = mapLocations[target].embed;
        if (mapExternalLink) {
          mapExternalLink.href = mapLocations[target].external;
        }
        if (locationStatus) {
          locationStatus.innerHTML = mapLocations[target].label;
        }
      }
    });
  });
}

/**
 * Interactive Micro-Animations Suite
 * 1. Typewriter / Rotating Role Animator
 * 2. 3D Card Tilt on Cursor Hover
 * 3. Staggered Scroll-Reveal Observer
 */

// 1. Dynamic Rotating Role Animator
(function initTypingRoles() {
  const roleEl = document.querySelector(".typing-role-text");
  if (!roleEl) return;

  let roles = [
    "B.E. Data Science Student",
    "Python Developer",
    "AI & Machine Learning Explorer",
    "Full-Stack Web Developer"
  ];

  try {
    const customRoles = JSON.parse(roleEl.dataset.roles || "[]");
    if (customRoles.length > 0) roles = customRoles;
  } catch (e) {}

  let roleIdx = 0;
  let charIdx = roles[0].length;
  let isDeleting = true;
  const typeSpeed = 55;
  const deleteSpeed = 30;
  const pauseEnd = 2200;
  const pauseStart = 400;

  // Set initial text immediately
  roleEl.textContent = roles[0];

  function tick() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      roleEl.textContent = currentRole.substring(0, charIdx);
    } else {
      charIdx++;
      roleEl.textContent = currentRole.substring(0, charIdx);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(tick, delay);
  }

  // Start deleting after initial reading pause
  setTimeout(tick, pauseEnd);
})();

// 2. Smooth 3D Cursor Tilt with Holographic Specular Glare
(function initTiltCard() {
  const tiltCards = document.querySelectorAll("[data-tilt-card]");
  if (!tiltCards.length) return;

  tiltCards.forEach((tiltCard) => {
    let bounds;

    function updateBounds() {
      bounds = tiltCard.getBoundingClientRect();
    }

    tiltCard.addEventListener("mouseenter", () => {
      updateBounds();
      if (tiltCard.classList.contains("hero-avatar-frame")) {
        tiltCard.style.animationPlayState = "paused";
      }
    });

    tiltCard.addEventListener("mousemove", (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
      const yPct = (mouseY / bounds.height - 0.5) * 2; // -1 to 1

      const isAvatar = tiltCard.classList.contains("hero-avatar-frame");
      const maxTilt = isAvatar ? 8 : 5;
      const scale = isAvatar ? 1.02 : 1.015;

      const rotateX = -yPct * maxTilt;
      const rotateY = xPct * maxTilt;

      tiltCard.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
      tiltCard.style.setProperty("--glare-x", `${mouseX}px`);
      tiltCard.style.setProperty("--glare-y", `${mouseY}px`);
      tiltCard.style.setProperty("--glare-opacity", "1");
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "";
      tiltCard.style.setProperty("--glare-opacity", "0");
      if (tiltCard.classList.contains("hero-avatar-frame")) {
        tiltCard.style.animationPlayState = "running";
      }
    });

    window.addEventListener("resize", updateBounds);
  });
})();

// 3. Staggered Scroll-Reveal Observer
(function initScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal-item");
  if (!revealItems.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-revealed"));
  }
})();

// 4. Laser Neon Scroll-Progress Bar
(function initScrollProgressBar() {
  const scrollFill = document.getElementById("scroll-progress-fill");
  if (!scrollFill) return;

  function updateScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
})();

// 5. Scroll-Triggered Animated Metrics Counters
(function initMetricsCounters() {
  const counters = document.querySelectorAll("[data-counter-target]");
  if (!counters.length) return;

  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-counter-target"), 10) || 0;
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(ease * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach((c) => observer.observe(c));
  } else {
    counters.forEach((c) => animateCount(c));
  }
})();

// 6. Futuristic Cyber Text Scramble / Decrypt Animation
function runTextScramble(el) {
  if (!el || el.dataset.scrambling === "true") return;
  el.dataset.scrambling = "true";

  const originalText = el.dataset.originalText || el.textContent.trim();
  el.dataset.originalText = originalText;

  const glyphs = "!<>-_\\/[]{}—=+*^?#________01";
  let step = 0;
  const totalSteps = originalText.length * 2.4;

  function tick() {
    let output = "";
    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === " ") {
        output += " ";
        continue;
      }
      if (step > i * 2) {
        output += originalText[i];
      } else {
        output += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
    }
    el.textContent = output;
    step++;

    if (step <= totalSteps) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = originalText;
      el.dataset.scrambling = "false";
    }
  }
  requestAnimationFrame(tick);
}

// Scramble initial page title on load
window.addEventListener("DOMContentLoaded", () => {
  const activeTitle = document.querySelector(".about.active .article-title");
  if (activeTitle) runTextScramble(activeTitle);
});

// 7. Command Palette System (Cmd + K / Ctrl + K)
(function initCommandPalette() {
  const modal = document.getElementById("cmd-palette-modal");
  const overlay = document.getElementById("cmd-palette-overlay");
  const input = document.getElementById("cmd-search-input");
  const resultsContainer = document.getElementById("cmd-palette-results");
  const triggerBtn = document.getElementById("cmd-palette-btn");

  if (!modal || !input || !resultsContainer) return;

  const commands = [
    // Navigation Pages
    { group: "Navigation", title: "About Me", desc: "Background, specialization & focus", icon: "person-outline", action: () => switchPage("about") },
    { group: "Navigation", title: "Resume & Skills", desc: "Education, technical competencies & timeline", icon: "document-text-outline", action: () => switchPage("resume") },
    { group: "Navigation", title: "Projects Showcase", desc: "ANKUR 3D, FoodWise, ResQ-AI & SIH", icon: "folder-outline", action: () => switchPage("projects") },
    { group: "Navigation", title: "Achievements & Awards", desc: "1st Prize Pitching, SIH 2026, Hack Malenadu", icon: "trophy-outline", action: () => switchPage("achievements") },
    { group: "Navigation", title: "Contact & Coordinates", desc: "Email, location map & message composer", icon: "mail-outline", action: () => switchPage("contact") },

    // Featured Projects
    { group: "Projects", title: "ANKUR — 3D Car Showroom", desc: "Real-time Porsche 911 WebGL experience (Three.js & R3F)", icon: "cube-outline", action: () => window.open("https://3dwebiste.vercel.app/", "_blank") },
    { group: "Projects", title: "AURUM — LUMIÈRE Jewellery", desc: "Luxury handcrafted jewelry store & collection", icon: "diamond-outline", action: () => window.open("https://aurum-jewellery-2026.netlify.app", "_blank") },
    { group: "Projects", title: "FoodWise Platform", desc: "Smart India Hackathon surplus food redistribution", icon: "restaurant-outline", action: () => window.open("https://food-wise-puce.vercel.app", "_blank") },
    { group: "Projects", title: "ResQ-AI Emergency Assistant", desc: "Multilingual AI triage PWA & offline decision trees", icon: "medkit-outline", action: () => window.open("https://github.com/Sudhanshu-22-11/ResQ-AI", "_blank") },
    { group: "Projects", title: "Exam Guardrail", desc: "Integrity-first online monitoring system", icon: "shield-checkmark-outline", action: () => window.open("https://github.com/Sudhanshu-22-11/Exam-Guardrail", "_blank") },
    { group: "Projects", title: "Unified Tribal Scholarship", desc: "MoTA national scholarship orchestration portal prototype", icon: "school-outline", action: () => window.open("https://github.com/Sudhanshu-22-11/sih-unified-tribal-scholarship", "_blank") },

    // Actions & Tools
    { group: "Quick Actions", title: "Download Official Resume (PDF)", desc: "Open ATS-ready printable resume modal", icon: "arrow-down-circle-outline", action: () => openResumeModal() },
    { group: "Quick Actions", title: "Open Developer CLI Terminal", desc: "Launch interactive geek terminal", icon: "terminal-outline", action: () => openDeveloperTerminal() },
    { group: "Quick Actions", title: "Toggle Dark / Light Theme", desc: "Switch neumorphic surface lighting", icon: "contrast-outline", action: () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "light" ? "dark" : "light");
    }},
    { group: "Quick Actions", title: "Copy Email to Clipboard", desc: "anshu402pandey@gmail.com", icon: "copy-outline", action: () => {
      navigator.clipboard.writeText("anshu402pandey@gmail.com");
      alert("Email copied: anshu402pandey@gmail.com");
    }},
    { group: "Social & External", title: "Visit GitHub Profile", desc: "github.com/Sudhanshu-22-11", icon: "logo-github", action: () => window.open("https://github.com/Sudhanshu-22-11", "_blank") },
    { group: "Social & External", title: "Visit LinkedIn Profile", desc: "Connect with Sudhanshu Kumar Pandey", icon: "logo-linkedin", action: () => window.open("https://www.linkedin.com/in/sudhanshu-kumar-pandey-b52652381", "_blank") }
  ];

  let selectedIndex = 0;
  let filteredCommands = [];

  function openPalette() {
    modal.classList.add("active");
    input.value = "";
    renderResults("");
    setTimeout(() => input.focus(), 80);
  }

  function closePalette() {
    modal.classList.remove("active");
  }

  function renderResults(query) {
    query = query.toLowerCase().trim();
    filteredCommands = commands.filter((cmd) => {
      return (
        cmd.title.toLowerCase().includes(query) ||
        cmd.desc.toLowerCase().includes(query) ||
        cmd.group.toLowerCase().includes(query)
      );
    });

    resultsContainer.innerHTML = "";
    if (filteredCommands.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 25px; color: var(--neu-text-muted); font-size: 13px;">
          No matching commands found for "<strong>${query}</strong>"
        </div>
      `;
      return;
    }

    let currentGroup = "";
    selectedIndex = 0;

    filteredCommands.forEach((cmd, idx) => {
      if (cmd.group !== currentGroup) {
        currentGroup = cmd.group;
        const groupEl = document.createElement("div");
        groupEl.className = "cmd-group-label";
        groupEl.textContent = currentGroup;
        resultsContainer.appendChild(groupEl);
      }

      const itemEl = document.createElement("div");
      itemEl.className = `cmd-item ${idx === 0 ? "active" : ""}`;
      itemEl.dataset.index = idx;
      itemEl.innerHTML = `
        <div class="cmd-item-left">
          <div class="cmd-item-icon">
            <ion-icon name="${cmd.icon}"></ion-icon>
          </div>
          <div>
            <div class="cmd-item-title">${cmd.title}</div>
            <div class="cmd-item-subtitle">${cmd.desc}</div>
          </div>
        </div>
        <span class="cmd-badge-tag">${cmd.group}</span>
      `;

      itemEl.addEventListener("click", () => {
        closePalette();
        cmd.action();
      });

      resultsContainer.appendChild(itemEl);
    });
  }

  function updateActiveItem(newIndex) {
    const items = resultsContainer.querySelectorAll(".cmd-item");
    if (!items.length) return;
    items.forEach((item) => item.classList.remove("active"));
    selectedIndex = (newIndex + items.length) % items.length;
    const activeItem = items[selectedIndex];
    if (activeItem) {
      activeItem.classList.add("active");
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }

  input.addEventListener("input", (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      updateActiveItem(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      updateActiveItem(selectedIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        closePalette();
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("active")) {
        closePalette();
      } else {
        openPalette();
      }
    }
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closePalette();
    }
  });

  if (triggerBtn) triggerBtn.addEventListener("click", openPalette);
  if (overlay) overlay.addEventListener("click", closePalette);
})();

// 8. Official Resume Preview & PDF Export Modal System
function openResumeModal() {
  const modal = document.getElementById("resume-modal");
  if (modal) modal.classList.add("active");
}

function closeResumeModal() {
  const modal = document.getElementById("resume-modal");
  if (modal) modal.classList.remove("active");
}

(function initResumeModal() {
  const openBtns = document.querySelectorAll("[data-open-resume-modal]");
  const closeBtn = document.getElementById("resume-modal-close");
  const overlay = document.getElementById("resume-modal-overlay");
  const printBtn = document.getElementById("btn-print-resume");

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeResumeModal);
  if (overlay) overlay.addEventListener("click", closeResumeModal);

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeResumeModal();
  });
})();

// 9. Interactive Developer CLI Terminal System (Easter Egg)
function openDeveloperTerminal() {
  const modal = document.getElementById("dev-terminal");
  const input = document.getElementById("terminal-input");
  if (modal) {
    modal.classList.add("active");
    if (input) setTimeout(() => input.focus(), 100);
  }
}

function closeDeveloperTerminal() {
  const modal = document.getElementById("dev-terminal");
  if (modal) modal.classList.remove("active");
}

(function initDeveloperTerminal() {
  const toggleBtn = document.getElementById("dev-terminal-toggle");
  const modal = document.getElementById("dev-terminal");
  const closeBtn = document.getElementById("term-close-btn");
  const minBtn = document.getElementById("term-min-btn");
  const maxBtn = document.getElementById("term-max-btn");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  if (!modal || !input || !output) return;

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (modal.classList.contains("active")) {
        closeDeveloperTerminal();
      } else {
        openDeveloperTerminal();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeDeveloperTerminal);
  if (minBtn) closeBtn.addEventListener("click", closeDeveloperTerminal);

  if (maxBtn) {
    maxBtn.addEventListener("click", () => {
      modal.classList.toggle("term-fullscreen");
    });
  }

  const history = [];
  let historyIdx = -1;

  function printLine(html) {
    const line = document.createElement("div");
    line.className = "term-line";
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    printLine(`<span class="term-prompt">sudhanshu@dev:~$</span> <span class="term-cyan">${cmdRaw}</span>`);

    if (!cmd) return;
    history.push(cmdRaw);
    historyIdx = history.length;

    switch (cmd) {
      case "help":
        printLine(`
          <span class="term-yellow">AVAILABLE TERMINAL COMMANDS:</span><br>
          • <span class="term-green">about</span>     : Background, education & focus<br>
          • <span class="term-green">skills</span>    : Technical competencies breakdown<br>
          • <span class="term-green">projects</span>  : List verified engineering projects<br>
          • <span class="term-green">awards</span>    : Hackathon honors & national accolades<br>
          • <span class="term-green">resume</span>    : Open printable ATS-ready CV<br>
          • <span class="term-green">contact</span>   : Direct email & communication links<br>
          • <span class="term-green">matrix</span>    : Trigger cyber digital rain stream<br>
          • <span class="term-green">theme</span>     : Toggle dark / light neumorphism<br>
          • <span class="term-green">clear</span>     : Wipe terminal output<br>
          • <span class="term-green">exit</span>      : Close this terminal session
        `);
        break;

      case "about":
        printLine(`
          <strong>Sudhanshu Kumar Pandey</strong><br>
          🎓 2nd Year B.E. in Data Science at PESITM Shivamogga, Karnataka.<br>
          💻 Passionate about Python, Web Development, Three.js, and AI Systems.<br>
          🏆 Best Pitching Award Winner (Team Anvay) & SIH National Finalist.
        `);
        break;

      case "skills":
        printLine(`
          <span class="term-cyan">LANGUAGES:</span> Python, JavaScript, C, HTML5, CSS3, SQL<br>
          <span class="term-cyan">DATA & ML:</span> Pandas, NumPy, Matplotlib, Scikit-Learn Basics<br>
          <span class="term-cyan">WEB & 3D:</span> Semantic HTML5, CSS3 Neumorphism, Three.js (WebGL), React<br>
          <span class="term-cyan">TOOLS:</span> Git, GitHub, Linux Shell, VS Code, Vercel
        `);
        break;

      case "projects":
        printLine(`
          1. <span class="term-yellow">ANKUR — 3D Car Showroom:</span> <a href="https://3dwebiste.vercel.app/" target="_blank" style="color:#00f0ff;text-decoration:underline;">Live Demo</a> (Three.js & R3F)<br>
          2. <span class="term-yellow">FoodWise Platform:</span> <a href="https://food-wise-puce.vercel.app" target="_blank" style="color:#00f0ff;text-decoration:underline;">Live Demo</a> (Next.js & SIH)<br>
          3. <span class="term-yellow">ResQ-AI Emergency Assistant:</span> <a href="https://github.com/Sudhanshu-22-11/ResQ-AI" target="_blank" style="color:#00f0ff;text-decoration:underline;">GitHub</a> (React 19 & Groq)<br>
          4. <span class="term-yellow">AURUM Jewellery:</span> <a href="https://aurum-jewellery-2026.netlify.app" target="_blank" style="color:#00f0ff;text-decoration:underline;">Live Store</a> (HTML/CSS/JS)<br>
          5. <span class="term-yellow">Unified Tribal Scholarship:</span> <a href="https://github.com/Sudhanshu-22-11/sih-unified-tribal-scholarship" target="_blank" style="color:#00f0ff;text-decoration:underline;">SIH Prototype</a>
        `);
        break;

      case "awards":
        printLine(`
          🏆 <span class="term-yellow">1st Prize:</span> Best Pitching Award — Team Anvay (National Innovation Challenge)<br>
          🎖️ <span class="term-cyan">Finalist:</span> Smart India Hackathon (SIH 2026) for Ministry of Tribal Affairs<br>
          ⚡ <span class="term-green">Competitor:</span> Hack Malenadu 24H National Sprint & Hack Fest 1.0<br>
          📜 <span class="term-pink">Certified:</span> AI Fluency for Students by Anthropic & Partner Universities
        `);
        break;

      case "resume":
      case "cv":
        printLine(`<span class="term-green">Opening official resume modal...</span>`);
        openResumeModal();
        break;

      case "contact":
        printLine(`
          📧 Email: <a href="mailto:anshu402pandey@gmail.com" style="color:#00f0ff;">anshu402pandey@gmail.com</a><br>
          🐙 GitHub: <a href="https://github.com/Sudhanshu-22-11" target="_blank" style="color:#00f0ff;">github.com/Sudhanshu-22-11</a><br>
          💼 LinkedIn: <a href="https://www.linkedin.com/in/sudhanshu-kumar-pandey-b52652381" target="_blank" style="color:#00f0ff;">linkedin.com/in/sudhanshu-kumar-pandey</a><br>
          📍 Location: Shivamogga, Karnataka, India
        `);
        break;

      case "theme":
        const curTheme = document.documentElement.getAttribute("data-theme") || "light";
        const nxt = curTheme === "light" ? "dark" : "light";
        applyTheme(nxt);
        printLine(`Switched theme to <span class="term-green">${nxt}</span>.`);
        break;

      case "clear":
      case "cls":
        output.innerHTML = "";
        break;

      case "matrix":
        printLine(`<span class="term-green">Initializing Matrix digital data stream...</span>`);
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            const row = Array.from({ length: 38 }, () => Math.random() > 0.5 ? "1" : "0").join(" ");
            printLine(`<span class="term-green" style="font-size:10px;opacity:0.85;">${row}</span>`);
          }, i * 140);
        }
        break;

      case "exit":
      case "quit":
        printLine(`Closing session... Goodbye!`);
        setTimeout(closeDeveloperTerminal, 400);
        break;

      default:
        printLine(`<span style="color:#ef4444;">command not found: ${cmd}</span>. Type <span class="term-yellow">'help'</span> for list.`);
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      handleCommand(val);
    } else if (e.key === "ArrowUp") {
      if (history.length > 0 && historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === "ArrowDown") {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = "";
      }
    }
  });
})();