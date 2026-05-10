"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/api";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Video,
} from "lucide-react";

const EditLessonPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    classId: "",
    video: null,
    file: null,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lessonRes, subRes, classRes] = await Promise.all([
          api.get(`/lessons/${id}`),
          api.get("/subject"),
          api.get("/classes"),
        ]);

        const lesson = lessonRes.data.data;

        setFormData((prev) => ({
          ...prev,
          title: lesson.title || "",
          description: lesson.description || "",
          subjectId: lesson.subjectId?._id || "",
          classId: lesson.classId?._id || "",
        }));

        setSubjects(subRes.data.subject || subRes.data.data || []);
        setClasses(classRes.data.classes || classRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load lesson");
        router.push("/lessons");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("subjectId", formData.subjectId);
      data.append("classId", formData.classId);

      if (formData.video) {
        data.append("video", formData.video);
      }

      if (formData.file) {
        data.append("file", formData.file);
      }

      await api.put(`/lessons/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Lesson updated successfully");

      router.push("/lessons");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
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
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4">Edit Lesson</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Title
                </label>

                <input
                  type="text"
                  className="form-control rounded-3"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row mb-3 g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Subject
                  </label>

                  <select
                    className="form-select rounded-3"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select subject
                    </option>

                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Class
                  </label>

                  <select
                    className="form-select rounded-3"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select class
                    </option>

                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Description
                </label>

                <textarea
                  className="form-control rounded-3"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              
              <div className="mb-3">
                <label className="form-label fw-semibold d-flex align-items-center gap-2">
                  <Video size={18} />
                  Upload Video
                </label>

                <input
                  type="file"
                  className="form-control rounded-3"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold d-flex align-items-center gap-2">
                  <FileText size={18} />
                  Upload File
                </label>

                <input
                  type="file"
                  className="form-control rounded-3"
                  name="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                />
              </div>

       
              <div className="d-flex justify-content-end gap-2">
                <Link
                  href="/lessons"
                  className="btn btn-light px-4 rounded-pill"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="btn btn-primary px-5 rounded-pill d-flex align-items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLessonPage;