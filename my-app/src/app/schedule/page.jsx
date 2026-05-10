"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/api";
import { toast } from "react-hot-toast";
import { CalendarDays, Plus, User, Clock, Calendar } from "lucide-react";

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get("/schedules");
        setSchedule(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container-fluid px-4 px-md-5">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 bg-white p-4 rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
              <CalendarDays size={32} />
            </div>
            <div>
              <h2 className="mb-0 fw-bold text-dark">Weekly Schedule</h2>
              <p className="text-muted mb-0 mt-1 fs-6">View class timetables.</p>
            </div>
          </div>
          <Link
            href="/schedule/create"
            className="btn btn-primary btn-lg d-flex align-items-center gap-2 fw-semibold rounded-pill px-4 shadow-sm"
          >
            <Plus size={20} strokeWidth={3} /> Add Schedule
          </Link>
        </div>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-bordered mb-0 text-center align-middle" style={{ minWidth: "1000px" }}>
              <thead className="bg-light">
                <tr>
                  <th className="py-4 bg-light">
                    <div className="d-flex flex-column align-items-center text-muted gap-1">
                      <Clock size={20} />
                      <span className="fw-semibold text-uppercase" style={{ fontSize: "0.85rem" }}>
                        Time / Day
                      </span>
                    </div>
                  </th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="py-4 bg-light" style={{ width: "18%" }}>
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
                    <td colSpan={6} className="text-muted py-5">No schedules found</td>
                  </tr>
                ) : (
                  [...new Set(schedule.map((s) => s.startTime))].sort().map((time) => (
                    <tr key={time}>
                      <td className="bg-light border-end fw-bold text-muted py-4">
                        {time}
                      </td>
                      {daysOfWeek.map((day) => {
                        const slots = schedule.filter(
                          (s) => s.day === day && s.startTime === time
                        );
                        return (
                          <td key={`${day}-${time}`} className="p-3">
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
                                      <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.85rem" }}>
                                        <User size={14} />
                                        <span className="text-truncate" style={{ maxWidth: "100px" }}>
                                          {slot.teacherId?.name || slot.teacherId?.userId?.name || "—"}
                                        </span>
                                      </div>
                                      <span className="badge bg-white text-dark border rounded-pill px-2 py-1">
                                        {slot.classId?.name}
                                      </span>
                                    </div>
                                    <small className="text-muted">
                                      {slot.startTime} - {slot.endTime}
                                    </small>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted opacity-25 fs-3">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchedulePage;