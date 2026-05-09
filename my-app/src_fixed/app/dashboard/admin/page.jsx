"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "@/api";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import Footer from "@/app/component/Footer";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const NavItem = ({ icon, label, active, href }) => (
  <Link
    href={href || "#"}
    className={`nav-item-custom ${
      active ? "nav-item-active" : ""
    }`}
  >
    <i className={`ti ti-${icon}`} />
    {label}
  </Link>
);

const Page = () => {
  const [user, setUser] = useState([]);
  const [classes, setClasses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const getUser = async () => {
    try {
      const res = await api.get("/users");
      setUser(res.data.users);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const getClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.classes);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const getLessons = async () => {
    try {
      const res = await api.get("/lessons");
      setLessons(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const deleteClass = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await api.delete(`/classes/${id}`);

      if (res.data.success) {
        toast.success(res.data.message);
        getClasses();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await getUser();
      await getClasses();
      await getLessons();

      setLoading(false);
    };

    fetchData();
  }, []);
  const teachersCount = user.filter(
    (u) => u.role?.name === "teacher"
  ).length;

  const studentsCount = user.filter(
    (u) => u.role?.name === "student"
  ).length;

  const parentsCount = user.filter(
    (u) => u.role?.name === "parent"
  ).length;

  const adminsCount = user.filter(
    (u) => u.role?.name === "admin"
  ).length;

  const chartData = {
    labels: ["Users", "Classes", "Lessons"],
    datasets: [
      {
        label: "System Overview",
        data: [
          user.length,
          classes.length,
          lessons.length,
        ],
        backgroundColor: [
          "rgba(249,115,22,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(34,197,94,0.8)",
        ],
      },
    ],
  };
  const userTypeChart = {
    labels: [
      "Teachers",
      "Students",
      "Parents",
      "Admins",
    ],
    datasets: [
      {
        label: "User Types",
        data: [
          teachersCount,
          studentsCount,
          parentsCount,
          adminsCount,
        ],
        backgroundColor: [
          "rgba(59,130,246,0.8)",
          "rgba(34,197,94,0.8)",
          "rgba(249,115,22,0.8)",
          "rgba(168,85,247,0.8)",
        ],
      },
    ],
  };

  return (
    <>
      <Toaster />

      <div className="dashboard-layout">
        <div className="sidebar">

          <NavItem
            icon="layout-dashboard"
            label="Dashboard"
            active
          />

          <NavItem
            label="Add Child"
            href="/dashboard/admin/addChild"
          />

          <NavItem
            label="Add Class"
            href="/addClass"
          />

          <NavItem
            label="Add Lessons"
            href="/dashboard/admin/addLesson"
          />

          <NavItem
            label="Subject"
            href="/dashboard/admin/addSubject"
          />

          <NavItem
            label="Attendance"
            href="/dashboard/admin/addAttendance"
          />

          <NavItem
            label="Submission"
            href="/submission"
          />

        </div>
        <div className="flex-grow-1 p-4">
          <div className="row g-3 mb-4">

            <div className="col-md-4">
              <div className="card-dark stat-card text-white text-center">
                <h4>Total Users</h4>

                <div className="stat-number">
                  {user.length}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-dark stat-card text-white text-center">
                <h4>Total Classes</h4>

                <div className="stat-number">
                  {classes.length}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-dark stat-card text-white text-center">
                <h4>Total Lessons</h4>

                <div className="stat-number">
                  {lessons.length}
                </div>
              </div>
            </div>

          </div>
          <div className="row mb-4">

            <div className="col-md-6">
              <div className="card-dark p-3 h-100">

                <h5 className="text-white text-center mb-3">
                  System Overview
                </h5>

                <Bar data={chartData} />

              </div>
            </div>

            <div className="col-md-6">
              <div className="card-dark p-3 h-100">

                <h5 className="text-white text-center mb-3">
                  User Types
                </h5>

                <Bar data={userTypeChart} />

              </div>
            </div>

          </div>

          <div className="card-dark p-3 mb-4">

            <h5 className="text-white text-center">
              Users
            </h5>

            {loading ? (
              "Loading..."
            ) : (
              <table className="table table-dark table-hover">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {user.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role?.name}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </div>
          <div className="card-dark p-3 text-center text-white">

            <h5>Classes</h5>

            {loading ? (
              "Loading..."
            ) : (
              <table className="table table-dark table-hover">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Teacher</th>
                    <th>Students</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((c) => (
                    <tr key={c._id}>

                      <td>
                        <Link href={`/class/${c._id}`}>
                          {c.name}
                        </Link>
                      </td>

                      <td>
                        {c.teacher?.name}
                      </td>

                      <td>
                        {c.students?.length}
                      </td>

                      <td>

                        <button
                          className="btn btn-danger  me-2 rounded-4"
                          onClick={() => deleteClass(c._id)}
                        >
                          Delete
                        </button>

                        <Link
                          href={`/dashboard/teacher/editClass/${c._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </Link>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Page;