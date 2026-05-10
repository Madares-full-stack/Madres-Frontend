"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import api from "@/api";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

const getRoleName = (user) => {
  if (!user) return "";
  if (typeof user.role === "string") return user.role;
  return user.role?.name || "";
};

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

const getGradeSubject = (grade) =>
  grade.subject?.name ;

const getGradeStudent = (grade) =>
  grade.student?.name ;

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(getCurrentUser);

  const canCreate = ["admin", "teacher"].includes(getRoleName(user));

  const loadGrades = async () => {
    setLoading(true);

    try {
      const res = await api.get("/grades");
      setGrades(res.data.grades );
    } catch (err) {
      toast.error(err.message );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await api.get("/grades");
        setGrades(res.data.grades);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 bg-white rounded-4 shadow-sm p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                <Award size={30} />
              </div>

              <div>
                <h2 className="fw-bold mb-1">Grades</h2>
                <p className="text-muted mb-0">Review student scores</p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-2"
                onClick={loadGrades}
                disabled={loading}
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              {canCreate && (
                <Link
                  href="/grades/create"
                  className="btn btn-primary rounded-pill d-inline-flex align-items-center gap-2"
                >
                  <Plus size={18} />
                  Add Grade
                </Link>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              ) : grades.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No grades found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade._id}>
                          <td className="px-4 fw-semibold">
                            {getGradeStudent(grade)}
                          </td>
                          <td className="px-4">{getGradeSubject(grade)}</td>
                          <td className="px-4">
                            <span className="fw-bold text-primary">
                              {grade.score}
                            </span>
                          </td>
                          <td className="px-4">
                            <span
                              className={`badge rounded-pill ${
                                grade.score >= 50 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {grade.score >= 50 ? "Passed" : "Needs review"}
                            </span>
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
      </div>

      <Footer />
    </div>
  );
};

export default GradesPage;
