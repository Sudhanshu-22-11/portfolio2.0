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
    const itemCategory = (filterItems[i].dataset.category || '').toLowerCase();
    if (selectedValue === "all" || selectedValue === itemCategory) {
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