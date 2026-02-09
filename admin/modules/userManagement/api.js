// modules/api.js
export async function fetchUsers() {
  const res = await fetch('/api/admin/users', { credentials: 'include' });
  return res.json();
}

export async function updateUserStatus(employeeId, status) {
  const res = await fetch(`/api/admin/users/${employeeId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    credentials: 'include'
  });

  return res.json();
}

export async function addUser(formData) {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  return res.json();
}
