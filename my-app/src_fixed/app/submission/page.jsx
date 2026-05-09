"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "@/api";
import SubmissionTable from "../component/SubmissionTable";


const Page = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSubmissions = async () => {
    try {
      const res = await api.get("/submissions");
      setSubmissions(res.data.submission);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteSubmission = async (id) => {
    if (!confirm("Delete this submission?")) return;

    try {
      const res = await api.delete(`/submissions/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        getSubmissions();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getSubmissions();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <Toaster />

      <h2 className="mb-4 fw-bold">Submissions</h2>

      <div className="card shadow border-0 rounded-4 p-3">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <SubmissionTable
            submissions={submissions}
            onDelete={deleteSubmission}
          />
        )}
      </div>
    </div>
  );
};

export default Page;