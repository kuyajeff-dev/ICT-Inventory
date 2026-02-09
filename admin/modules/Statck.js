import { checkAdminAuth,logout } from './auth.js'; 
import { initNavbar } from './userManagement/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  await checkAdminAuth();

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);

    const steps = document.querySelectorAll(".step");
    const stepContents = document.querySelectorAll(".step-content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const preview = document.getElementById("preview");

    let currentStep = 0;

    function showStep(index) {
      stepContents.forEach((c) => c.classList.remove("active"));
      steps.forEach((s) => s.classList.remove("active"));
      stepContents[index].classList.add("active");
      steps[index].classList.add("active");

      prevBtn.style.display = index === 0 ? "none" : "inline-block";
      nextBtn.style.display = index === steps.length - 1 ? "none" : "inline-block";
      submitBtn.style.display = index === steps.length - 1 ? "inline-block" : "none";

      if (index === steps.length - 1) renderPreview();
    }

    function renderPreview() {
      const formData = new FormData(document.getElementById("trackingForm"));
      let html = "<table class='preview-table'>";
      formData.forEach((value, key) => {
        html += `<tr><td>${key}</td><td>${value}</td></tr>`;
      });
      html += "</table>";
      preview.innerHTML = html;
    }

    nextBtn.addEventListener("click", () => {
      currentStep++;
      showStep(currentStep);
    });

    prevBtn.addEventListener("click", () => {
      currentStep--;
      showStep(currentStep);
    });

    document.getElementById("trackingForm").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Form submitted successfully!");
    });

    showStep(0);
});