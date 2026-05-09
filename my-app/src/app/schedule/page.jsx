"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { CalendarDays, Plus, Filter, User, Clock, Calendar } from "lucide-react";

const demoSchedule = [
  { _id: "s1", day: "Sunday", period: 1, subject: "Mathematics", teacherName: "Mr. Ahmad", gradeLevel: "10" },
  { _id: "s2", day: "Sunday", period: 2, subject: "Physics", teacherName: "Dr. Sarah", gradeLevel: "10" },
  { _id: "s3", day: "Sunday", period: 1, subject: "Chemistry", teacherName: "Mr. Khalid", gradeLevel: "11" },
  { _id: "s4", day: "Monday", period: 3, subject: "Biology", teacherName: "Ms. Laila", gradeLevel: "11" },
  { _id: "s5", day: "Tuesday", period: 4, subject: "English", teacherName: "Mr. John", gradeLevel: "12" },
  { _id: "s6", day: "Wednesday", period: 2, subject: "History", teacherName: "Ms. Rania", gradeLevel: "10" },
  { _id: "s7", day: "Thursday", period: 5, subject: "Computer Science", teacherName: "Eng. Tareq", gradeLevel: "12" }
];

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const periods = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/schedule");
        if (res.data && res.data.length > 0) {
          setSchedule(res.data);
        } else {
          setSchedule(demoSchedule);
        }
      } catch (error) {
        setSchedule(demoSchedule);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const filteredSchedule = gradeFilter 
    ? schedule.filter(item => item.gradeLevel === gradeFilter)
    : schedule;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container-fluid px-4 px-md-5">
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 bg-white p-4 rounded-4 shadow-sm border-0">
          <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary d-flex align-items-center justify-content-center">
              <CalendarDays size={32} />
            </div>
            <div>
              <h2 className="mb-0 fw-bold text-dark">Weekly Schedule</h2>
              <p className="text-muted mb-0 mt-1 fs-6">Manage and view class timetables across all grades.</p>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-sm-row gap-3">
            <div className="input-group shadow-sm rounded-pill overflow-hidden bg-light border p-1 d-flex align-items-center">
              <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                <Filter size={18} />
              </span>
              <select 
                className="form-select bg-transparent border-0 shadow-none fw-medium text-dark py-2 pe-4" 
                value={gradeFilter} 
                onChange={(e) => setGradeFilter(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="">All Grades</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            
            <Link href="/schedule/create" className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 fw-semibold rounded-pill px-4 shadow-sm hover-lift">
              <Plus size={20} strokeWidth={3} /> Assign Lesson
            </Link>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-bordered mb-0 text-center align-middle" style={{ minWidth: "1000px" }}>
              <thead className="bg-light">
                <tr>
                  <th className="py-4 bg-light border-bottom-0 w-auto">
                    <div className="d-flex flex-column align-items-center text-muted gap-1">
                      <Clock size={20} />
                      <span className="fw-semibold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>Time / Day</span>
                    </div>
                  </th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="py-4 bg-light border-bottom-0" style={{ width: "18%" }}>
                      <div className="d-flex flex-column align-items-center text-dark gap-1">
                        <Calendar size={20} className="text-primary" />
                        <span className="fw-bold fs-5">{day}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period}>
                    <td className="bg-light border-end fw-bold text-muted py-4">
                      Period {period}
                    </td>
                    {daysOfWeek.map((day) => {
                      const lessonsInSlot = filteredSchedule.filter(s => s.day === day && s.period === period);
                      
                      return (
                        <td key={`${day}-${period}`} className="p-3">
                          {lessonsInSlot.length > 0 ? (
                            <div className="d-flex flex-column gap-2">
                              {lessonsInSlot.map((lessonObj, idx) => (
                                <div key={idx} className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 text-start position-relative transition-all hover-shadow">
                                  <span className="d-block fw-bold text-primary mb-2 fs-6">
                                    {lessonObj.subject}
                                  </span>
                                  <div className="d-flex justify-content-between align-items-center text-secondary mt-1">
                                    <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.85rem" }}>
                                      <User size={14} />
                                      <span className="text-truncate" style={{ maxWidth: "100px" }}>{lessonObj.teacherName}</span>
                                    </div>
                                    <span className="badge bg-white text-dark border border-secondary border-opacity-25 shadow-sm rounded-pill px-2 py-1">
                                      G{lessonObj.gradeLevel}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="d-flex justify-content-center align-items-center h-100 w-100 text-muted opacity-25">
                              <span className="fs-3">-</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchedulePage;