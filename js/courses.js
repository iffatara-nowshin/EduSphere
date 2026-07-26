/* Course listing / search / category filter — used on courses.html */

let allCategories = [];
let activeCategory = "All";
let searchTimer = null;

function courseCardHTML(course) {
  return `
    <a href="course-detail.html?id=${course.id}" class="course-card reveal in-view">
      <div class="course-thumb">
        ${course.thumbnail}
        <span class="course-level">${course.level}</span>
      </div>
      <div class="course-body">
        <span class="course-cat">${course.category}</span>
        <h3>${course.title}</h3>
        <p>${(course.description || "").slice(0, 90)}${course.description && course.description.length > 90 ? "…" : ""}</p>
        <div class="course-meta">
          <span>👨‍🏫 ${course.teacher_name}</span>
          <span>📚 ${course.lessons_count ?? 0} lessons</span>
        </div>
        <div class="course-footer">
          <span class="teacher-tag">👥 ${course.students_count ?? 0} enrolled</span>
          <span class="btn btn-ghost btn-sm">View →</span>
        </div>
      </div>
    </a>`;
}

async function loadCourses(search = "", category = "All") {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 6 }).map(() => `<div class="skeleton"></div>`).join("");

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category && category !== "All") params.append("category", category);

  const res = await apiCall(`courses.php?${params.toString()}`);

  if (!res.success) {
    grid.innerHTML = `<div class="empty-state"><div class="emoji">😕</div><h3>Couldn't load courses</h3><p>${res.message}</p></div>`;
    return;
  }

  const { courses, categories } = res;
  allCategories = categories;
  renderCategoryPills();

  if (!courses.length) {
    grid.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><h3>No courses found</h3><p>Try searching for something else.</p></div>`;
    return;
  }

  grid.innerHTML = courses.map(courseCardHTML).join("");
}

function renderCategoryPills() {
  const row = document.getElementById("categoryPills");
  if (!row) return;
  const cats = ["All", ...allCategories];
  row.innerHTML = cats
    .map(
      (cat) =>
        `<button class="pill ${cat === activeCategory ? "active" : ""}" data-cat="${cat}">${cat === "All" ? "All courses" : cat}</button>`
    )
    .join("");

  row.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCategory = pill.dataset.cat;
      const searchVal = document.getElementById("courseSearch")?.value.trim() || "";
      loadCourses(searchVal, activeCategory);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  loadCourses();

  const searchInput = document.getElementById("courseSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        loadCourses(searchInput.value.trim(), activeCategory);
      }, 350);
    });
  }
});
