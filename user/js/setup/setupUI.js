export function renderDistricts(districts) {
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = `<option value="">Select District</option>`;

  districts.forEach((d) => {
    districtSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
}

export function renderSchools(schools) {
  const schoolSelect = document.getElementById("school");
  schoolSelect.innerHTML = `<option value="">Select School</option>`;

  schools.forEach((s) => {
    schoolSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });
}
