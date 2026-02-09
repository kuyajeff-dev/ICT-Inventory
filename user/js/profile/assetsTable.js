import { formatDate } from "../utils/formatDate.js";

export function renderAssets(assets = []) {
  const tbody = document.querySelector("#assetsTable tbody");
  tbody.innerHTML = "";

  if (!assets.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="45" style="text-align:center;">No assets found</td>
      </tr>
    `;
    return;
  }

  assets.forEach(asset => {
    tbody.innerHTML += `
      <tr>
        <td>${asset.property_no || "-"}</td>
        <td>${asset.old_property_no || "-"}</td>
        <td>${asset.serial_no || "-"}</td>
        <td>${asset.item_name || "-"}</td>
        <td>${asset.uom || "-"}</td>
        <td>${asset.brand || "-"}</td>
        <td>${asset.model || "-"}</td>
        <td>${asset.specs || "-"}</td>

        <td>${asset.non_dcp ?? "-"}</td>
        <td>${asset.dcp_package || "-"}</td>
        <td>${asset.dcp_year || "-"}</td>

        <td>${asset.category || "-"}</td>
        <td>${asset.classification || "-"}</td>
        <td>${asset.gl_sl || "-"}</td>
        <td>${asset.uacs || "-"}</td>

        <td>${asset.cost
          ? `₱${Number(asset.cost).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          : "-"}</td>

        <td>${formatDate(asset.acquisition_date)}</td>
        <td>${asset.useful_life || "-"}</td>

        <td>${asset.mode || "-"}</td>
        <td>${asset.source || "-"}</td>
        <td>${asset.donor || "-"}</td>
        <td>${asset.source_of_funds || "-"}</td>
        <td>${asset.allotment_class || "-"}</td>
        <td>${asset.pmp_ref_no || "-"}</td>

        <td>${asset.documents || "-"}</td>
        <td>${asset.document_no || "-"}</td>

        <td>${asset.transaction_type || "-"}</td>
        <td>${asset.accountable_officer || "-"}</td>
        <td>${formatDate(asset.date_assigned_accountable)}</td>

        <td>${asset.custodian_end_user || "-"}</td>
        <td>${formatDate(asset.date_assigned_custodian)}</td>

        <td>${asset.received_by || "-"}</td>
        <td>${formatDate(asset.accountability_date_received)}</td>

        <td>${asset.documents_two || "-"}</td>
        <td>${asset.document_no_two || "-"}</td>

        <td>${asset.supplier || "-"}</td>
        <td>${asset.under_warranty ?? "-"}</td>
        <td>${formatDate(asset.end_of_warranty)}</td>

        <td>${asset.location || "-"}</td>
        <td>${asset.non_functional ?? "-"}</td>
        <td>${asset.equipment_condition || "-"}</td>

        <td>${asset.status || "-"}</td>
        <td>${asset.remarks || "-"}</td>
      </tr>
    `;
  });
}
