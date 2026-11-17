/* ==========================================================================
   MORENA PHATSIMA IT — Community Uplift Local-Only Utilities
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initBanaPeleChecklist();
  initEcaresCalculator();
});

function initBanaPeleChecklist() {
  const container = document.getElementById("banaPeleChecklist");
  if (!container) return;

  const storageKey = "mp_uplift_banapele_v1";
  const checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));
  const countEl = document.getElementById("checklistCount");
  const percentEl = document.getElementById("checklistPercent");
  const barEl = document.getElementById("checklistBar");
  const barWrap = document.getElementById("checklistBarWrap");
  const statusEl = document.getElementById("checklistStatus");
  const copyBtn = document.getElementById("copyChecklistBtn");
  const resetBtn = document.getElementById("resetChecklistBtn");

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) {
      checkboxes.forEach((cb, idx) => {
        cb.checked = Boolean(saved[idx]);
      });
    }
  } catch {}

  const updateProgress = () => {
    const total = checkboxes.length;
    const checked = checkboxes.filter((cb) => cb.checked).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

    if (countEl) countEl.textContent = `${checked} of ${total} items ready`;
    if (percentEl) percentEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
    if (barWrap) barWrap.setAttribute("aria-valuenow", String(pct));

    try {
      localStorage.setItem(storageKey, JSON.stringify(checkboxes.map((cb) => cb.checked)));
    } catch {}
  };

  checkboxes.forEach((cb) => cb.addEventListener("change", updateProgress));
  updateProgress();

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const done = checkboxes.filter((cb) => cb.checked).map((cb) => `- [x] ${cb.dataset.item}`);
      const todo = checkboxes.filter((cb) => !cb.checked).map((cb) => `- [ ] ${cb.dataset.item}`);
      const summary = [
        "Bana Pele ECD Readiness Summary (Morena Phatsima IT Uplift Tool)",
        `Progress: ${done.length}/${checkboxes.length} items ready`,
        "",
        "Completed:",
        ...(done.length ? done : ["- None checked yet"]),
        "",
        "Remaining:",
        ...(todo.length ? todo : ["- All checklist items marked ready"])
      ].join("\n");

      try {
        await navigator.clipboard.writeText(summary);
        if (statusEl) statusEl.textContent = "Checklist summary copied to your clipboard.";
      } catch {
        if (statusEl) statusEl.textContent = "Unable to access clipboard automatically.";
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      checkboxes.forEach((cb) => { cb.checked = false; });
      try { localStorage.removeItem(storageKey); } catch {}
      updateProgress();
      if (statusEl) statusEl.textContent = "All checklist ticks wiped from this device.";
    });
  }
}

function initEcaresCalculator() {
  const inputs = Array.from(document.querySelectorAll(".calc-input"));
  if (!inputs.length) return;

  const csgInput = document.getElementById("csgCount");
  const specialInput = document.getElementById("specialNeedsCount");
  const totalEl = document.getElementById("totalLearners");
  const genderEl = document.getElementById("genderSplit");
  const csgPctEl = document.getElementById("csgPercent");
  const specialEl = document.getElementById("specialNeedsDisplay");
  const copyBtn = document.getElementById("copyCalcBtn");
  const resetBtn = document.getElementById("resetCalcBtn");
  const statusEl = document.getElementById("calcStatus");

  const sanitize = (el) => {
    const val = Math.max(0, parseInt(el?.value || "0", 10) || 0);
    if (el && String(val) !== el.value) el.value = String(val);
    return val;
  };

  const calculate = () => {
    const brackets = ["0-18m", "18m-3y", "3-4y", "4-5y"];
    let totalGirls = 0;
    let totalBoys = 0;

    brackets.forEach((b) => {
      const g = sanitize(document.querySelector(`.calc-input[data-bracket="${b}"][data-gender="girls"]`));
      const boys = sanitize(document.querySelector(`.calc-input[data-bracket="${b}"][data-gender="boys"]`));
      totalGirls += g;
      totalBoys += boys;
      const rowEl = document.getElementById(`rowTotal-${b}`);
      if (rowEl) rowEl.textContent = String(g + boys);
    });

    const grandTotal = totalGirls + totalBoys;
    const csg = Math.min(grandTotal, sanitize(csgInput));
    if (csgInput && sanitize(csgInput) > grandTotal) csgInput.value = String(csg);
    const special = Math.min(grandTotal, sanitize(specialInput));
    if (specialInput && sanitize(specialInput) > grandTotal) specialInput.value = String(special);

    const csgPct = grandTotal > 0 ? Math.round((csg / grandTotal) * 100) : 0;

    if (totalEl) totalEl.textContent = String(grandTotal);
    if (genderEl) genderEl.textContent = `${totalGirls} / ${totalBoys}`;
    if (csgPctEl) csgPctEl.textContent = `${csgPct}%`;
    if (specialEl) specialEl.textContent = String(special);

    return { grandTotal, totalGirls, totalBoys, csg, csgPct, special };
  };

  inputs.forEach((inp) => inp.addEventListener("input", calculate));
  if (csgInput) csgInput.addEventListener("input", calculate);
  if (specialInput) specialInput.addEventListener("input", calculate);
  calculate();

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const data = calculate();
      const getRow = (b) => document.getElementById(`rowTotal-${b}`)?.textContent || "0";
      const report = [
        "eCares Headcount Summary (Morena Phatsima IT Uplift Tool)",
        `Total Enrolled Learners: ${data.grandTotal} (Girls: ${data.totalGirls}, Boys: ${data.totalBoys})`,
        `- Birth to 18 months: ${getRow("0-18m")}`,
        `- 18 months to 3 years: ${getRow("18m-3y")}`,
        `- 3 to 4 years: ${getRow("3-4y")}`,
        `- 4 to 5 years: ${getRow("4-5y")}`,
        `Child Support Grant (CSG) Recipients: ${data.csg} (${data.csgPct}%)`,
        `Learners with Additional Support Needs: ${data.special}`
      ].join("\n");

      try {
        await navigator.clipboard.writeText(report);
        if (statusEl) statusEl.textContent = "eCares headcount summary copied to your clipboard.";
      } catch {
        if (statusEl) statusEl.textContent = "Unable to access clipboard automatically.";
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      inputs.forEach((inp) => { inp.value = "0"; });
      if (csgInput) csgInput.value = "0";
      if (specialInput) specialInput.value = "0";
      calculate();
      if (statusEl) statusEl.textContent = "All calculator fields reset to zero.";
    });
  }
}