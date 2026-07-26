/* Login & Register page logic */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Role selector (register page) ----------
  const roleOpts = document.querySelectorAll(".role-opt");
  let selectedRole = "student";
  roleOpts.forEach((opt) => {
    opt.addEventListener("click", () => {
      roleOpts.forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedRole = opt.dataset.role;
    });
  });

  // ---------- Login form ----------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errorBox = document.getElementById("formError");
      const btn = loginForm.querySelector("button[type=submit]");
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="spinner"></span> Logging in...`;
      btn.disabled = true;
      errorBox.classList.remove("show");

      const payload = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
      };

      const res = await apiCall("login.php", "POST", payload);

      if (res.success) {
        showToast(res.message || "Logged in successfully!");
        setTimeout(() => (window.location.href = "dashboard.html"), 600);
      } else {
        errorBox.textContent = res.message;
        errorBox.classList.add("show");
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // ---------- Register form ----------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errorBox = document.getElementById("formError");
      const btn = registerForm.querySelector("button[type=submit]");
      const originalText = btn.innerHTML;

      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirmPassword").value;
      if (password !== confirm) {
        errorBox.textContent = "Passwords do not match.";
        errorBox.classList.add("show");
        return;
      }

      btn.innerHTML = `<span class="spinner"></span> Creating account...`;
      btn.disabled = true;
      errorBox.classList.remove("show");

      const payload = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password,
        role: selectedRole,
      };

      const res = await apiCall("register.php", "POST", payload);

      if (res.success) {
        showToast(res.message || "Account created!");
        setTimeout(() => (window.location.href = "dashboard.html"), 600);
      } else {
        errorBox.textContent = res.message;
        errorBox.classList.add("show");
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }
});
