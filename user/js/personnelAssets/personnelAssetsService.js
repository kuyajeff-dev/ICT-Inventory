import { renderPersonnelInfo } from "./personnelInfoUI.js";
import { renderAssets } from "./assetsTableUI.js";

export async function loadPersonnelAssets(personnelId) {
  try {
    const res = await fetch(
      `/api/profile/personnel/${personnelId}/assets`,
      { credentials: "include" }
    );

    const { success, assets, personnel } = await res.json();
    if (!success) throw new Error("API failed");

    renderPersonnelInfo(personnel);
    renderAssets(assets);

  } catch (err) {
    console.error(err);
    alert("Failed to load personnel assets");
  }
}
