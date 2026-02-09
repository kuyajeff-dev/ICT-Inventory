export function renderAssets(assets = []) {
  const tbody = document.getElementById("assetsTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!assets.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">
          No assets found
        </td>
      </tr>
    `;
    return;
  }

  assets.forEach(a => {
    tbody.innerHTML += `
      <tr>
        <td>${a.property_no || "-"}</td>
        <td>${a.item_name || "-"}</td>
        <td>${a.brand || "-"}</td>
        <td>${a.model || "-"}</td>
        <td>${a.status || "-"}</td>
        <td>${a.remarks || "-"}</td>
      </tr>
    `;
  });
}
