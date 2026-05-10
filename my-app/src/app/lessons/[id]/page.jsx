"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/api";
import { toast } from "react-hot-toast";
import {useRouter} from "next/navigation";
import { ArrowLeft, Clock, Calendar, Download, BookOpen } from "lucide-react";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

const LessonDetails = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const Router =useRouter();
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${id}`);
        setLesson(res.data.data);
      } catch (error) {
        toast.error("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLesson();
  }, [id]);

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (!lesson)
    return (
      <div className="text-center mt-5">
        <p className="text-muted">Lesson not found</p>
        <Link href="/lessons" className="btn btn-primary rounded-pill">
          Back 
        </Link>
      </div>
    );

  return (
    <div className="bg-white min-vh-100">
      <Navbar/>
      <div className="container py-5">
        <button className="btn btn-link text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4"
          onClick={() => Router.back()}
        >
          <ArrowLeft size={18} />
          <span className="fw-medium">Back</span>
        </button>
         

        <div className="row g-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-3">
              <BookOpen size={20} />
              {lesson.subjectId?.name} • {lesson.classId?.name}
            </div>
            <h1 className="display-5 fw-bold text-dark mb-4">{lesson.title}</h1>

            <div className="d-flex gap-4 mb-5 pb-4 border-bottom text-muted">
              <span className="d-flex align-items-center gap-1">
                <Calendar size={16} />
                {new Date(lesson.createdAt).toLocaleDateString()}
              </span>
              <span className="d-flex align-items-center gap-1">
                <Clock size={16} /> 45 Mins
              </span>
            </div>

            <div className="fs-5 text-secondary lh-lg mb-5">
              {lesson.description}
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm rounded-4 p-4 sticky-top"
              style={{ top: "2rem" }}
            >
              <h5 className="fw-bold mb-4">Lesson Resources</h5>

              {lesson.fileUrl ? (
                <a
                  href={`http://localhost:5000/uploads/${lesson.fileUrl}`}
                  className="btn btn-outline-primary w-100 rounded-pill mb-3 d-flex align-items-center justify-content-center gap-2"
                  download
                >
                  <Download size={18} /> Download File
                </a>
              ) : (
                <button
                  className="btn btn-outline-secondary w-100 rounded-pill mb-3"
                  disabled
                >
                  No file available
                </button>
              )}

              {lesson.videoUrl && (
                <div className="mt-3">
                  <p className="fw-semibold mb-2">Video</p>
                  <video
                    controls
                    className="w-100 rounded-3"
                    src={`http://localhost:5000/uploads/${lesson.videoUrl}`}
                  />
                </div>
              )}

              <div className="mt-3 text-muted small">
                <p className="mb-1">
                  <span className="fw-semibold">Teacher:</span>{" "}
                  {lesson.teacherId?.name || "—"}
                </p>
                <p className="mb-0">
                  <span className="fw-semibold">Class:</span>{" "}
                  {lesson.classId?.name || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
       <Footer/>
    </div>
  );
};

export default LessonDetails;
