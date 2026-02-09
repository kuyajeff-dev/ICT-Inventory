document.addEventListener('DOMContentLoaded', () => {

  const userLogin = document.getElementById('userStep');
  const inputEmail = document.getElementById('email');
  const inputPassword = document.getElementById('password');

  userLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
      return Swal.fire('Warning', 'All fields required', 'warning');
    }

    const response = await fetch('/api/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {

      // CHECK district & school
      if (!data.user.district_id || !data.user.school_id) {
        return Swal.fire({
          title: 'Profile Incomplete',
          text: 'Please select your District and School first.',
          icon: 'warning',
          confirmButtonText: 'Go to Setup'
        }).then(() => {
          window.location.href = "/user/pages/setup-profile.html";
        });
      }

      Swal.fire('Success', data.message || 'Login successful', 'success');
      setTimeout(() => window.location.href = "/user/pages/index.html", 1200);

    } else {
      Swal.fire('Error', data.message || 'Invalid credentials', 'error');
    }
  });
});
