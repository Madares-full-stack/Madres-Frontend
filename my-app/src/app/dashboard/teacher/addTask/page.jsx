"use client";

import api from "@/api";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";

const Page = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectId: "",
    classId: "",
    dueDate: "",
    maxScore: "",
  });

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const teacherId = localStorage.getItem("userId");
      if (!teacherId) return toast.error("Teacher not found. Please login again.");

      await api.post("/tasks", {
        title: form.title,
        description: form.description,
        subjectId: form.subjectId,
        classId: form.classId,
        dueDate: form.dueDate,
        teacherId,
        maxScore: Number(form.maxScore),
      });

      toast.success("Task created successfully");
      router.push("/dashboard/teacher");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: "700px" }}>

        <Link
          href="/dashboard/teacher"
          className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="fw-medium">Back to Dashboard</span>
        </Link>

        <div className="card shadow-sm border-0 rounded-4 bg-white">
          <div className="card-header bg-white border-0 pt-4 px-4">
            <h4 className="fw-bold mb-0">Create New Task</h4>
            <p className="text-muted small mb-0">Fill in the details below</p>
          </div>

          <div className="card-body p-4">
            <form onSubmit={createTask}>

              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="title"
                  placeholder="Task title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control rounded-3"
                  name="description"
                  rows="3"
                  placeholder="Task description"
                  value={form.description}
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
                    value={form.subjectId}
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
                    value={form.classId}
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

              <div className="row mb-4 g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Due Date</label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Max Score</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    name="maxScore"
                    placeholder="e.g. 100"
                    value={form.maxScore}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link href="/dashboard/teacher" className="btn btn-light px-4 rounded-pill">
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
                  Create Task
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Page;