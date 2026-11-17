/* ==========================================================================
   MORENA PHATSIMA IT — Interactive Conversion & Accessibility Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCopyrightYear();
  initLiveBusinessStatus();
  setInterval(initLiveBusinessStatus, 60000);
  initMobileNavigation();
  initServiceQuickSelect();
  initEnquiryForm();
});

/**
 * 1. Set current year in footer
 */
function initCopyrightYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * 2. Live SAST (Africa/Johannesburg) Operating Hours Indicator
 *    Mon–Fri: 09:00 – 16:30 | Sat: 08:00 – 13:00 | Sun: Closed
 */
function initLiveBusinessStatus() {
  const pill = document.getElementById("liveStatusPill");
  const textEl = document.getElementById("liveStatusText");
  if (!pill || !textEl) return;

  try {
    const now = new Date();
    const sastParts = new Intl.DateTimeFormat("en-ZA", {
      timeZone: "Africa/Johannesburg",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(now);

    const weekday = sastParts.find((p) => p.type === "weekday")?.value;
    const hour = parseInt(sastParts.find((p) => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(sastParts.find((p) => p.type === "minute")?.value || "0", 10);
    const currentMinutes = hour * 60 + minute;

    const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
    const isSaturday = weekday === "Sat";

    let isOpen = false;
    let statusMessage = "Serving Potchefstroom & Surrounding Areas";

    if (isWeekday && currentMinutes >= 9 * 60 && currentMinutes < 16 * 60 + 30) {
      isOpen = true;
      statusMessage = "Available Now (Open until 16:30) \u2022 Potchefstroom";
    } else if (isSaturday && currentMinutes >= 8 * 60 && currentMinutes < 13 * 60) {
      isOpen = true;
      statusMessage = "Available Now (Open until 13:00) \u2022 Potchefstroom";
    } else if (isWeekday && currentMinutes < 9 * 60) {
      statusMessage = "Opens Today at 09:00 \u2022 Serving Potchefstroom";
    } else if (isSaturday && currentMinutes < 8 * 60) {
      statusMessage = "Opens Today at 08:00 \u2022 Serving Potchefstroom";
    } else {
      statusMessage = "Currently Closed (Replies Next Business Day) \u2022 Potchefstroom";
    }

    pill.classList.toggle("is-open", isOpen);
    pill.classList.toggle("is-closed", !isOpen);
    textEl.textContent = statusMessage;
  } catch {
    textEl.textContent = "Serving Potchefstroom & Surrounding Areas";
  }
}

/**
 * 3. Accessible Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (!navToggle || !primaryNav) return;

  const setMenuState = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    primaryNav.classList.toggle("is-open", open);
  };

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
      setMenuState(false);
      navToggle.focus();
    }
  });
}

/**
 * 4. One-Click Service Selection from Problem Cards & Service Buttons
 */
function initServiceQuickSelect() {
  const serviceTriggers = document.querySelectorAll("[data-service]");
  const serviceSelect = document.getElementById("serviceSelect");
  const contactSection = document.getElementById("contact");
  const nameInput = document.getElementById("clientName");

  if (!serviceTriggers.length || !serviceSelect || !contactSection) return;

  serviceTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetService = trigger.getAttribute("data-service");
      if (targetService) {
        const matchingOption = Array.from(serviceSelect.options).find(
          (opt) => opt.value === targetService
        );
        if (matchingOption) {
          serviceSelect.value = targetService;
        }
      }

      contactSection.scrollIntoView({ behavior: "smooth" });
      if (nameInput) {
        setTimeout(() => nameInput.focus({ preventScroll: true }), 450);
      }
    });
  });
}

/**
 * 5. Client-Side Validation & Resilient WhatsApp / Email Enquiry Submission
 */
function initEnquiryForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const whatsappNumber = "27661262587";
  const emailAddress = "phatsima16@gmail.com";

  const fields = {
    name: {
      input: document.getElementById("clientName"),
      error: document.getElementById("errorName"),
      validate: (val) => (val.length >= 2 ? "" : "Please enter your name.")
    },
    area: {
      input: document.getElementById("clientArea"),
      error: document.getElementById("errorArea"),
      validate: (val) => (val.length >= 2 ? "" : "Please enter your suburb or area.")
    },
    details: {
      input: document.getElementById("enquiryDetails"),
      error: document.getElementById("errorDetails"),
      validate: (val) =>
        val.length >= 10
          ? ""
          : "Please provide a brief description (at least 10 characters)."
    }
  };

  Object.values(fields).forEach(({ input, error }) => {
    if (!input || !error) return;
    input.addEventListener("input", () => {
      if (input.classList.contains("has-error")) {
        input.classList.remove("has-error");
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalidInput = null;

    Object.values(fields).forEach(({ input, error, validate }) => {
      if (!input || !error) return;
      const value = input.value.trim();
      const errorMessage = validate(value);

      if (errorMessage) {
        input.classList.add("has-error");
        input.setAttribute("aria-invalid", "true");
        error.textContent = errorMessage;
        if (!firstInvalidInput) firstInvalidInput = input;
      } else {
        input.classList.remove("has-error");
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return;
    }

    const clientName = fields.name.input.value.trim();
    const clientArea = fields.area.input.value.trim();
    const serviceChoice = document.getElementById("serviceSelect")?.value || "General Enquiry";
    const supportType = document.getElementById("supportType")?.value || "Not Specified";
    const enquiryDetails = fields.details.input.value.trim();

    const whatsappMessage = [
      "Hi Morena Phatsima IT,",
      "",
      `*Name:* ${clientName}`,
      `*Area:* ${clientArea}`,
      `*Service:* ${serviceChoice}`,
      `*Assistance Type:* ${supportType}`,
      `*Details:* ${enquiryDetails}`
    ].join("\n");

    const plainMessage = [
      "Hi Morena Phatsima IT,",
      "",
      `Name: ${clientName}`,
      `Area: ${clientArea}`,
      `Service: ${serviceChoice}`,
      `Assistance Type: ${supportType}`,
      `Details: ${enquiryDetails}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const emailSubject = encodeURIComponent(`${serviceChoice} Enquiry - ${clientName} (${clientArea})`);
    const emailBody = encodeURIComponent(plainMessage);
    const mailtoUrl = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    renderEnquiryFallback(form, {
      whatsappUrl,
      mailtoUrl,
      plainMessage,
      popupBlocked: !popup
    });
  });
}

function renderEnquiryFallback(form, { whatsappUrl, mailtoUrl, plainMessage, popupBlocked }) {
  let panel = document.getElementById("enquiryFallback");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "enquiryFallback";
    panel.className = "enquiry-fallback";
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    form.appendChild(panel);
  }

  const heading = popupBlocked
    ? "Your browser blocked the new tab — send your formatted enquiry directly below:"
    : "Enquiry formatted. If WhatsApp did not open, use any direct option below:";

  panel.innerHTML = `
    <p class="fallback-title">${heading}</p>
    <div class="fallback-actions">
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">Open WhatsApp</a>
      <a href="${mailtoUrl}" class="btn btn-outline">Send via Email</a>
      <button type="button" class="btn btn-outline" id="copyEnquiryBtn">Copy Message</button>
    </div>
  `;

  const copyBtn = document.getElementById("copyEnquiryBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(plainMessage);
        copyBtn.textContent = "Copied to Clipboard";
      } catch {
        copyBtn.textContent = "Select & Copy Above";
      }
    });
  }
}