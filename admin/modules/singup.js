document.addEventListener('DOMContentLoaded', () => {
    const AdminRegister = document.getElementById('AdminRegister');
    if (!AdminRegister) return;

    const avatarInput = document.getElementById('avatar');
    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const locationInput = document.getElementById('location');
    const positionInput = document.getElementById('position');
    const employeeIDInput = document.getElementById('employeeId');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm');
    const messageEl = document.getElementById('registerMessage');

    const showMessage = (el, msg, type = 'red') => {
        el.textContent = msg;
        el.style.color = type === 'red' ? 'red' : 'green';
    };

    AdminRegister.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullname = nameInput.value.trim();
        const email = emailInput.value.trim();
        const employeeId = employeeIDInput.value.trim();
        const position = positionInput.value.trim();
        const location = locationInput.value;
        const password = passwordInput.value.trim();
        const confirm = confirmPasswordInput.value.trim();
        const avatar = avatarInput.files[0];

        if (!fullname || !email || !employeeId || !position || !password || !confirm || !location) {
            return showMessage(messageEl, "All fields are required");
        }

        if (password !== confirm) {
            return showMessage(messageEl, "Passwords do not match");
        }

        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('email', email);
        formData.append('employeeId', employeeId);
        formData.append('position', position);
        formData.append('location', location);
        formData.append('password', password);
        if (avatar) formData.append('avatar', avatar);

        try {
            const res = await fetch("/api/admin/adminRegister", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showMessage(messageEl, data.message || "Registration Successful", 'green');
                setTimeout(() => {
                    window.location.href = "/admin/";
                }, 1000);
            } else {
                showMessage(messageEl, data.message || "Registration Failed");
            }
        } catch (err) {
            console.error(err);
            showMessage(messageEl, "Server error, please try again later");
        }
    });
});
