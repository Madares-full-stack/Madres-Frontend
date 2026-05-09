"use client";

import api from "@/api";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams();

  const [task, setTask] = useState(null);

  const getTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);

      const data = res.data.data;

      setTask(data);

      console.log(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  if (!task) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card border-0 shadow rounded-4 p-4">
        <h2 className="fw-bold mb-3">{task.title}</h2>
        <p className="text-muted mb-4">{task.description}</p>
        <div className="mb-3">
          <span className="fw-bold">Subject:</span>
          {task.subjectId?.name}
        </div>
        <div className="mb-3">
          <span className="fw-bold">Teacher:</span>
          {task.teacherId?.name}
        </div>

        <div className="mb-3">
          <span className="fw-bold">Class:</span>
          {task.classId?.name}
        </div>

        <div className="mb-3">
          <span className="fw-bold">Due Date:</span>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </div>
      </div>
    </div>
  );
};

export default Page;
