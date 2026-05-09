"use client";

import React, { useEffect, useState } from "react";
import api from "@/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const Router =useRouter();
  const getClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.classes);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getStudents = async (classId) => {
    try {
      const res = await api.get(`/classes/${classId}`);
      setStudents(res.data.class.students);
      console.log("Students:", res.data.class.students);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      getStudents(selectedClass);
    }
  }, [selectedClass]);
  const handleChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

const submitAttendance = async () => {
  try {
    const data = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId],
    }));

    const res = await api.post("/attendance", {
      classId: selectedClass,
      record: data,
    });

    toast.success(res.data.message);
    console.log(res.data)
    setAttendance({});
  } catch (err) {
    toast.error(err.message);
  }
};

  return (
    <div className="container mt-4">
      <Toaster/>
      <h3 className="mb-4">Attendance</h3>
      <select
        className="form-select mb-4"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {students.length > 0 && (
        <div className="card p-3 shadow">
          <h5>Students</h5>

          {students.map((s) => (
            <div
              key={s._id}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <span>{s.name}</span>

              <div className="d-flex gap-2">
                <button
                  className={`btn ${
                    attendance[s._id] === "present"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => handleChange(s._id, "present")}
                >
                  Present
                </button>

                <button
                  className={`btn ${
                    attendance[s._id] === "absent"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => handleChange(s._id, "absent")}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
            <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button onClick={submitAttendance} className="btn btn-outline-primary ">
            Submit Attendance
          </button>
          <button className="btn btn-dark " onClick={()=>{
            Router.back()
          }}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
