"use client";

import React, { useEffect, useState } from "react";
import api from "@/api";
import Link from "next/link";
import Chatbot from "@/app/component/chatbot";
import Footer from "@/app/component/Footer";

const getClassId = (item) => item?.classId?._id || item?.classId || "";

const Page = () => {
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          attendanceRes,
          gradesRes,
          tasksRes,
          lessonsRes,
        ] = await Promise.all([
          api.get("/attendance/my"),
          api.get("/grades/my"),
          api.get("/tasks/my"),
          api.get("/lessons/my"),
        ]);

        const attendanceData = attendanceRes.data.attendance || [];
        const gradesData = gradesRes.data.grades || gradesRes.data.data || [];
        const tasksData = tasksRes.data.data || [];
        const lessonsData = lessonsRes.data.data || [];
        const classId =
          getClassId(attendanceData.find(getClassId)) ||
          getClassId(lessonsData.find(getClassId)) ||
          getClassId(tasksData.find(getClassId));

        const schedulesRes = classId
          ? await api
              .get(`/schedules?classId=${classId}`)
              .catch(() => ({ data: { data: [] } }))
          : { data: { data: [] } };

        setAttendance(attendanceData);
        setGrades(gradesData);
        setTasks(tasksData);
        setLessons(lessonsData);
        setSchedules(schedulesRes.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const presentCount = attendance.filter(
    (a) => a.status === "present"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.status === "absent"
  ).length;

  const attendanceRate =
    attendance.length > 0
      ? (
          (presentCount / attendance.length) *
          100
        ).toFixed(1)
      : 0;

  const studentClassId =
    getClassId(attendance.find(getClassId)) ||
    getClassId(lessons.find(getClassId)) ||
    getClassId(tasks.find(getClassId));

  const studentSchedules = studentClassId
    ? schedules.filter(
        (schedule) =>
          (schedule.classId?._id || schedule.classId) === studentClassId,
      )
    : schedules;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">
              Student Dashboard
            </h2>

            <p className="text-muted mb-0">
              Welcome back
            </p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h6 className="text-muted">
                  Lessons
                </h6>

                <h2 className="fw-bold text-primary">
                  {lessons.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h6 className="text-muted">
                  Tasks
                </h6>

                <h2 className="fw-bold text-warning">
                  {tasks.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h6 className="text-muted">
                  Attendance
                </h6>

                <h2 className="fw-bold text-success">
                  {attendanceRate}%
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h6 className="text-muted">
                  Grades
                </h6>

                <h2 className="fw-bold text-danger">
                  {grades.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold">
                    Latest Tasks
                  </h4>
                </div>

                {tasks.length === 0 ? (
                  <p className="text-muted">
                    No tasks found
                  </p>
                ) : (
                  tasks
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task._id}
                        className="border rounded-4 p-3 mb-3"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Link
                              href={`/task/${task._id}`}
                            >
                              <h5 className="fw-bold mb-1">
                                {task.title}
                              </h5>
                            </Link>

                            <p className="text-muted mb-0">
                              {
                                task.subjectId
                                  ?.name
                              }
                            </p>
                          </div>

                          <span className="badge bg-warning text-dark">
                            Task
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-4">
                  Attendance Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>
                    ✅ Present
                  </span>

                  <span className="fw-bold text-success">
                    {presentCount}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>
                    ❌ Absent
                  </span>

                  <span className="fw-bold text-danger">
                    {absentCount}
                  </span>
                </div>

                <div className="progress mt-3">
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${attendanceRate}%`,
                    }}
                  >
                    {attendanceRate}%
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h4 className="fw-bold mb-4">
                  Latest Grades
                </h4>

                {grades.length === 0 ? (
                  <p className="text-muted">
                    No grades found
                  </p>
                ) : (
                  grades
                    .slice(0, 5)
                    .map((grade) => (
                      <div
                        key={grade._id}
                        className="d-flex justify-content-between border-bottom py-2"
                      >
                        <span>
                          {
                            grade.subject
                              ?.name
                          }
                        </span>

                        <span className="fw-bold">
                          {grade.score}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">My Schedule</h4>

              <Link href="/schedule" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </div>

            {studentSchedules.length === 0 ? (
              <p className="text-muted mb-0">No schedule found</p>
            ) : (
              <div className="row g-3">
                {studentSchedules.slice(0, 6).map((schedule) => (
                  <div key={schedule._id} className="col-md-4">
                    <div className="border rounded-4 p-3 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-1">
                            {schedule.subjectId?.name || "Subject"}
                          </h6>

                          <small className="text-muted">
                            {schedule.teacherId?.name || "Teacher"}
                          </small>
                        </div>

                        <span className="badge bg-primary">
                          {schedule.day}
                        </span>
                      </div>

                      <div className="text-muted small">
                        {schedule.startTime} - {schedule.endTime}
                      </div>

                      <div className="text-muted small">
                        {schedule.classId?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold">
                Latest Lessons
              </h4>
            </div>

            <div className="row">
              {lessons.length === 0 ? (
                <p className="text-muted">
                  No lessons found
                </p>
              ) : (
                lessons
                  .slice(0, 4)
                  .map((lesson) => (
                    <div
                      className="col-md-3 mb-3"
                      key={lesson._id}
                    >
                      <div className="border rounded-4 p-3 h-100">
                        <h5 className="fw-bold">
                          {lesson.title}
                        </h5>

                        <p className="text-muted">
                          {
                            lesson.subjectId
                              ?.name
                          }
                        </p>

                        <Link
                          href={`/lessons/${lesson._id}`}
                        >
                          <button className="btn btn-primary w-100">
                            Open Lesson
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer/>
      <Chatbot />
    </>
  );
};

export default Page;
