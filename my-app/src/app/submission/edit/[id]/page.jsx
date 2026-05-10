"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import api from "@/api";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

const getSubmission = (data) =>
  data.submission || data.data || data.submissions || null;

const EditSubmissionPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [form, setForm] = useState({
    answer: "",
  });

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const res = await api.get("/submissions");
        const submissions = getSubmission(res.data) || [];
        const data = Array.isArray(submissions)
          ? submissions.find((item) => item._id === id)
          : submissions;

        setSubmission(data);
        setForm({
          answer: data?.answer || "",
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load submission"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSubmission();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      answer: form.answer,
    };

    try {
      await api.put(`/submissions/${id}`, payload);
      toast.success("Submission updated successfully");
      router.push("/submission");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update submission"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Toaster />

      <div className="bg-light min-vh-100 py-5">
        <div className="container" style={{ maxWidth: "760px" }}>
          <Link
            href="/submission"
            className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Submissions
          </Link>

          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold mb-1">Edit Submission</h3>
              <p className="text-muted mb-4">
                Update the submitted answer.
              </p>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              ) : !submission ? (
                <p className="text-muted mb-0">Submission not found</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Student</label>
                      <input
                        className="form-control bg-light border-0 py-3"
                        value={
                          submission.student?.name ||
                          submission.studentId?.name ||
                          "Student"
                        }
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Task</label>
                      <input
                        className="form-control bg-light border-0 py-3"
                        value={
                          submission.task?.title ||
                          submission.taskId?.title ||
                          "Task"
                        }
                        disabled
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Answer</label>
                      <textarea
                        className="form-control bg-light border-0"
                        rows={5}
                        value={form.answer}
                        onChange={(e) =>
                          setForm({ ...form, answer: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="d-flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill py-3 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2"
                        disabled={saving}
                      >
                        {saving ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <Save size={20} />
                        )}
                        Save Changes
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
                </form>
              )}
            </div>
          </div>
        </div>
        <Footer/>
      </div>

    </div>
  );
};

export default EditSubmissionPage;
