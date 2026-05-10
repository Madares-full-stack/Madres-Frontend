"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/api";
import { useRouter } from "next/navigation";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const Page = () => {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const Router =useRouter();

  const getUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const teachers = users.filter((u) => u.role?.name === "teacher");
  const studentsList = users.filter((u) => u.role?.name === "student");

  const toggleStudent = (id) => {
    setStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const createClass = async () => {
    try {
      const res = await api.post("/classes", {
        name,
        teacher,
        students,
      });

      toast.success(res.data.message);
      setName("");
      setTeacher("");
      setStudents([]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4 rounded-4">
        <h3 className="text-center mb-4">Add Class</h3>

        <div className="mb-3">
          <label className="form-label">Class Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter class name"
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
          <div className="border p-2 rounded" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {studentsList.map((s) => (
              <div key={s._id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={students.includes(s._id)}
                  onChange={() => toggleStudent(s._id)}
                />
                <label className="form-check-label">{s.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
        <button className="btn btn-outline-primary " onClick={createClass}>
          Create Class
        </button>
        <button className="btn btn-dark" onClick={()=>{
            Router.back()
        }}>Back</button>
        </div>
      </div>
    </div>
    <Footer/>
    
    </div>
  );
};

export default Page;