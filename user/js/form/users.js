export async function loadUsers() {
  const res = await fetch("/api/asset/user");
  const users = await res.json();

  return users.map(u => ({
    value: u.fullname,
    label: u.fullname
  }));
}

export async function loadPersonnel() {
  const res = await fetch("/api/asset/personnel");

  if (!res.ok) {
    throw new Error("Failed to load Personnel");
  }

  const personnel = await res.json();

  const grouped = {};

  personnel.forEach(person => {
    const addedBy = person.added_by || "Unknown";

    if (!grouped[addedBy]) grouped[addedBy] = [];
    grouped[addedBy].push(person);
  });

  const flatList = [];

  Object.entries(grouped).forEach(([addedBy, persons]) => {
    // Add user option (selectable)
    flatList.push({
      value: `user:${addedBy}`,
      label: addedBy
    });

    // Add personnel options (selectable)
    persons.forEach(p => {
      flatList.push({
        value: `person:${p.full_name}`,
        label: p.full_name
      });
    });
  });

  return flatList;
}