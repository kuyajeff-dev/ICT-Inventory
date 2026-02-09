import { submitPersonnel } from "./personnelService.js";

export function initPersonnelForm() {
  const form = document.getElementById("personnelForm");
  if (!form) return;

  const fullName = document.getElementById("fullName");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      empId: document.getElementById("empId").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      middleName: document.getElementById("middleName").value.trim(),
      suffix: document.getElementById("suffix").value.trim(),
      sdoOffice: document.getElementById("sdoOffice").value.trim(),
      position: document.getElementById("position").value.trim(),
      oic: document.getElementById("oic").value,
      oicDesignation: document.getElementById("oicDesignation").value.trim(),
      mobileNo: document.getElementById("mobileNo").value.trim(),
      depedEmail: document.getElementById("depedEmail").value.trim(),
      personalEmail: document.getElementById("personalEmail").value.trim(),
      dateHired: document.getElementById("dateHired").value,
    };

    const result = await submitPersonnel(payload);

    if (result.success) {
      Swal.fire("Success", result.message, "success");
      form.reset();
      fullName.value = "";
    } else {
      Swal.fire("Error", result.message, "error");
    }
  });
}
