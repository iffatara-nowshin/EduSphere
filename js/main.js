/* =========================================================
   Shared utilities used across every page
   ========================================================= */

const API_BASE = "api"; // relative path to the /api folder

/** Generic fetch wrapper that always sends/receives JSON + session cookie */
async function apiCall(endpoint, method = "GET", body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, opts);
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: "Could not connect to the server. Make sure you're running this through Apache/PHP, not a static file server." };
  }
}

/** Toast notifications */
function showToast(message, type = "success") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.innerHTML = `<span>${type === "error" ? "⚠️" : "✅"}</span><span>${message}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all .3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/** Mobile nav toggle (public pages) */
function initNavToggle() {
  const btn = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => links.classList.toggle("open"));
  }
}

/** Mobile sidebar toggle (dashboard pages) */
function initSidebarToggle() {
  const btn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (btn && sidebar) {
    btn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    });
  }
}

/** Scroll-reveal animation using IntersectionObserver */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => obs.observe(el));
}

/** Fill navbar / sidebar user info if logged in, otherwise show login/register */
async function initAuthState() {
  const res = await apiCall("me.php");
  const user = res.data ? res.data.user : res.user;
  const authArea = document.querySelector("[data-auth-area]");
  if (!authArea) return user;

  if (user) {
    authArea.innerHTML = `
      <a href="dashboard.html" class="user-chip">
        <span class="user-avatar">${user.name.charAt(0).toUpperCase()}</span>
        <span>${user.name.split(" ")[0]}</span>
      </a>`;
  } else {
    authArea.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Log in</a>
      <a href="register.html" class="btn btn-primary btn-sm">Get started</a>`;
  }
  return user;
}

/** Protect dashboard-only pages; redirect to login if not authenticated */
async function protectPage() {
  const res = await apiCall("me.php");
  const user = res.user;
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function fillSidebarUser(user) {
  const box = document.querySelector("[data-sidebar-user]");
  if (box && user) {
    box.innerHTML = `
      <span class="user-avatar">${user.name.charAt(0).toUpperCase()}</span>
      <div>
        <b>${user.name}</b>
        <span>${user.role === "teacher" ? "Teacher" : user.role === "admin" ? "Admin" : "Student"}</span>
      </div>`;
  }
}

async function handleLogout() {
  await apiCall("logout.php", "POST");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initSidebarToggle();
  initScrollReveal();

  const logoutBtn = document.querySelector("[data-logout]");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
});
