export async function fetchDistricts() {
  const res = await fetch("/api/user/districts", { credentials: "include" });
  return res.json();
}

export async function fetchSchools(districtId) {
  const res = await fetch(`/api/user/schools?district_id=${districtId}`, {
    credentials: "include",
  });
  return res.json();
}

export async function updateLocation(payload) {
  const res = await fetch("/api/user/update-location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return { ok: res.ok, ...data };
}
