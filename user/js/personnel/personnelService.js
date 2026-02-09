export async function submitPersonnel(payload) {
  try {
    const res = await fetch("/api/personnel/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Personnel submit failed:", err);
    return {
      success: false,
      message: "Server error"
    };
  }
}
