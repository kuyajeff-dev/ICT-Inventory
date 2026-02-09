// report.js

// MOCK DATA (replace with API later)
const mockData = [
  { date: "2026-01-01", type: "Transfer", item: "Laptop", qty: 2, status: "Approved" },
  { date: "2026-01-02", type: "Repair", item: "Mouse", qty: 5, status: "Pending" },
  { date: "2026-01-03", type: "Transfer", item: "Keyboard", qty: 1, status: "Approved" },
  { date: "2026-01-04", type: "Repair", item: "Monitor", qty: 1, status: "Completed" },
];

// CARD COUNTS
document.getElementById("totalItems").textContent = 40; // example
document.getElementById("outOfStock").textContent = 5;  // example
document.getElementById("totalTransfers").textContent = 10;
document.getElementById("totalRepairs").textContent = 8;

// CHART 1
const inventoryCtx = document.getElementById("inventoryChart").getContext("2d");
new Chart(inventoryCtx, {
  type: "doughnut",
  data: {
    labels: ["Unserviceable", "Serviceable"],
    datasets: [{
      data: [35, 5],
      backgroundColor: ["#2f67ff", "#ff4d4d"]
    }]
  }
});

// CHART 2
const requestCtx = document.getElementById("requestChart").getContext("2d");
new Chart(requestCtx, {
  type: "bar",
  data: {
    labels: ["Transfer", "Repair"],
    datasets: [{
      label: "Requests",
      data: [10, 8],
      backgroundColor: ["#28a745", "#f59e0b"]
    }]
  }
});

// TABLE RENDER
const reportBody = document.getElementById("reportBody");
mockData.forEach(item => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${item.date}</td>
    <td>${item.type}</td>
    <td>${item.item}</td>
    <td>${item.qty}</td>
    <td>${item.status}</td>
    <td><button class="btn-view">View</button></td>
  `;
  reportBody.appendChild(row);
});

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  reportBody.innerHTML = "";

  mockData
    .filter(x => x.item.toLowerCase().includes(value) || x.type.toLowerCase().includes(value))
    .forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.date}</td>
        <td>${item.type}</td>
        <td>${item.item}</td>
        <td>${item.qty}</td>
        <td>${item.status}</td>
        <td><button class="btn-view">View</button></td>
      `;
      reportBody.appendChild(row);
    });
});
