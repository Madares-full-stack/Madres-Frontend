"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/api";
import { toast } from "react-hot-toast";
import {
  CalendarDays,
  Plus,
  User,
  Clock,
  Calendar,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return { name: storedUser };
  }
};

const getRoleName = (user) => {
  if (!user) return "";
  if (typeof user.role === "string") return user.role;
  return user.role?.name || "";
};

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    day: "Sunday",
    startTime: "",
    endTime: "",
    subjectId: "",
    classId: "",
    teacherId: "",
  });
  const [user] = useState(getCurrentUser);

  const canManage = ["admin", "teacher"].includes(getRoleName(user));

  const timeSlots = useMemo(() => {
    return [
      ...new Set(schedule.map((item) => `${item.startTime}-${item.endTime}`)),
    ].sort();
  }, [schedule]);

  const fetchSchedule = async () => {
    try {
      const res = await api.get("/schedules");
      setSchedule(res.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        if (!canManage) {
          const scheduleRes = await api.get("/schedules");
          setSchedule(scheduleRes.data.data || []);
          return;
        }

        const [scheduleRes, subjectRes, classRes, userRes] = await Promise.all([
          api.get("/schedules"),
          api.get("/subject"),
          api.get("/classes"),
          api.get("/users"),
        ]);

        const allUsers = userRes.data.users || userRes.data.data || [];

        setSchedule(scheduleRes.data.data || []);
        setSubjects(subjectRes.data.subjects || subjectRes.data.data || []);
        setClasses(classRes.data.classes || classRes.data.data || []);
        setTeachers(
          allUsers.filter((item) => getRoleName(item) === "teacher")
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch schedules"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [canManage]);

  const openEdit = (slot) => {
    setEditing(slot);
    setEditForm({
      day: slot.day || "Sunday",
      startTime: slot.startTime || "",
      endTime: slot.endTime || "",
      subjectId: slot.subjectId?._id || slot.subjectId || "",
      classId: slot.classId?._id || slot.classId || "",
      teacherId: slot.teacherId?._id || slot.teacherId || "",
    });
  };

  const updateSchedule = async (e) => {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    try {
      const res = await api.put(`/schedules/${editing._id}`, editForm);
      setSchedule((prev) =>
        prev.map((item) => (item._id === editing._id ? res.data.data : item))
      );
      setEditing(null);
      toast.success("Schedule updated successfully");
      fetchSchedule();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update schedule");
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async (id) => {
    if (!confirm("Delete this schedule?")) return;

    try {
      await api.delete(`/schedules/${id}`);
      setSchedule((prev) => prev.filter((item) => item._id !== id));
      toast.success("Schedule deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete schedule");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-light min-vh-100 py-5">
        <div className="container-fluid px-4 px-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 bg-white p-4 rounded-4 shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <CalendarDays size={32} />
              </div>
              <div>
                <h2 className="mb-0 fw-bold text-dark">Weekly Schedule</h2>
                {/* ✅ Fix: typo "clas8sName" → "className" */}
                <p className="text-muted mb-0 mt-1 fs-6">
                  View class timetables.
                </p>
              </div>
            </div>
            {canManage && (
              <Link
                href="/schedule/create"
                className="btn btn-primary btn-lg d-flex align-items-center gap-2 fw-semibold rounded-pill px-4 shadow-sm"
              >
                <Plus size={20} strokeWidth={3} /> Add Schedule
              </Link>
            )}
          </div>

          <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table
                className="table table-bordered mb-0 text-center align-middle"
                style={{ minWidth: "1000px" }}
              >
                <thead className="bg-light">
                  <tr>
                    <th className="py-4 bg-light">
                      <div className="d-flex flex-column align-items-center text-muted gap-1">
                        <Clock size={20} />
                        <span
                          className="fw-semibold text-uppercase"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Time / Day
                        </span>
                      </div>
                    </th>
                    {daysOfWeek.map((day) => (
                      <th
                        key={day}
                        className="py-4 bg-light"
                        style={{ width: "18%" }}
                      >
                        <div className="d-flex flex-column align-items-center text-dark gap-1">
                          <Calendar size={20} className="text-primary" />
                          <span className="fw-bold fs-5">{day}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-muted py-5">
                        No schedules found
                      </td>
                    </tr>
                  ) : (
                    timeSlots.map((timeSlot) => {
                      const [startTime, endTime] = timeSlot.split("-");

                      return (
                        <tr key={timeSlot}>
                          <td className="bg-light border-end fw-bold text-muted py-4">
                            {startTime} - {endTime}
                          </td>
                          {daysOfWeek.map((day) => {
                            const slots = schedule.filter(
                              (s) =>
                                s.day === day &&
                                s.startTime === startTime &&
                                s.endTime === endTime
                            );
                            return (
                              <td key={`${day}-${timeSlot}`} className="p-3">
                                {slots.length > 0 ? (
                                  <div className="d-flex flex-column gap-2">
                                    {slots.map((slot, idx) => (
                                      <div
                                        key={idx}
                                        className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 text-start"
                                      >
                                        <span className="d-block fw-bold text-primary mb-2 fs-6">
                                          {slot.subjectId?.name}
                                        </span>
                                        <div className="d-flex justify-content-between align-items-center text-secondary">
                                          <div
                                            className="d-flex align-items-center gap-1"
                                            style={{ fontSize: "0.85rem" }}
                                          >
                                            <User size={14} />
                                            <span
                                              className="text-truncate"
                                              style={{ maxWidth: "100px" }}
                                            >
                                              {slot.teacherId?.name ||
                                                slot.teacherId?.userId?.name ||
                                                "—"}
                                            </span>
                                          </div>
                                          <span className="badge bg-white text-dark border rounded-pill px-2 py-1">
                                            {slot.classId?.name}
                                          </span>
                                        </div>
                                        <small className="text-muted">
                                          {slot.startTime} - {slot.endTime}
                                        </small>
                                        {canManage && (
                                          <div className="d-flex gap-2 mt-3">
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1"
                                              onClick={() => openEdit(slot)}
                                            >
                                              <Pencil size={14} />
                                              Edit
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-1"
                                              onClick={() =>
                                                deleteSchedule(slot._id)
                                              }
                                            >
                                              <Trash2 size={14} />
                                              Delete
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted opacity-25 fs-3">
                                    -
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {editing && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ background: "rgba(0, 0, 0, 0.45)", zIndex: 1050 }}
          >
            <form
              onSubmit={updateSchedule}
              className="bg-white rounded-4 shadow-lg p-4 w-100"
              style={{ maxWidth: "560px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Edit Schedule</h4>
                <button
                  type="button"
                  className="btn btn-light rounded-circle"
                  onClick={() => setEditing(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Subject</label>
                  <select
                    className="form-select"
                    value={editForm.subjectId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subjectId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select subject
                    </option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Class</label>
                  <select
                    className="form-select"
                    value={editForm.classId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, classId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select class
                    </option>
                    {classes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Teacher</label>
                  <select
                    className="form-select"
                    value={editForm.teacherId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, teacherId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select teacher
                    </option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Day</label>
                  <select
                    className="form-select"
                    value={editForm.day}
                    onChange={(e) =>
                      setEditForm({ ...editForm, day: e.target.value })
                    }
                    required
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Start</label>
                  <input
                    type="time"
                    className="form-control"
                    value={editForm.startTime}
                    onChange={(e) =>
                      setEditForm({ ...editForm, startTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">End</label>
                  <input
                    type="time"
                    className="form-control"
                    value={editForm.endTime}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2"
                >
                  {saving ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SchedulePage;
