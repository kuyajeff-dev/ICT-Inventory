// sample data (replace with API later)
const trackingData = [
  {
    id: "#T001",
    item: "Laptop",
    type: "Repair",
    status: "Pending",
    by: "John Doe",
    date: "2026-01-12"
  },
  {
    id: "#T002",
    item: "Mouse",
    type: "Transfer",
    status: "Approved",
    by: "Jane Smith",
    date: "2026-01-10"
  }
];

// render counts
document.getElementById("repairCount").textContent =
  trackingData.filter(x => x.type === "Repair").length;

document.getElementById("transferCount").textContent =
  trackingData.filter(x => x.type === "Transfer").length;

// render table
const tbody = document.getElementById("trackingBody");
trackingData.forEach(t => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${t.id}</td>
    <td>${t.item}</td>
    <td>${t.type}</td>
    <td>${t.status}</td>
    <td>${t.by}</td>
    <td>${t.date}</td>
  `;

  row.addEventListener("click", () => {
    alert(`Clicked ${t.id}`);
  });

  tbody.appendChild(row);
});
