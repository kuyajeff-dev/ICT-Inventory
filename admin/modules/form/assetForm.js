export function initAssetForm(adminUserId) {
  const form = document.getElementById("trackingForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = Object.fromEntries(new FormData(form));
    payload.user_id = adminUserId;

    payload.uom_id = Number(payload.uom_id);
    payload.brand_id = Number(payload.brand_id);
    payload.category_id = Number(payload.category_id);
    payload.classification_id = Number(payload.classification_id);

    try {
      const res = await fetch("/api/asset/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("Asset saved successfully!");
      form.reset();
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save asset: " + err.message);
    }
  });
}
