"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/api";
import { toast, Toaster } from "react-hot-toast";
import { BookOpen, Plus, Eye, Edit3, Trash2, Search, BookCheck } from "lucide-react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      setLessons(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/lessons/${id}`);
      toast.success("Lesson deleted");
      setLessons((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div>
      <Navbar/>
      <Toaster />

    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold text-dark mb-1">Lessons</h2>
            <p className="text-muted">Manage all educational lessons and resources.</p>
          </div>
          <div className="col-md-4 d-flex justify-content-md-end align-items-center">
    
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="input-group bg-light rounded-pill px-3">
              <span className="input-group-text bg-transparent border-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 shadow-none"
                placeholder="Search by lesson title..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredLessons.length === 0 ? (
          <p className="text-muted text-center mt-5">No lessons found</p>
        ) : (
          <div className="row g-4">
            {filteredLessons.map((lesson) => (
              <div className="col-md-6 col-lg-4" key={lesson._id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                        <BookCheck size={20} />
                      </div>
                      <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                        {lesson.subjectId?.name || "—"}
                      </span>
                    </div>
                    <h5 className="fw-bold mb-2 text-dark">{lesson.title}</h5>
                    <p className="text-muted small mb-3">{lesson.classId?.name}</p>
                    <p
                      className="text-muted small mb-4"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {lesson.description}
                    </p>
                    <div className="d-flex gap-2">
                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="btn btn-light flex-grow-1 rounded-3 fw-semibold text-primary"
                      >
                        <Eye size={16} className="me-1" /> View
                      </Link>
                      <Link
                        href={`/lessons/edit/${lesson._id}`}
                        className="btn btn-light rounded-3 text-dark"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        className="btn btn-light rounded-3 text-danger"
                        onClick={() => deleteLesson(lesson._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
     
    </div>
     <Footer/>
     </div>
  );
};

export default LessonsPage;