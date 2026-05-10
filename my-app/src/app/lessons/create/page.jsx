"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/api";
import { toast } from "react-hot-toast";
import { ArrowLeft, BookPlus, Save } from "lucide-react";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

const CreateLessonPage = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    classId: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [lessonFile, setLessonFile] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [subRes, classRes] = await Promise.all([
          api.get("/subject"),
          api.get("/classes"),
        ]);
        setSubjects(subRes.data.subject || subRes.data.data || subRes.data.subjects || []);
        setClasses(classRes.data.classes || classRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load options");
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const teacherId = localStorage.getItem("userId");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("subjectId", formData.subjectId);
      data.append("classId", formData.classId);
      data.append("teacherId", teacherId);
      if (videoFile) data.append("video", videoFile);
      if (lessonFile) data.append("file", lessonFile);

      await api.post("/lessons", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson created successfully!");
      router.push("/lessons");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: "700px" }}>
        <Link
          href="/lessons"
          className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="fw-medium">Back to Lessons</span>
        </Link>

        <div className="card shadow-sm border-0 rounded-4 bg-white">
          <div className="card-header bg-white border-0 pt-4 px-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <BookPlus size={26} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Create New Lesson</h4>
                <p className="text-muted mb-0 small">Fill in the details below</p>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="title"
                  placeholder="e.g., Introduction to Algebra"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-3 g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Subject</label>
                  <select
                    className="form-select rounded-3"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Class</label>
                  <select
                    className="form-select rounded-3"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control rounded-3"
                  name="description"
                  rows="4"
                  placeholder="Write the lesson content here..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

           
              <div className="mb-3">
                <label className="form-label fw-semibold">Video (optional)</label>
                <input
                  type="file"
                  className="form-control rounded-3"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
                {videoFile && (
                  <small className="text-muted mt-1 d-block">
                    ✅ {videoFile.name}
                  </small>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">File / PDF (optional)</label>
                <input
                  type="file"
                  className="form-control rounded-3"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setLessonFile(e.target.files[0])}
                />
                {lessonFile && (
                  <small className="text-muted mt-1 d-block">
                    ✅ {lessonFile.name}
                  </small>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link href="/lessons" className="btn btn-light px-4 rounded-pill">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-5 rounded-pill d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Lesson
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default CreateLessonPage;