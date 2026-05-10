"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from 'swr';

export default function SubjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editSubject, setEditSubject] = useState(null); 
  const [form, setForm] = useState({ name: "", teacher: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) { router.push("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
  }, []);

  const fetcher = (url) => fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then(res => res.json()).then(data => data.success ? data.data : []);

  const { data: subjects, error: subjectsError, mutate: mutateSubjects } = useSWR(user ? "http://localhost:5000/api/subject" : null, fetcher);
  const { data: teachersData } = useSWR(user ? "http://localhost:5000/api/users" : null, fetcher);
  const teachers = teachersData ? teachersData.filter(u => u.role?.name === "teacher" || u.role === "teacher") : [];

  const loading = !subjects && !subjectsError;

  const openAddForm = () => {
    setEditSubject(null);
    setForm({ name: "", teacher: "" });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (subject) => {
    setEditSubject(subject);
    setForm({
      name: subject.name,
      teacher: subject.teacher?._id || subject.teacher || "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditSubject(null);
    setForm({ name: "", teacher: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.teacher) {
      setError("اسم المادة والمعلم مطلوبان");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const isEdit = !!editSubject;
    try {
      const res = await fetch(
        `http://localhost:5000/api/subject${isEdit ? `/${editSubject._id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      setSuccess(isEdit ? "تم تعديل المادة بنجاح ✅" : "تمت إضافة المادة بنجاح ✅");
      mutateSubjects();
      setTimeout(() => closeForm(), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/subject/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      mutateSubjects(subjects.filter((s) => s._id !== id), false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="subjects-page">
      <div className="subjects-container">

        <div className="subjects-header">
          <div>
            <h1 className="subjects-title">📚 المواد الدراسية</h1>
            <p className="subjects-count">{subjects.length} مادة</p>
          </div>
          {isAdmin && (
            <button onClick={openAddForm} className="subjects-add-btn">
              + إضافة مادة
            </button>
          )}
        </div>

        {error && !showForm && (
          <div className="subjects-error">{error}</div>
        )}

        {showForm && isAdmin && (
          <div className="subjects-overlay" onClick={closeForm}>
            <div className="subjects-modal" onClick={(e) => e.stopPropagation()}>
              <div className="subjects-modal-header">
                <h2 className="subjects-modal-title">
                  {editSubject ? "✏️ تعديل المادة" : "➕ إضافة مادة"}
                </h2>
                <button onClick={closeForm} className="subjects-modal-close">✕</button>
              </div>

              {error && <div className="subjects-error">{error}</div>}
              {success && <div className="subjects-success">{success}</div>}

              <form onSubmit={handleSubmit} className="subjects-form">
                <div className="subjects-field">
                  <label className="subjects-label">اسم المادة</label>
                  <input
                    className="subjects-input"
                    type="text"
                    placeholder="مثال: الرياضيات"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="subjects-field">
                  <label className="subjects-label">المعلم المسؤول</label>
                  <select
                    className="subjects-select"
                    value={form.teacher}
                    onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                  >
                    <option value="">-- اختر المعلم --</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} - {t.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="subjects-form-btns">
                  <button type="button" onClick={closeForm} className="subjects-cancel-btn">
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`subjects-submit-btn ${submitting ? "subjects-submit-btn--loading" : ""}`}
                  >
                    {submitting ? "جاري الحفظ..." : editSubject ? "حفظ التعديل" : "إضافة المادة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        {loading ? (
          <div className="subjects-loading">
            <div className="subjects-spinner" />
            <p>جاري التحميل...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="subjects-empty">
            <div className="subjects-empty-icon">📭</div>
            <p className="subjects-empty-text">لا توجد مواد بعد</p>
            {isAdmin && (
              <button onClick={openAddForm} className="subjects-add-btn">
                أضف أول مادة
              </button>
            )}
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div key={subject._id} className="subjects-card">
                <div className="subjects-card-icon">📖</div>
                <div className="subjects-card-body">
                  <h3 className="subjects-card-name">{subject.name}</h3>
                  <p className="subjects-card-teacher">
                    👨‍🏫 {subject.teacher?.name || "لا يوجد معلم"}
                  </p>
                  <p className="subjects-card-email">
                    {subject.teacher?.email || ""}
                  </p>
                </div>
                {isAdmin && (
                  <div className="subjects-card-actions">
                    <button
                      onClick={() => openEditForm(subject)}
                      className="subjects-edit-btn"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      className="subjects-delete-btn"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}