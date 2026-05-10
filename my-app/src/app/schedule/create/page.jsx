"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/api";
import { toast } from "react-hot-toast";
import { CalendarCheck, User, BookOpen, Clock, Save, ArrowLeft } from "lucide-react";
import Footer from "@/app/component/Footer";

const CreateSchedule = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    day: "Sunday",
    startTime: "",
    endTime: "",
    subjectId: "",
    classId: "",
    teacherId: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [subRes, classRes, userRes] = await Promise.all([
          api.get("/subject"),
          api.get("/classes"),
          api.get("/users"),
        ]);
        setSubjects(subRes.data.subjects || subRes.data.data || []);
        setClasses(classRes.data.classes || classRes.data.data || []);
        const allUsers = userRes.data.users || userRes.data.data || [];
        setTeachers(allUsers.filter((u) => u.role?.name === "teacher"));
      } catch (err) {
        toast.error("Failed to load options");
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/schedules", form);
      toast.success("Schedule created successfully!");
      router.push("/schedule");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: "700px" }}>

        <Link
          href="/schedule"
          className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="fw-medium">Back to Schedule</span>
        </Link>

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="bg-primary p-4 text-white d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-3">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h4 className="mb-0 fw-bold">Add New Schedule</h4>
              <small className="opacity-75">Add a new class to the weekly timetable</small>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-body p-5 bg-white">
            <div className="row g-4">

              <div className="col-md-6">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Day</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Clock size={18} className="text-primary" /></span>
                  <select
                    className="form-select bg-light border-0 py-2"
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                  >
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Start Time</label>
                <input
                  type="time"
                  className="form-control bg-light border-0 py-2"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">End Time</label>
                <input
                  type="time"
                  className="form-control bg-light border-0 py-2"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Subject</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><BookOpen size={18} className="text-primary" /></span>
                  <select
                    className="form-select bg-light border-0 py-2"
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Class</label>
                <select
                  className="form-select bg-light border-0 py-2"
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Teacher</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><User size={18} className="text-primary" /></span>
                  <select
                    className="form-select bg-light border-0 py-2"
                    value={form.teacherId}
                    onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <div className="d-flex gap-3 mt-5">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <><Save size={20} /> Save Schedule</>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-light px-4 rounded-pill text-muted fw-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CreateSchedule;