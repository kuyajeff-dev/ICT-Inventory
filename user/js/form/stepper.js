import { getLabel } from "../form/dom.js";

function generateQRCode(data) {
  const qrContainer = document.getElementById("qrCode");

  qrContainer.innerHTML = ""; // clear previous QR

  new QRCode(qrContainer, {
    text: data || "NO DATA",
    width: 150,
    height: 150,
  });
}

export function initStepper() {
  const steps = document.querySelectorAll(".step");
  const contents = document.querySelectorAll(".step-content");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  let currentStep = 0;

  function renderPreview() {
    const data = new FormData(document.getElementById("trackingForm"));
    let html = "<table>";

    data.forEach((v, k) => {
      if (k === "uom_id") v = getLabel("uom");
      if (k === "brand_id") v = getLabel("brand");
      if (k === "_id") v = getLabel("");
      if (k === "classification_id") v = getLabel("classification");

      html += `<tr><td><strong>${k}</strong></td><td>${v || "—"}</td></tr>`;
    });

    html += "</table>";
    document.getElementById("preview").innerHTML = html;

    const qrData = {
      property_no: document.getElementById("propertyNo").value,
      serial_no: document.getElementById("serialNo").value,
      item: document.getElementById("item").value
    };
    generateQRCode(JSON.stringify(qrData));

  }

  function showStep(index) {
    contents.forEach(c => c.classList.remove("active"));
    steps.forEach(s => s.classList.remove("active"));

    contents[index].classList.add("active");
    steps[index].classList.add("active");

    prevBtn.style.display = index === 0 ? "none" : "inline-block";
    nextBtn.style.display = index === steps.length - 1 ? "none" : "inline-block";
    submitBtn.style.display = index === steps.length - 1 ? "inline-block" : "none";

    if (index === steps.length - 1) renderPreview();
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  showStep(0);

  return { showStep, renderPreview };
}
