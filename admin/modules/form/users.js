export async function loadUsers() {
  const res = await fetch("/api/asset/users");
  const users = await res.json();

  return users.map(u => ({
    value: u.fullname,
    label: u.fullname
  }));
}
