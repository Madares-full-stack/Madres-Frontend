"use client";

import { useEffect, useState } from "react";
import api from "@/api";
import Link from "next/link";
const Page = () => {
  const [schedules, setSchedules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

 const fetchDashboard = async () => {
  try {
    const teacherId = localStorage.getItem("userId");

    const [scheduleRes, taskRes, gradeRes, attendanceRes] = await Promise.all([
      api.get("/schedules"),
      api.get(`/tasks?teacherId=${teacherId}`),  
      api.get("/grades"),
      api.get("/attendance"),
    ]);

    const allTasks = taskRes.data.data || [];
    const allGrades = gradeRes.data.grades || [];
    const allAttendance = attendanceRes.data.attendance || [];

    setSchedules(scheduleRes.data.data || []);
    setTasks(allTasks);
    setGrades(allGrades);
    setAttendance(allAttendance);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  const avgGrade =
    grades.length > 0
      ? (
          grades.reduce((acc, item) => acc + item.score, 0) / grades.length
        ).toFixed(1)
      : 0;

  const students = [...new Set(attendance.map((a) => a.studentId?._id))];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Teacher Dashboard</h2>
          <p className="text-muted">Welcome back 👋</p>
        </div>
     <div className="d-flex gap-2">
        <button className="btn btn-success  rounded-pill p-2 ">
          <Link className="text-decoration-none text-white"  href="/lessons/create">
          + New Lesson
          </Link>
          </button>

          <button className="btn btn-primary  rounded-pill p-2 ">
          <Link className="text-decoration-none text-white"  href="/dashboard/teacher/addTask">
          + New Task
          </Link>
        </button>
      </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Students</h6>
              <h2 className="fw-bold text-primary">{students.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Schedules</h6>
              <h2 className="fw-bold text-success">{schedules.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Tasks</h6>
              <h2 className="fw-bold text-warning">{tasks.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Average Grade</h6>
              <h2 className="fw-bold text-danger">{avgGrade}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Today Schedule</h4>

                <button className="btn btn-outline-primary btn-sm">
                  View All
                </button>
              </div>

              {schedules.length === 0 ? (
                <p className="text-muted">No schedules found</p>
              ) : (
                schedules.slice(0, 6).map((schedule) => (
                  <div key={schedule._id} className="border rounded-4 p-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {schedule.subjectId?.name}
                        </h5>

                        <p className="text-muted mb-1">
                          {schedule.classId?.name}
                        </p>

                        <small>
                          {schedule.startTime} - {schedule.endTime}
                        </small>
                      </div>

                      <span className="badge bg-primary">Class</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Attendance</h4>

              {attendance.slice(0, 6).map((record) => (
                <div
                  key={record._id}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <span>{record.studentId?.name}</span>

                  <span
                    className={`badge ${
                      record.status === "present" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Latest Tasks</h4>
              <button className="btn btn-outline-primary">Create</button>

              {tasks.length === 0 ? (
                <p className="text-muted">No tasks found</p>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="border rounded-4 p-3 mb-3">
                    <h5 className="fw-bold">{task.title}</h5>

                    <p className="text-muted mb-0">{task.subjectId?.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Latest Grades</h4>

              {grades.length === 0 ? (
                <p className="text-muted">No grades found</p>
              ) : (
                grades.slice(0, 6).map((grade) => (
                  <div
                    key={grade._id}
                    className="d-flex justify-content-between border-bottom py-2"
                  >
                    <span>{grade.student?.name}</span>

                    <span className="fw-bold text-primary">{grade.score}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
