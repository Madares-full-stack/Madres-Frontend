"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BookOpen, Plus, Eye, Edit3, Trash2, Search, Filter, BookCheck } from "lucide-react";

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lessons");
        setLessons(res.data.length > 0 ? res.data : demoData); 
      } catch (error) {
        setLessons(demoData);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGrade === "All" || l.gradeLevel === selectedGrade)
  );

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header & Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold text-dark mb-1">Academic Curriculum</h2>
            <p className="text-muted">Manage and track all educational modules and resources.</p>
          </div>
          <div className="col-md-4 d-flex justify-content-md-end align-items-center">
            <Link href="/lessons/create" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm d-flex align-items-center gap-2">
              <Plus size={20} /> New Lesson
            </Link>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group bg-light rounded-pill px-3">
                  <span className="input-group-text bg-transparent border-0 text-muted"><Search size={18}/></span>
                  <input 
                    type="text" 
                    className="form-control bg-transparent border-0 shadow-none" 
                    placeholder="Search by lesson title..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex gap-2 justify-content-md-end">
                {["All", "10", "11", "12"].map(grade => (
                  <button 
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`btn rounded-pill px-3 fw-medium transition-all ${selectedGrade === grade ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-0 text-muted'}`}
                  >
                    {grade === "All" ? "All Grades" : `Grade ${grade}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="row g-4">
          {filteredLessons.map((lesson) => (
            <div className="col-md-6 col-lg-4" key={lesson._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden lesson-card transition-all">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary"><BookCheck size={20}/></div>
                    <span className="badge rounded-pill bg-light text-dark border px-3 py-2">G{lesson.gradeLevel}</span>
                  </div>
                  <h5 className="fw-bold mb-2 text-dark">{lesson.title}</h5>
                  <p className="text-muted small mb-4 line-clamp-2">{lesson.description}</p>
                  
                  <div className="d-flex gap-2">
                    <Link href={`/lessons/${lesson._id}`} className="btn btn-light flex-grow-1 rounded-3 fw-semibold text-primary"><Eye size={16} className="me-1"/> View</Link>
                    <Link href={`/lessons/edit/${lesson._id}`} className="btn btn-light rounded-3 text-dark"><Edit3 size={16}/></Link>
                    <button className="btn btn-light rounded-3 text-danger"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .lesson-card:hover { transform: translateY(-5px); shadow: 0 1rem 3rem rgba(0,0,0,.175)!important; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

const demoData = [
  { _id: 1, title: "Quantum Physics Basics", description: "An introductory course to the world of subatomic particles.", gradeLevel: "12", subject: "Physics" },
  { _id: 2, title: "Advanced Calculus", description: "Diving deep into integrals and derivatives for engineering.", gradeLevel: "12", subject: "Math" },
  { _id: 3, title: "Organic Chemistry", description: "Studying the structure and properties of carbon-based compounds.", gradeLevel: "11", subject: "Chemistry" }
];

export default LessonsPage;