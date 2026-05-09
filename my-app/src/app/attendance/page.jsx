"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/api";
import toast from "react-hot-toast";

import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";

const Page = () => {
  const [attendance, setAttendance] = useState([]);
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/my");

      const data = res.data.attendance;

      setAttendance(data);
      console.log(data)

      const childMap = new Map();

      data.forEach((record) => {
        if (record.studentId?._id) {
          childMap.set(record.studentId._id, record.studentId);
        }
      });

      const childrenList = Array.from(childMap.values());

      setChildren(childrenList);

      if (childrenList.length > 0) {
        setActiveChild(childrenList[0]._id);
      }
    } catch (err) {
      toast.error(
        err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    if (children.length === 0) return attendance;

    return attendance.filter(
      (record) => record.studentId?._id === activeChild,
    );
  }, [attendance, activeChild, children]);

  const presentCount = filteredAttendance.filter(
    (a) => a.status === "present",
  ).length;

  const absentCount = filteredAttendance.filter(
    (a) => a.status === "absent",
  ).length;

  const attendanceRate =
    filteredAttendance.length > 0
      ? ((presentCount / filteredAttendance.length) * 100).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <CalendarCheck className="text-success" size={28} />

        <div>
          <h2 className="fw-bold mb-0">Attendance</h2>

          <small className="text-muted">
            Track attendance records
          </small>
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
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Attendance Rate</h6>

              <h2 className="fw-bold text-success">
                {attendanceRate}%
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Present Days</h6>

              <h2 className="fw-bold text-primary">
                {presentCount}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Absent Days</h6>

              <h2 className="fw-bold text-danger">
                {absentCount}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4">
            Attendance Records
          </h4>

          {filteredAttendance.length === 0 ? (
            <div className="text-center py-5">
              <CalendarCheck
                size={50}
                className="text-secondary mb-3"
              />

              <h5>No attendance records</h5>

              <p className="text-muted mb-0">
                No data available yet.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendance.map((record) => (
                    <tr key={record._id}>
                      <td>
                        {new Date(record.date).toLocaleDateString()}
                      </td>

                      <td>
                        {record.status === "present" ? (
                          <span className="badge bg-success d-inline-flex align-items-center gap-1">
                            <CheckCircle2 size={14} />
                            Present
                          </span>
                        ) : (
                          <span className="badge bg-danger d-inline-flex align-items-center gap-1">
                            <XCircle size={14} />
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;