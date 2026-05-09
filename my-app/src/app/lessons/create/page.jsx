"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, BookPlus, Type, BookOpen, GraduationCap, AlignLeft, Save } from "lucide-react";

const CreateLessonPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    gradeLevel: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/lessons", formData);
      toast.success("Lesson created successfully!");
      router.push("/lessons");
    } catch (error) {
      toast.error("Failed to create lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <Link href="/lessons" className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4 hover-opacity">
          <ArrowLeft size={18} />
          <span className="fw-medium">Back to Lessons</span>
        </Link>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-white border-bottom-0 pt-5 pb-0 px-5">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary d-flex align-items-center justify-content-center">
                <BookPlus size={28} />
              </div>
              <div>
                <h3 className="mb-0 fw-bold text-dark">Create New Lesson</h3>
                <p className="text-muted mb-0 mt-1 fs-6">Fill in the details below to add a new lesson to the curriculum.</p>
              </div>
            </div>
          </div>

          <div className="card-body p-5">
            <form onSubmit={handleSubmit}>
              
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2 mb-2">
                  <Type size={18} className="text-muted" /> Lesson Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-0 px-4 py-3 rounded-3"
                  name="title"
                  placeholder="e.g., Introduction to Algebra"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-4 g-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2 mb-2">
                    <BookOpen size={18} className="text-muted" /> Subject
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light border-0 px-4 py-3 rounded-3"
                    name="subject"
                    placeholder="e.g., Mathematics"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2 mb-2">
                    <GraduationCap size={18} className="text-muted" /> Grade Level
                  </label>
                  <select
                    className="form-select form-select-lg bg-light border-0 px-4 py-3 rounded-3"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Grade</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2 mb-2">
                  <AlignLeft size={18} className="text-muted" /> Description / Content
                </label>
                <textarea
                  className="form-control form-control-lg bg-light border-0 px-4 py-3 rounded-3"
                  name="description"
                  rows="5"
                  placeholder="Write a comprehensive description or the content of the lesson here..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <hr className="text-muted opacity-25 mb-4" />

              <div className="d-flex justify-content-end gap-3">
                <Link href="/lessons" className="btn btn-light btn-lg px-4 rounded-pill fw-medium text-dark">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill fw-semibold d-flex align-items-center gap-2 shadow-sm" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Lesson
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

export default CreateLessonPage;