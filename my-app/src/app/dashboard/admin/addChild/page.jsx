"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/api";

const Page = () => {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/users");
      const all = res.data.users;

      setStudents(all.filter(u => u.role?.name === "student"));
      setParents(all.filter(u => u.role?.name === "parent"));
    };

    fetchData();
  }, []);

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const addChild = async () => {
    if (!selectedParent || selectedStudents.length === 0) {
      return toast.error("Select parent and at least one student");
    }

    try {
      await Promise.all(
        selectedStudents.map((childId) =>
          api.post("/users/addChild", {
            parentId: selectedParent,
            childId,
          })
        )
      );

      toast.success("Children added successfully");
      router.back();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <Toaster />

      <div className="card p-4 shadow">
        <h5 className="mb-3">Add Children</h5>


        <select
          className="form-select mb-3"
          onChange={(e) => setSelectedParent(e.target.value)}
        >
          <option value="">Select Parent</option>
          {parents.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="border p-2 rounded mb-3" style={{ maxHeight: 200, overflowY: "auto" }}>
          {students.map((s) => (
            <div key={s._id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectedStudents.includes(s._id)}
                onChange={() => toggleStudent(s._id)}
              />
              <label className="form-check-label">{s.name}</label>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-dark" onClick={() => router.back()}>
            Back
          </button>

          <button className="btn btn-success" onClick={addChild}>
            Add Children
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;