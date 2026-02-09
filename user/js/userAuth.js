export async function checkUserAuth() {
  try {
    const res = await fetch('/api/admin/userOnly', { credentials: 'include' });

    if (res.status === 401) {
      window.location.href = '/user/index.html';
      return;
    }
    if (!res.ok) return;

    const user = await res.json();
    const realUser = user.pendingUser ? user : user;

    // NAVBAR
    const navFullname = document.getElementById("navFullname");
    if (navFullname) navFullname.textContent = realUser.fullname;

    const navAvatarImg = document.querySelector("#avatar img");
    if (navAvatarImg) {
      navAvatarImg.src = realUser.avatar
        ? `/uploads/${realUser.avatar}`
        : "/uploads/default-avatar.png";
    }

    // PROFILE AVATAR
    const profileAvatar = document.querySelector(".profile-avatar");
    if (profileAvatar) {
      profileAvatar.src = realUser.avatar
        ? `/uploads/${realUser.avatar}`
        : "/uploads/default-avatar.png";
    }

    // ✅ ADD THESE LINES TO SHOW ROLE & OFFICE
    const profileRole = document.getElementById("profileRole");
    if (profileRole) profileRole.textContent = realUser.position;

    const profileOffice = document.getElementById("profileOffice");
    if (profileOffice) profileOffice.textContent = realUser.office;

    return realUser;

  } catch (err) {
    console.error("Failed to load session info", err);
  }
}

export async function logout() {
    try {
    const res = await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (res.ok) {
      window.location.href = '/user/index.html';
    }
  } catch (err) {
    console.error(err);
  }
}