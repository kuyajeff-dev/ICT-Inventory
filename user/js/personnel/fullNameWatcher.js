export function initFullNameWatcher() {
  const fullName = document.getElementById("fullName");
  if (!fullName) return;

  const fields = [
    "lastName",
    "firstName",
    "middleName",
    "suffix",
    "empId"
  ];

  fields.forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener("input", updateFullName);
  });

  function updateFullName() {
    const last = document.getElementById("lastName").value.trim();
    const first = document.getElementById("firstName").value.trim();
    const middle = document.getElementById("middleName").value.trim();
    const suffix = document.getElementById("suffix").value.trim();
    const empId = document.getElementById("empId").value.trim();

    const namePart = `${last ? last + "," : ""} ${first} ${middle} ${suffix}`
      .replace(/\s+/g, " ")
      .trim();

    const idPart = empId ? ` - ${empId}` : "";

    fullName.value = namePart + idPart;
  }
}
