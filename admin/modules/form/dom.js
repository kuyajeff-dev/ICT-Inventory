export function populateSelect(id, options, placeholder = "-- Select --") {
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML = `<option value="">${placeholder}</option>`;
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = typeof opt === "string" ? opt : opt.value;
    option.textContent = typeof opt === "string" ? opt : opt.label;
    select.appendChild(option);
  });
}

export function getLabel(selectId) {
  const select = document.getElementById(selectId);
  return select?.options[select.selectedIndex]?.text || "";
}
