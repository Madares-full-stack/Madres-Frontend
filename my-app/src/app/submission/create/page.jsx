"use client";

import { Suspense } from 'react';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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

  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return { name: stored };
  }
};

const getCurrentUserId = () => {
  if (typeof window === "undefined") return "";
  return (localStorage.getItem("userId") || "").replace(/"/g, "");
};

const CreateSubmissionComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task") || "";
  const [user] = useState(getCurrentUser);
  const [tasks, setTasks] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    task: taskId,
    student: getCurrentUserId(),
    answer: "",
  });

  const role = getRoleName(user);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const tasksRes = await api.get("/tasks/my");

        const taskList = tasksRes.data.data || tasksRes.data.tasks || [];

        setTasks(taskList);
        if (taskId) {
          setForm((prev) => ({ ...prev, task: taskId }));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load options");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/submissions", {
        task: form.task,
        student: form.student,
        answer: form.answer,
      });

      toast.success("Submission created successfully");
      router.push("/submission");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create submission");
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
              <h3 className="fw-bold mb-1">Create Submission</h3>
              <p className="text-muted mb-4">
                Select a task and write the submitted answer.
              </p>

              {loadingOptions ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {role !== "student" && (
                      <div className="col-12">
                        <div className="alert alert-warning mb-0">
                          Only students can create submissions.
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label fw-semibold">Task</label>
                      <select
                        className="form-select bg-light border-0 py-3"
                        value={form.task}
                        disabled={Boolean(taskId)}
                        onChange={(e) =>
                          setForm({ ...form, task: e.target.value })
                        }
                        required
                      >
                        <option value="" disabled>
                          Select task
                        </option>
                        {tasks.map((task) => (
                          <option key={task._id} value={task._id}>
                            {task.title}
                          </option>
                        ))}
                      </select>
                      {taskId && (
                        <small className="text-muted">
                          This task was selected from the task page.
                        </small>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Answer</label>
                      <textarea
                        className="form-control bg-light border-0"
                        rows={6}
                        value={form.answer}
                        onChange={(e) =>
                          setForm({ ...form, answer: e.target.value })
                        }
                        placeholder="Write the submitted answer"
                        required
                      />
                    </div>

                    <div className="d-flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill py-3 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2"
                        disabled={saving || role !== "student"}
                      >
                        {saving ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <Send size={20} />
                        )}
                        Create Submission
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
      </div>

      <Footer />
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateSubmissionComponent />
    </Suspense>
  );
}
