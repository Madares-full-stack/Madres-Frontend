"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "@/api";
import Link from "next/link";

import SubmissionTable from "../component/SubmissionTable";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

const Page = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role] = useState(() =>
    typeof window === "undefined" ? "" : localStorage.getItem("role") || ""
  );


  const getSubmissions = async () => {
    try {
      setLoading(true);

      const res = await api.get("/submissions");

      const data =
        res.data.submission ||
        res.data.submissions ||
        res.data.data ||
        [];

      setSubmissions(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setSubmissions([]);
        return;
      }

      toast.error(
        err?.response?.data?.message || "Failed to fetch submissions"
      );
    } finally {
      setLoading(false);
    }
  };

 
  const deleteSubmission = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/submissions/${id}`);

      if (res.data.success) {
        toast.success(res.data.message || "Submission deleted");

        setSubmissions((prev) =>
          prev.filter((item) => item._id !== id)
        );
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const res = await api.get("/submissions");

        const data =
          res.data.submission ||
          res.data.submissions ||
          res.data.data ||
          [];

        setSubmissions(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setSubmissions([]);
          return;
        }

        toast.error(
          err?.response?.data?.message || "Failed to fetch submissions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <Toaster position="top-right" />

      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Submissions</h2>
            <p className="text-muted mb-0">
              Manage all student submissions
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {role === "student" && (
              <Link
                href="/submission/create"
                className="btn btn-primary rounded-pill"
              >
                Create Submission
              </Link>
            )}

            <div className="badge bg-primary fs-6">
              {submissions.length} Submission
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                />
                <p className="text-muted">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-5">
                <h5 className="fw-semibold mb-2">
                  No submissions found
                </h5>

                <p className="text-muted mb-0">
                  There are no submissions available yet.
                </p>
              </div>
            ) : (
              <SubmissionTable
                submissions={submissions}
                onDelete={deleteSubmission}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
