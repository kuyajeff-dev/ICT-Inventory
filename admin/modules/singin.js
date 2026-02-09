document.addEventListener('DOMContentLoaded', () => {

  const adminLogin = document.getElementById('adminLogin');
  const loginStep = document.getElementById('loginStep');
  const otpStep = document.getElementById('otpStep');

  const inputEmail = document.getElementById('email');
  const inputPassword = document.getElementById('password');

  const otpInput = document.getElementById('otp');
  const verifyBtn = document.getElementById('verifyOtpBtn');
  const resendBtn = document.getElementById('resendOtpBtn');
  const otpTimer = document.getElementById('otpTimer');
  const otpMessage = document.getElementById('otpMessage');

  let remainingTime = 180;
  let timerInterval;

  const alertMsg = (icon, title, text) => {
    Swal.fire({ icon, title, text });
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async (email, password) => {
    const res = await fetch("/api/admin/adminLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alertMsg("error", "Login Failed", data.message);
      return false;
    }

    Swal.fire({
      icon: "success",
      title: "OTP Sent",
      text: "Check your email",
      timer: 1500,
      showConfirmButton: false
    });

    return true;
  };

  /* ================= LOGIN SUBMIT ================= */
  adminLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
      alertMsg("warning", "Missing Fields", "Fill in all fields");
      return;
    }

    const sent = await sendOtp(email, password);
    if (!sent) return;

    loginStep.classList.add("hidden");
    otpStep.classList.remove("hidden");
    startTimer();
  });

  /* ================= OTP TIMER ================= */
  const startTimer = () => {
    remainingTime = 180;
    resendBtn.classList.add("hidden");

    timerInterval = setInterval(() => {
      const min = Math.floor(remainingTime / 60);
      const sec = remainingTime % 60;

      otpTimer.textContent = `Expires in ${min}:${sec.toString().padStart(2, '0')}`;

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        otpMessage.textContent = "OTP expired";
        resendBtn.classList.remove("hidden");
      }

      remainingTime--;
    }, 1000);
  };

  /* ================= VERIFY OTP ================= */
  verifyBtn.addEventListener('click', async () => {
    const otp = otpInput.value.trim();
    if (!otp) return alertMsg("warning", "Missing OTP", "Enter OTP");

    const res = await fetch("/api/admin/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inputEmail.value, otp })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alertMsg("error", "Invalid OTP", data.message);
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      timer: 1200,
      showConfirmButton: false
    });

    setTimeout(() => {
      window.location.href = "/admin/pages/";
    }, 1200);
  });

  /* ================= RESEND OTP ================= */
  resendBtn.addEventListener('click', async () => {
    await sendOtp(inputEmail.value, inputPassword.value);
    otpMessage.textContent = "";
    startTimer();
  });

});
