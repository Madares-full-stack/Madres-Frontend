"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/api";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);

  const getData = async () => {
    try {
      const classRes = await api.get(`/classes/${id}`);
      const c = classRes.data.class;

      setName(c.name);
      setTeacher(c.teacher?._id || "");
      setStudents(c.students.map((s) => s._id));

      const usersRes = await api.get("/users");
      setUsers(usersRes.data.users);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (id) getData();
  }, [id]);

  const teachers = users.filter((u) => u.role?.name === "teacher");
  const studentsList = users.filter((u) => u.role?.name === "student");

  const toggleStudent = (studentId) => {
    setStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const updateClass = async () => {
    try {
      const res = await api.put(`/classes/${id}`, {
        name,
        teacher,
        students,
      });

      toast.success(res.data.message);
      router.back();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 rounded-4">
        <h3 className="text-center mb-4">Edit Class</h3>

        <div className="mb-3">
          <label className="form-label">Class Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teacher</label>
          <select
            className="form-select"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Students</label>

          <div
            className="border p-2 rounded"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {studentsList.map((s) => (
              <div key={s._id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={students.includes(s._id)}
                  onChange={() => toggleStudent(s._id)}
                />
                <label className="form-check-label">{s.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success w-100" onClick={updateClass}>
            Save Changes
          </button>

          <button
            className="btn btn-outline-dark w-100"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
