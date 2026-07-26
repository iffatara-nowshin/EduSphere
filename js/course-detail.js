/* Course detail page — view lessons, enroll, add lesson (teacher only) */

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");
let currentUser = null;
let currentCourse = null;

/** Convert a normal YouTube/Vimeo URL into an embeddable URL */
function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url; // fall back to raw url (e.g. direct .mp4 file)
  } catch {
    return url;
  }
}

function lessonItemHTML(lesson, index) {
  const hasVideo = !!lesson.video_url;
  return `
    <div class="lesson-item">
      <div class="lesson-num">${index + 1}</div>
      <div style="flex:1">
        <h4>${lesson.title}</h4>
        <p>${lesson.content ? lesson.content.slice(0, 80) : "Details coming soon."}</p>
      </div>
      <div style="display:flex; gap:8px;">
        ${hasVideo ? `<button class="btn btn-primary btn-sm" data-play-video="${lesson.video_url}" data-video-title="${lesson.title.replace(/"/g, '&quot;')}">▶ Watch</button>` : ""}
        <button class="btn btn-ghost btn-sm" data-note-lesson="${lesson.id}" data-note-title="${lesson.title.replace(/"/g, '&quot;')}">📝 Note</button>
      </div>
    </div>`;
}

async function loadCourseDetail() {
  const wrap = document.getElementById("courseDetailWrap");
  if (!courseId) {
    wrap.innerHTML = `<div class="empty-state"><h3>Course ID not found.</h3></div>`;
    return;
  }

  const res = await apiCall(`courses.php?id=${courseId}`);
  if (!res.success) {
    wrap.innerHTML = `<div class="empty-state"><h3>${res.message}</h3></div>`;
    return;
  }

  currentCourse = res.course;
  const c = currentCourse;

  document.getElementById("courseTitle").textContent = c.title;
  document.getElementById("courseDesc").textContent = c.description;
  document.getElementById("courseThumb").textContent = c.thumbnail;
  document.getElementById("courseCategory").textContent = c.category;
  document.getElementById("courseLevel").textContent = c.level;
  document.getElementById("courseTeacher").textContent = "Instructor: " + c.teacher_name;
  document.getElementById("courseDuration").textContent = c.duration || "Flexible";
  document.getElementById("courseStudents").textContent = `${c.students_count} students`;
  document.title = `${c.title} — EduSphere`;

  const lessonList = document.getElementById("lessonList");
  lessonList.innerHTML = c.lessons.length
    ? c.lessons.map(lessonItemHTML).join("")
    : `<div class="empty-state"><div class="emoji">📚</div><p>No lessons added yet.</p></div>`;

  // Attach note buttons
  lessonList.querySelectorAll("[data-note-lesson]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentUser) { window.location.href = "login.html"; return; }
      openNoteModal(btn.dataset.noteLesson, btn.dataset.noteTitle);
    });
  });

  // Attach video play buttons
  lessonList.querySelectorAll("[data-play-video]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openVideoModal(btn.dataset.playVideo, btn.dataset.videoTitle);
    });
  });

  renderEnrollButton();
  renderTeacherPanel();
}

function renderEnrollButton() {
  const box = document.getElementById("enrollBox");
  if (!currentUser) {
    box.innerHTML = `<a href="login.html" class="btn btn-primary btn-block">Log in to enroll</a>`;
    return;
  }
  if (currentUser.role !== "student") {
    box.innerHTML = `<span class="pill" style="display:block;text-align:center">Teacher account</span>`;
    return;
  }
  if (currentCourse.is_enrolled) {
    box.innerHTML = `<button class="btn btn-block" style="background:var(--success-light);color:var(--success)" disabled>✅ Enrolled</button>`;
    return;
  }
  box.innerHTML = `<button id="enrollBtn" class="btn btn-primary btn-block">Enroll in this course</button>`;
  document.getElementById("enrollBtn").addEventListener("click", enrollNow);
}

async function enrollNow() {
  const btn = document.getElementById("enrollBtn");
  btn.innerHTML = `<span class="spinner"></span> Enrolling...`;
  btn.disabled = true;

  const res = await apiCall("enroll.php", "POST", { course_id: courseId });
  if (res.success) {
    showToast(res.message);
    currentCourse.is_enrolled = true;
    renderEnrollButton();
  } else {
    showToast(res.message, "error");
    btn.innerHTML = "Enroll in this course";
    btn.disabled = false;
  }
}

function renderTeacherPanel() {
  const panel = document.getElementById("teacherPanel");
  if (!panel) return;
  const isOwner = currentUser && (currentUser.role === "admin" || currentUser.id === currentCourse.teacher_id);
  panel.style.display = isOwner ? "block" : "none";
}

/* ---------------- Add lesson (teacher) ---------------- */
function initAddLessonForm() {
  const form = document.getElementById("addLessonForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.innerHTML = `<span class="spinner"></span> Adding...`;
    btn.disabled = true;

    const payload = {
      course_id: courseId,
      title: document.getElementById("lessonTitle").value.trim(),
      content: document.getElementById("lessonContent").value.trim(),
      video_url: document.getElementById("lessonVideo").value.trim(),
    };

    const res = await apiCall("lessons.php", "POST", payload);
    if (res.success) {
      showToast("New lesson added!");
      form.reset();
      loadCourseDetail();
    } else {
      showToast(res.message, "error");
    }
    btn.innerHTML = "➕ Add lesson";
    btn.disabled = false;
  });
}

/* ---------------- Video player modal ---------------- */
function openVideoModal(rawUrl, title) {
  const overlay = document.getElementById("videoModalOverlay");
  const frameWrap = document.getElementById("videoFrameWrap");
  const embedUrl = toEmbedUrl(rawUrl);
  document.getElementById("videoModalTitle").textContent = title || "Lesson video";
  frameWrap.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; aspect-ratio:16/9; border-radius:12px;"></iframe>`;
  overlay.classList.add("show");
}

function initVideoModal() {
  const overlay = document.getElementById("videoModalOverlay");
  if (!overlay) return;
  overlay.querySelectorAll("[data-close-modal]").forEach((el) =>
    el.addEventListener("click", () => {
      overlay.classList.remove("show");
      document.getElementById("videoFrameWrap").innerHTML = ""; // stop playback
    })
  );
}

/* ---------------- Quick note modal from lesson ---------------- */
function openNoteModal(lessonId, lessonTitle) {
  const overlay = document.getElementById("quickNoteOverlay");
  document.getElementById("quickNoteLessonId").value = lessonId;
  document.getElementById("quickNoteCourseId").value = courseId;
  document.getElementById("quickNoteTitle").value = lessonTitle + " — notes";
  document.getElementById("quickNoteContent").value = "";
  overlay.classList.add("show");
}

function initQuickNoteModal() {
  const overlay = document.getElementById("quickNoteOverlay");
  if (!overlay) return;
  overlay.querySelectorAll("[data-close-modal]").forEach((el) =>
    el.addEventListener("click", () => overlay.classList.remove("show"))
  );

  document.getElementById("quickNoteForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById("quickNoteTitle").value.trim(),
      content: document.getElementById("quickNoteContent").value.trim(),
      course_id: document.getElementById("quickNoteCourseId").value,
      lesson_id: document.getElementById("quickNoteLessonId").value,
    };
    const res = await apiCall("notes.php", "POST", payload);
    if (res.success) {
      showToast("Note saved!");
      overlay.classList.remove("show");
    } else {
      showToast(res.message, "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("courseDetailWrap")) return;
  const res = await apiCall("me.php");
  currentUser = res.user;
  await initAuthState();
  await loadCourseDetail();
  initAddLessonForm();
  initQuickNoteModal();
  initVideoModal();
});
