import { checkAdminAuth, logout } from './auth.js'; 
import { initNavbar } from './userManagement/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  await checkAdminAuth();

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);

  // DOM Elements
  const inventoryTable = document.getElementById("inventoryTable");
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");

  const mainSelect = document.getElementById("mainSelect");
  const districtGroup = document.getElementById("districtGroup");
  const districtSelect = document.getElementById("districtSelect");
  const schoolGroup = document.getElementById("schoolGroup");
  const schoolSelect = document.getElementById("schoolSelect");
  const ownershipGroup = document.getElementById("ownershipGroup");
  const ownershipSelect = document.getElementById("ownershipSelect");
  const depedGroup = document.getElementById("depedGroup");
  const depedTypeSelect = document.getElementById("depedTypeSelect");
  const programGroup = document.getElementById("programGroup");
  const programSelect = document.getElementById("programSelect");

  const DATA = {
    divisions: ["Division Office"],
    districts: {
      "District 1": ["School A", "School B"],
      "District 2": ["School C", "School D"]
    }
  };

  const OPTIONS = {
    ownership: [
      { value: "", label: "-- Select --" },
      { value: "deped", label: "DepEd" },
      { value: "nondeped", label: "Non-DepEd" },
      { value: "others", label: "Others" }
    ],
    depedType: [
      { value: "", label: "-- Select --" },
      { value: "dcp", label: "DCP" },
      { value: "non-dcp", label: "Non-DCP" }
    ],
    programs: {
      dcp: ["clc", "stv", "lat", "lani", "others"],
      "non-dcp": ["adm", "tvl", "bayanihan", "others"],
      nondeped: ["sef", "others"]
    }
  };

  let assets = [];
  let filteredAssets = [];
  let currentPage = 1;
  const rowsPerPage = 10;

  function renderOptions(select, list) {
    select.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "-- Select --";
    select.appendChild(defaultOpt);

    list.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.value ?? item;
      opt.textContent = item.label ?? item;
      select.appendChild(opt);
    });
  }

  function renderTable(data) {
    inventoryTable.innerHTML = "";
    data.forEach(asset => {
      const tr = document.createElement("tr");
      tr.dataset.owner = asset.owner;
      tr.dataset.depedType = asset.deped_type;
      tr.dataset.program = asset.program;

      tr.innerHTML = `
        <td>${asset.fullname ?? "N/A"}</td>
        <td>${asset.property_no}</td>
        <td>${asset.serial_no}</td>
        <td>${asset.item_name}</td>
        <td>
          <button class="view-btn" data-id="${asset.property_no}">
            View More
          </button>
        </td>
      `;
      inventoryTable.appendChild(tr);
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredAssets.length / rowsPerPage) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function displayPage(page) {
    currentPage = page;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    renderTable(filteredAssets.slice(start, end));
    updatePagination();
  }

  function applySearch() {
    const query = searchInput.value.toLowerCase();

    filteredAssets = assets.filter(asset => {
      const fullname = (asset.fullname ?? "").toLowerCase();
      const property = (asset.property_no ?? "").toLowerCase();
      const serial = (asset.serial_no ?? "").toLowerCase();
      const item = (asset.item_name ?? "").toLowerCase();

      return (
        fullname.includes(query) ||
        property.includes(query) ||
        serial.includes(query) ||
        item.includes(query)
      );
    });

    displayPage(1);
  }

  // SEARCH EVENTS
  searchInput.addEventListener("input", () => {
    clearSearch.style.display = searchInput.value ? "block" : "none";
    applySearch();
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    applySearch();
  });

  // PAGINATION EVENTS
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) displayPage(currentPage - 1);
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredAssets.length / rowsPerPage);
    if (currentPage < totalPages) displayPage(currentPage + 1);
  });

  // FETCH ASSETS
  async function fetchAssets() {
    const res = await fetch("/api/dashboard/assets");
    const data = await res.json();

    if (data.success) {
      assets = data.data;
      filteredAssets = assets;
      displayPage(1);
    }
  }

  // Init dropdowns
  renderOptions(mainSelect, [
    { value: "", label: "-- Select --" },
    { value: "division", label: "Division Office" },
    { value: "school", label: "School" }
  ]);
  renderOptions(depedTypeSelect, OPTIONS.depedType);

  // Events (same as your original logic)
  mainSelect.addEventListener("change", () => {
    districtGroup.classList.add("hidden");
    schoolGroup.classList.add("hidden");
    ownershipGroup.classList.add("hidden");
    depedGroup.classList.add("hidden");
    programGroup.classList.add("hidden");

    if (mainSelect.value === "division") {
      ownershipGroup.classList.remove("hidden");
      renderOptions(ownershipSelect, OPTIONS.ownership);
      return;
    }
    if (mainSelect.value === "school") {
      districtGroup.classList.remove("hidden");
      renderOptions(districtSelect, Object.keys(DATA.districts));
      return;
    }
  });

  districtSelect.addEventListener("change", () => {
    const district = districtSelect.value;
    schoolGroup.classList.remove("hidden");
    renderOptions(schoolSelect, DATA.districts[district]);
  });

  schoolSelect.addEventListener("change", () => {
    ownershipGroup.classList.remove("hidden");
    renderOptions(ownershipSelect, OPTIONS.ownership);
  });

  ownershipSelect.addEventListener("change", () => {
    depedGroup.classList.add("hidden");
    programGroup.classList.add("hidden");
    depedTypeSelect.value = "";
    programSelect.value = "";
    applySearch(); // reset pagination & search

    if (ownershipSelect.value === "deped") {
      depedGroup.classList.remove("hidden");
      return;
    }

    if (ownershipSelect.value === "nondeped") {
      renderOptions(programSelect, OPTIONS.programs.nondeped);
      programGroup.classList.remove("hidden");
      applySearch();
      return;
    }

    if (ownershipSelect.value === "others") {
      applySearch();
    }
  });

  depedTypeSelect.addEventListener("change", () => {
    programGroup.classList.add("hidden");
    programSelect.value = "";
    applySearch();

    const type = depedTypeSelect.value;
    if (!type) return;

    renderOptions(programSelect, OPTIONS.programs[type]);
    programGroup.classList.remove("hidden");
  });

  programSelect.addEventListener("change", () => {
    applySearch();
  });

  // Load data
  await fetchAssets();
});
