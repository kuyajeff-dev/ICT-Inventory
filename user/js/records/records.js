import { checkUserAuth } from "../userAuth.js";
import { bindLogoutButtons } from "../authUI.js";

let dataTable;
let currentUser;

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await checkUserAuth();
  bindLogoutButtons();

  await loadSummaryCards();

  initTabs();
  loadTable("equipment", "");
});

/* ---------------- TAB CONTROLS ---------------- */
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.type;
      const status = btn.dataset.status;

      loadTable(type, status);
    });
  });
}

/* ---------------- LOAD TABLE DYNAMICALLY ---------------- */
async function loadTable(type, status) {

  if ($.fn.DataTable.isDataTable("#recordsTable")) {
    dataTable.destroy();
    $("#recordsTable").empty();
  }

  const columns = type === "equipment"
    ? [
        { title: "Property No.", data: "propertyNo" },
        { title: "Item", data: "item" },

        // ✅ THIS IS THE FIX
        {
          title: "Status",
          data: null,
          render: renderStatusWithCondition
        },

        {
          title: "Action",
          data: null,
          render: row => `
            <button class="btn-update"
              ${row.condition === "unserviceable" ? "disabled" : ""}
              onclick="updateAsset(${row.id})">
              Update
            </button>
          `
        }
      ]
    : [
        { title: "Employee ID", data: "empId" },
        { title: "Name", data: "name" },
        { title: "Status", data: "status" },
        {
          title: "Action",
          data: null,
          render: row => `<button class="btn-update" onclick="updatePersonnel(${row.id})">Update</button>`
        }
      ];

  dataTable = $("#recordsTable").DataTable({
    ajax: {
      url: type === "equipment" ? `/api/records/assets` : `/api/records/personnel`,
      dataSrc: "data",
      data: { status, userId: currentUser.id }
    },
    columns,
    responsive: true,
    pageLength: 10,
  });

  document.getElementById("tableTitle").innerText =
    type === "equipment"
      ? (status ? `📦 ${status.toUpperCase()} Equipment` : "📦 All Equipment")
      : (status ? `👤 ${status.toUpperCase()} Personnel` : "👤 All Personnel");
}

/* ---------------- UPDATE ACTION ---------------- */
window.updateAsset = async function (id) {

  const asset = await fetch(`/api/records/assets/${id}`)
    .then(res => res.json());

  const ownerName = asset.data.ownerName || "Unknown";

  const personnel = await fetch(`/api/records/personnel?userId=${currentUser.id}`)
    .then(res => res.json());

  const userOption = `
    <option value="${currentUser.fullname}">
      ${currentUser.fullname} (You)
    </option>
  `;

  const options = personnel.data
    .map(p => `<option value="${p.name}">${p.name}</option>`)
    .join("");

  const { value: formValues } = await Swal.fire({
    title: "Update Equipment",
    html: `
      <div class="swal-grid">

        <div class="swal-field">
          <label class="swal-label">Owner</label>
          <input class="swal2-input" value="${ownerName}" readonly>
        </div>

        <div class="swal-field">
          <label class="swal-label">Return / Transfer To</label>
          <select id="swal-transfer" class="swal2-select">
            <option value="">Select personnel</option>
            ${userOption}
            ${options}
          </select>
        </div>

        <div class="swal-field">
          <label class="swal-label">Equipment Condition</label>
          <select id="swal-condition" class="swal2-select">
            <option value="">Select condition</option>
            <option value="serviceable">Serviceable</option>
            <option value="for repair">For Repair</option>
            <option value="unserviceable">Unserviceable</option>
            <option value="not applicable">Not Applicable</option>
          </select>
        </div>

        <div class="swal-field">
          <label class="swal-label">Accountability Status</label>
          <select id="swal-status" class="swal2-select">
            <option value="">Select status</option>
            <option value="normal">Normal</option>
            <option value="transfer">Transfer</option>
            <option value="stolen">Stolen</option>
            <option value="lost">Lost</option>
            <option value="damaged due to calamity">Damaged due to calamity</option>
            <option value="for disposal">For Disposal</option>
            <option value="dispose">Dispose</option>
            <option value="donated">Donated</option>
          </select>
        </div>

      </div>
    `,
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const transferTo = document.getElementById("swal-transfer").value;
      const condition = document.getElementById("swal-condition").value;
      const status = document.getElementById("swal-status").value;

      if (!condition || !status) {
        Swal.showValidationMessage("Please complete all required fields.");
        return false;
      }

      if (status === "transfer" && !transferTo) {
        Swal.showValidationMessage("Please select a person to transfer to.");
        return false;
      }

      return { transferTo, condition, status };
    }
  });

  if (!formValues) return;

  await fetch("/api/records/assets/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Number(id),
      ...formValues
    })
  });

  dataTable.ajax.reload();
  Swal.fire("Updated!", "Equipment has been updated.", "success");
};

window.updatePersonnel = function (id) {
  const status = prompt("Enter new status:");

  fetch("/api/records/personnel/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status })
  }).then(() => dataTable.ajax.reload());
};

function renderStatusWithCondition(row) {
  let html = `<span class="badge badge-status">${row.status}</span>`;

  if (row.condition === "return") {
    html += `<br><span class="badge badge-info">RETURN</span>`;
  }
  if (row.condition === "transfer") {
    html += `<br><span class="badge badge-info">RETURN</span>`;
  }
  if (row.condition === "unserviceable") {
    html += `<br><span class="badge badge-danger">UNSERVICEABLE</span>`;
  }

  return html;
}
async function loadSummaryCards() {
  const res = await fetch(`/api/records/assets/summary?userId=${currentUser.id}`);
  const json = await res.json();

  if (!json.success) {
    console.error("Summary fetch error:", json.message || json.error);
    return;
  }

  const data = json.data;

  document.querySelector(".summary-card.return .count").innerText = data.returned || 0;
  document.querySelector(".summary-card.transfer .count").innerText = data.transfer || 0;
  document.querySelector(".summary-card.unserviceable .count").innerText = data.unserviceable || 0;
}

