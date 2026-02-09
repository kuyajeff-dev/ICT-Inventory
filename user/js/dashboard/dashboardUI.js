export function setWelcomeName(fullname) {
  document.getElementById("welcomeName").textContent = fullname;
}

export function updateStats(data) {
  document.getElementById("personnelTotal").textContent =
    data.personnel.length;

  document.getElementById("equipmentTotal").textContent =
    data.assets.length;

  const totalCost = data.assets.reduce(
    (sum, a) => sum + (Number(a.cost) || 0),
    0
  );

  document.getElementById("totalCost").textContent =
    `₱${totalCost.toLocaleString()}`;
}

export function renderAssetsTable(assets) {
  const tbody = document.getElementById("assetsTableBody");
  tbody.innerHTML = "";

  assets.forEach(asset => {
    tbody.innerHTML += `
      <tr>
        <td>${asset.item_name || "-"}</td>
        <td>${asset.category || "-"}</td>
        <td>${asset.serial_no || "-"}</td>
        <td>${asset.equipment_condition || "-"}</td>
        <td>${asset.location || "-"}</td>
      </tr>
    `;
  });
}
