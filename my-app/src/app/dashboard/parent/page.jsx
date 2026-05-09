"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  GraduationCap,
  ClipboardList,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  User,
} from "lucide-react";

import api from "@/api";
import toast, { Toaster } from "react-hot-toast";

const gradeColor = (score) => {
  if (score >= 90) return "#10b981";
  if (score >= 80) return "#0ea5e9";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
};

const Page = () => {
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, gradesRes, tasksRes, lessonsRes] =
        await Promise.all([
          api.get("/attendance/my"),
          api.get("/grades/my"),
          api.get("/tasks"),
          api.get("/lessons"),
        ]);

      const attendanceData = attendanceRes.data.attendance;
      const gradesData = gradesRes.data.grades;

      setAttendance(attendanceData);
      setGrades(gradesData);
      console.log(gradesData)
      setTasks(tasksRes.data.data);
      setLessons(lessonsRes.data.data);

      const childMap = new Map();

      attendanceData.forEach((record) => {
        if (record.studentId?._id) {
          childMap.set(record.studentId._id, record.studentId);
        }
      });

      gradesData.forEach((grade) => {
        if (grade.student?._id) {
          childMap.set(grade.student._id, grade.student);
        }
      });

      const childrenList = Array.from(childMap.values());

      setChildren(childrenList);

      if (childrenList.length > 0) {
        setActiveChild(childrenList[0]._id);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const childAttendance = useMemo(() => {
    return attendance.filter((record) => record.studentId?._id === activeChild);
  }, [attendance, activeChild]);

  const childGrades = useMemo(() => {
    return grades.filter((grade) => grade.student?._id === activeChild);
  }, [grades, activeChild]);

  const presentCount = childAttendance.filter(
    (a) => a.status === "present",
  ).length;

  const absentCount = childAttendance.filter(
    (a) => a.status === "absent",
  ).length;

  const attendanceRate =
    childAttendance.length > 0
      ? ((presentCount / childAttendance.length) * 100).toFixed(1)
      : 0;

  const averageGrade =
    childGrades.length > 0
      ? Math.round(
          childGrades.reduce((sum, grade) => sum + grade.score, 0) /
            childGrades.length,
        )
      : 0;

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "submitted",
  );

  const currentChild = children.find((child) => child._id === activeChild);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" />
      </div>
    );
  }

  return (
    <div>
    <Toaster/>
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Parent Dashboard</h2>

          <p className="text-muted mb-0">Monitor your children's progress</p>
        </div>
      </div>

      {children.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-4">
          {children.map((child) => (
            <button
              key={child._id}
              onClick={() => setActiveChild(child._id)}
              className={`btn rounded-pill px-4 ${
                activeChild === child._id
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
            >
              <User size={14} className="me-2" />
              {child.name}
            </button>
          ))}
        </div>
      )}

      {children.length === 0 && (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <User size={40} className="mx-auto mb-3 text-secondary" />

          <h5>No children linked</h5>

          <p className="text-muted mb-0">
            Please contact the school administration.
          </p>
        </div>
      )}
      {children.length > 0 && (
        <>
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                style={{
                  width: 60,
                  height: 60,
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {currentChild?.name?.[0]}
              </div>

              <div>
                <h4 className="fw-bold mb-1">{currentChild?.name}</h4>

                <p className="text-muted mb-0">
                  {currentChild?.classId?.name || "No class"}
                </p>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1">Attendance</p>

                      <h3 className="fw-bold text-success">
                        {attendanceRate}%
                      </h3>
                    </div>

                    <CalendarCheck className="text-success" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1">Average Grade</p>

                      <h3
                        className="fw-bold"
                        style={{
                          color: gradeColor(averageGrade),
                        }}
                      >
                        {averageGrade}
                      </h3>
                    </div>

                    <GraduationCap
                      style={{
                        color: gradeColor(averageGrade),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1">Present</p>

                      <h3 className="fw-bold text-primary">{presentCount}</h3>
                    </div>

                    <CheckCircle2 className="text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1">Absent</p>

                      <h3 className="fw-bold text-danger">{absentCount}</h3>
                    </div>

                    <AlertCircle className="text-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-7 mb-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">Academic Performance</h4>

                  {childGrades.length === 0 ? (
                    <p className="text-muted">No grades available</p>
                  ) : (
                    childGrades.map((grade) => (
                      <div key={grade._id} className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="fw-semibold">
                            {grade.subject?.name}
                          </span>

                          <span
                            className="fw-bold"
                            style={{
                              color: gradeColor(grade.score),
                            }}
                          >
                            {grade.score}
                          </span>
                        </div>

                        <div className="progress" style={{ height: 10 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${grade.score}%`,
                              backgroundColor: gradeColor(grade.score),
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">Attendance Summary</h4>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Present Days</span>

                    <span className="badge bg-success">{presentCount}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Absent Days</span>

                    <span className="badge bg-danger">{absentCount}</span>
                  </div>

                  <div className="progress mt-4" style={{ height: 12 }}>
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${attendanceRate}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">Pending Tasks</h4>

                  {overdueTasks.length === 0 ? (
                    <div className="text-center py-4">
                      <CheckCircle2 size={40} className="text-success mb-3" />

                      <p className="text-muted mb-0">No overdue tasks</p>
                    </div>
                  ) : (
                    overdueTasks.map((task) => (
                      <div key={task._id} className="border rounded-4 p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="fw-bold mb-1">{task.title}</h6>

                            <small className="text-muted">
                              {task.subjectId?.name}
                            </small>
                          </div>

                          <AlertTriangle className="text-danger" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Recent Lessons</h4>

              <div className="row g-3">
                {lessons.slice(0, 4).map((lesson) => (
                  <div key={lesson._id} className="col-md-3">
                    <div className="border rounded-4 p-3 h-100">
                      <BookOpen className="text-success mb-3" size={20} />

                      <h6 className="fw-bold">{lesson.title}</h6>

                      <small className="text-muted">
                        {lesson.subjectId?.name}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};
export default Page;
