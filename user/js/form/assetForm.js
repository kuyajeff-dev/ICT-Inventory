export function initAssetForm(adminUserId) {
  const form = document.getElementById("trackingForm");

  const submitForm = async () => {
    const payload = Object.fromEntries(new FormData(form));
    payload.user_id = adminUserId;

    payload.uom_id = Number(payload.uom_id);
    payload.brand_id = Number(payload.brand_id);
    payload.category_id = Number(payload.category_id);
    payload.classification_id = Number(payload.classification_id);

    // Detect user or personnel
    if (payload.accountable_officer?.startsWith("user:")) {
      payload.accountable_officer_user = payload.accountable_officer.split(":")[1];
      delete payload.accountable_officer;
    } else {
      payload.accountable_officer_personnel = payload.accountable_officer?.split(":")[1];
      delete payload.accountable_officer;
    }

    if (payload.received_by?.startsWith("user:")) {
      payload.received_by_user = payload.received_by.split(":")[1];
      delete payload.received_by;
    } else {
      payload.received_by_personnel = payload.received_by?.split(":")[1];
      delete payload.received_by;
    }

    const res = await fetch("/api/asset/userAssets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  };

  // SUBMIT (Step 4 ONLY)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isStep4 = document.querySelector(".step-content[data-step='4']").classList.contains("active");

    if (!isStep4) {
      return Swal.fire({
        title: "Hold on!",
        text: "Please reach Step 4 to submit.",
        icon: "warning",
      });
    }

    try {
      await submitForm();

      Swal.fire({
        title: "Success!",
        text: "Successfully saved.",
        icon: "success",
      }).then(() => {
        form.reset();
        location.reload();
      });

    } catch (err) {
      Swal.fire({
        title: "Failed to save",
        text: err.message,
        icon: "error",
      });
    }
  });
}
