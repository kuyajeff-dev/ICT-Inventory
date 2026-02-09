// modules/auth.js
export async function checkAdminAuth() {
  try {
    const res = await fetch('/api/admin/onlyAdmins', { credentials: 'include' });

    if (res.status === 401) {
      window.location.href = '/admin/index.html';
      return;
    }

    const user = await res.json();
    document.getElementById('navFullname').textContent = user.fullname;
    document.querySelector('#avatar img').src = user.avatar
      ? `/uploads/${user.avatar}`
      : '/images/default-avatar.png';

    return user;

  } catch (err) {
    console.error(err);
  }
}

export async function logout() {
  try {
    const res = await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (res.ok) {
      window.location.href = '/admin/index.html';
    }
  } catch (err) {
    console.error(err);
  }
}
