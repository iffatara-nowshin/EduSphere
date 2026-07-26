/* Notes page — students save & manage lesson notes here */

let myEnrollments = [];
let editingNoteId = null;

function noteCardHTML(note) {
  return `
    <div class="note-card ${note.is_important ? "important" : ""}" data-id="${note.id}">
      <div class="note-actions">
        <button data-edit title="Edit">✏️</button>
        <button data-delete title="Delete">🗑️</button>
      </div>
      <h4>${note.is_important ? '<span class="important-star">★</span> ' : ""}${note.title}</h4>
      <p>${note.content || "No details."}</p>
      <span class="note-tag">${note.course_title ? "📘 " + note.course_title : "General note"}</span>
    </div>`;
}

async function loadNotes() {
  const grid = document.getElementById("notesGrid");
  grid.innerHTML = Array.from({ length: 3 }).map(() => `<div class="skeleton" style="height:160px"></div>`).join("");

  const res = await apiCall("notes.php");
  if (!res.success) {
    grid.innerHTML = `<div class="empty-state"><h3>${res.message}</h3></div>`;
    return;
  }

  const notes = res.notes;
  if (!notes.length) {
    grid.innerHTML = `<div class="empty-state">
      <div class="emoji">📓</div>
      <h3>No notes yet</h3>
      <p>Save important points while you study.</p>
    </div>`;
    return;
  }

  grid.innerHTML = notes.map(noteCardHTML).join("");

  grid.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.closest(".note-card").dataset.id;
      const note = notes.find((n) => n.id == id);
      openNoteModal(note);
    })
  );
  grid.querySelectorAll("[data-delete]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = btn.closest(".note-card").dataset.id;
      if (!confirm("Delete this note?")) return;
      const res = await apiCall("notes.php", "DELETE", { id });
      if (res.success) {
        showToast("Note deleted.");
        loadNotes();
      } else {
        showToast(res.message, "error");
      }
    })
  );
}

async function loadCourseOptions() {
  const res = await apiCall("enroll.php");
  const select = document.getElementById("noteCourseSelect");
  if (!res.success || !select) return;
  myEnrollments = res.enrollments;
  select.innerHTML =
    `<option value="">General note (no course)</option>` +
    myEnrollments.map((c) => `<option value="${c.id}">${c.title}</option>`).join("");
}

function openNoteModal(note = null) {
  editingNoteId = note ? note.id : null;
  document.getElementById("modalTitle").textContent = note ? "Edit note" : "Add a new note";
  document.getElementById("noteTitle").value = note ? note.title : "";
  document.getElementById("noteContent").value = note ? note.content : "";
  document.getElementById("noteImportant").checked = note ? !!Number(note.is_important) : false;
  document.getElementById("noteCourseSelect").value = note && note.course_id ? note.course_id : "";
  document.getElementById("noteModalOverlay").classList.add("show");
}

function closeNoteModal() {
  document.getElementById("noteModalOverlay").classList.remove("show");
  editingNoteId = null;
}

async function handleNoteSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  btn.innerHTML = `<span class="spinner"></span> Saving...`;
  btn.disabled = true;

  const payload = {
    title: document.getElementById("noteTitle").value.trim(),
    content: document.getElementById("noteContent").value.trim(),
    is_important: document.getElementById("noteImportant").checked,
    course_id: document.getElementById("noteCourseSelect").value || null,
  };

  let res;
  if (editingNoteId) {
    payload.id = editingNoteId;
    res = await apiCall("notes.php", "PUT", payload);
  } else {
    res = await apiCall("notes.php", "POST", payload);
  }

  if (res.success) {
    showToast(editingNoteId ? "Note updated." : "Note saved!");
    closeNoteModal();
    loadNotes();
  } else {
    showToast(res.message, "error");
  }
  btn.innerHTML = "Save note";
  btn.disabled = false;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("notesGrid")) return;
  const user = await protectPage();
  if (!user) return;
  fillSidebarUser(user);

  loadNotes();
  loadCourseOptions();

  document.getElementById("addNoteBtn").addEventListener("click", () => openNoteModal());
  document.getElementById("noteForm").addEventListener("submit", handleNoteSubmit);
  document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeNoteModal));
});
