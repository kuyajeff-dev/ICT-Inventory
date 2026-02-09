import {
  fetchDistricts,
  fetchSchools,
  updateLocation,
} from "./setupService.js";
import { renderDistricts, renderSchools } from "./setupUI.js";

export async function initLocationPage(user) {
  const districtSelect = document.getElementById("district");
  const schoolSelect = document.getElementById("school");
  const saveBtn = document.getElementById("saveBtn");

  const districts = await fetchDistricts();
  renderDistricts(districts);

  districtSelect.addEventListener("change", async () => {
    const districtId = districtSelect.value;
    if (!districtId) return;

    const schools = await fetchSchools(districtId);
    renderSchools(schools);
  });

  saveBtn.addEventListener("click", async () => {
    const districtId = districtSelect.value;
    const schoolId = schoolSelect.value;

    if (!districtId || !schoolId) {
      return Swal.fire("Warning", "Both fields are required", "warning");
    }

    const result = await updateLocation({
      district_id: districtId,
      school_id: schoolId,
      user_id: user.id,
    });

    if (result.ok && result.success) {
      Swal.fire("Success", "Saved", "success").then(() => {
        window.location.href = "/user/pages/index.html";
      });
    } else {
      Swal.fire("Error", result.message || "Failed", "error");
    }
  });
}
