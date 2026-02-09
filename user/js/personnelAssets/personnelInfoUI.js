export function renderPersonnelInfo(personnel) {
  const container = document.getElementById("personnelInfo");

  if (!container) return;

  if (!personnel) {
    container.textContent = "No personnel info found";
    return;
  }

  container.innerHTML = `
    <p><strong>Name:</strong> ${personnel.full_name || "-"}</p>
    <p><strong>Employee ID:</strong> ${personnel.employee_id || "-"}</p>
    <p><strong>Position:</strong> ${personnel.position || "-"}</p>
    <p><strong>Office:</strong> ${personnel.sdo_office || "-"}</p>
    <p><strong>Email:</strong> ${personnel.deped_email || "-"}</p>
    <p><strong>Mobile:</strong> ${personnel.mobile_no || "-"}</p>
  `;
}
