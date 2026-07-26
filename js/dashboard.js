/* Dashboard page logic */

function enrolledRowHTML(item) {
  return `
    <a href="course-detail.html?id=${item.id}" class="enrolled-row">
      <div class="enrolled-thumb">${item.thumbnail}</div>
      <div class="enrolled-info">
        <h4>${item.title}</h4>
        <div class="progress-track"><div class="progress-fill" style="width:${item.progress}%"></div></div>
      </div>
      <div class="enrolled-pct">${item.progress}%</div>
    </a>`;
}

async function loadDashboard(user) {
  document.getElementById("welcomeName").textContent = user.name.split(" ")[0];

  const [enrollRes, notesRes] = await Promise.all([
    apiCall("enroll.php"),
    apiCall("notes.php"),
  ]);

  const enrollments = enrollRes.success ? enrollRes.enrollments : [];
  const notes = notesRes.success ? notesRes.notes : [];

  // Stats
  const totalCourses = enrollments.length;
  const avgProgress = totalCourses
    ? Math.round(enrollments.reduce((sum, e) => sum + Number(e.progress), 0) / totalCourses)
    : 0;
  const completedCourses = enrollments.filter((e) => Number(e.progress) >= 100).length;
  const totalNotes = notes.length;

  document.getElementById("statCourses").textContent = totalCourses;
  document.getElementById("statProgress").textContent = avgProgress + "%";
  document.getElementById("statCompleted").textContent = completedCourses;
  document.getElementById("statNotes").textContent = totalNotes;

  // Enrolled courses list
  const list = document.getElementById("enrolledList");
  list.innerHTML = enrollments.length
    ? enrollments.slice(0, 6).map(enrolledRowHTML).join("")
    : `<div class="empty-state">
         <div class="emoji">🎓</div>
         <h3>You haven't enrolled in any courses yet</h3>
         <p>Find a new course and start learning today.</p>
         <a href="courses.html" class="btn btn-primary" style="margin-top:16px">Browse courses</a>
       </div>`;

  // Recent notes
  const notesBox = document.getElementById("recentNotes");
  if (notesBox) {
    notesBox.innerHTML = notes.length
      ? notes
          .slice(0, 4)
          .map(
            (n) => `
        <div class="enrolled-row" style="cursor:default">
          <div class="enrolled-thumb">${n.is_important ? "⭐" : "📝"}</div>
          <div class="enrolled-info">
            <h4>${n.title}</h4>
            <span style="font-size:12px;color:var(--text-muted)">${n.course_title || "General note"}</span>
          </div>
        </div>`
          )
          .join("")
      : `<div class="empty-state" style="padding:30px 20px"><div class="emoji">📓</div><p>No notes yet.</p></div>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("welcomeName")) return;
  const user = await protectPage();
  if (!user) return;
  fillSidebarUser(user);
  loadDashboard(user);
});
