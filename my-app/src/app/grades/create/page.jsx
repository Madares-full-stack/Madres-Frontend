"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import api from "@/api";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

const getRoleName = (user) => {
  if (!user) return "";
  if (typeof user.role === "string") return user.role;
  return user.role?.name || "";
};

const CreateGradePage = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [form, setForm] = useState({
    student: "",
    subject: "",
    score: "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [usersRes, subjectsRes] = await Promise.all([
          api.get("/users"),
          api.get("/subject"),
        ]);

        const users = usersRes.data.users || usersRes.data.data || [];
        setStudents(users.filter((user) => getRoleName(user) === "student"));
        setSubjects(subjectsRes.data.subjects || subjectsRes.data.data || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load options");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      student: form.student,
      subject: form.subject,
      score: Number(form.score),
    };

    try {
      await api.post("/grades", payload);
      toast.success("Grade created successfully");
      router.push("/grades");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="bg-light min-vh-100 py-5">
        <div className="container" style={{ maxWidth: "720px" }}>
          <Link
            href="/grades"
            className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Grades
          </Link>

          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-primary text-white p-4 d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 rounded-3 p-2">
                <Award size={24} />
              </div>

              <div>
                <h4 className="fw-bold mb-0">Add Grade</h4>
                <small className="opacity-75">Record a student score</small>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card-body p-4 p-md-5">
              {loadingOptions ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              ) : (
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Student</label>
                    <select
                      className="form-select bg-light border-0 py-3"
                      value={form.student}
                      onChange={(e) =>
                        setForm({ ...form, student: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select student
                      </option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Subject</label>
                    <select
                      className="form-select bg-light border-0 py-3"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
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

                  <div className="col-12">
                    <label className="form-label fw-semibold">Score</label>
                    <input
                      type="number"
                      className="form-control bg-light border-0 py-3"
                      min="0"
                      max="100"
                      value={form.score}
                      onChange={(e) =>
                        setForm({ ...form, score: e.target.value })
                      }
                      placeholder="Enter score"
                      required
                    />
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary rounded-pill py-3 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2"
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <Save size={20} />
                      )}
                      Save Grade
                    </button>

                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateGradePage;
