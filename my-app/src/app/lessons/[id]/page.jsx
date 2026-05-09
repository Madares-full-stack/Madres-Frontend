"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Clock, Calendar, Download, Share2, BookOpen } from "lucide-react";

const LessonDetails = () => {
  const params = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    // API Fetch logic here
    setLesson({ title: "Quantum Physics Basics", subject: "Physics", gradeLevel: "12", description: "Detailed content of the lesson goes here...", createdAt: "2026-05-09" });
  }, []);

  if (!lesson) return null;

  return (
    <div className="bg-white min-vh-100">
      <div className="container py-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/lessons" className="text-decoration-none">Lessons</Link></li>
            <li className="breadcrumb-item active">{lesson.title}</li>
          </ol>
        </nav>

        <div className="row g-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-3">
              <BookOpen size={20}/> {lesson.subject} • Grade {lesson.gradeLevel}
            </div>
            <h1 className="display-5 fw-bold text-dark mb-4">{lesson.title}</h1>
            
            <div className="d-flex gap-4 mb-5 pb-4 border-bottom text-muted">
              <span className="d-flex align-items-center gap-1"><Calendar size={16}/> {lesson.createdAt}</span>
              <span className="d-flex align-items-center gap-1"><Clock size={16}/> 45 Mins</span>
            </div>

            <div className="lesson-content fs-5 text-secondary lh-lg mb-5">
              {lesson.description}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '2rem' }}>
              <h5 className="fw-bold mb-4">Lesson Resources</h5>
              <button className="btn btn-outline-primary w-100 rounded-pill mb-3 d-flex align-items-center justify-content-center gap-2">
                <Download size={18}/> Download PDF
              </button>
              <button className="btn btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2">
                <Share2 size={18}/> Share Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;