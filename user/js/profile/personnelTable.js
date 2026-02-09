export function renderPersonnel(personnel = []) {
  const tbody = document.querySelector("#personnelTable tbody");
  tbody.innerHTML = "";

  if (!personnel.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="14" style="text-align:center;">No personnel records</td>
      </tr>
    `;
    return;
  }

  personnel.forEach(p => {
    const tr = document.createElement("tr");

    const oicBadge =
      p.officer_in_charge == 1
        ? `<span class="badge badge-yes">✓</span>`
        : `<span class="badge badge-no"></span>`;

    tr.innerHTML = `
      <td>${p.employee_id || "-"}</td>
      <td>${p.last_name || "-"}</td>
      <td>${p.first_name || "-"}</td>
      <td>${p.middle_name || "-"}</td>
      <td>${p.suffix || "-"}</td>
      <td>${p.full_name || "-"}</td>
      <td>${p.sdo_office || "-"}</td>
      <td>${p.position || "-"}</td>
      <td>${oicBadge}</td>
      <td>${p.oic_designation || "-"}</td>
      <td>${p.mobile_no || "-"}</td>
      <td>${p.deped_email || "-"}</td>
      <td>${p.personal_email || "-"}</td>
      <td>${p.date_hired || "-"}</td>
      <td>
        <button class="view-assets-btn" data-personnel-id="${p.id ?? ""}">
          View Equipment
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll(".view-assets-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.personnelId;
      if (!id) return alert("Personnel record is missing ID");

      window.location.href =
        `/user/pages/personnelAssets.html?personnelId=${id}`;
    });
  });
}
