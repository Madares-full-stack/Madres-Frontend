"use client";

import React, { useEffect, useState } from "react";
import api from "@/api";
import toast from "react-hot-toast";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchLessons();
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      setLessons(res.data.data || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subject");
      setSubjects(res.data.data || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.classes || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const createLesson = async (e) => {
    e.preventDefault();

    try {
      const teacherId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("subjectId", subjectId);
      formData.append("classId", classId);
      formData.append("teacherId", teacherId);

      if (video) formData.append("video", video);
      if (file) formData.append("file", file);

      await api.post("/lessons", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson created successfully");

      setTitle("");
      setDescription("");
      setSubjectId("");
      setClassId("");
      setVideo(null);
      setFile(null);

      fetchLessons();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <h3 className="mb-4">Create Lesson</h3>

          <form onSubmit={createLesson}>

            <input
              className="form-control mb-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="form-select mb-2"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="form-select mb-2"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) => setVideo(e.target.files[0])}
            />

            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button className="btn btn-success w-100">
              Create Lesson
            </button>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">All Lessons</h5>

          {lessons.length === 0 ? (
            <p className="text-muted">No lessons found</p>
          ) : (
            <div className="row g-3">
              {lessons.map((lesson) => (
                <div key={lesson._id} className="col-md-4">
                  <div className="border rounded-4 p-3 h-100">

                    <h6 className="fw-bold">{lesson.title}</h6>

                    <p className="text-muted small">
                      {lesson.description}
                    </p>

                    <div className="small text-secondary">
                      📚 {lesson.subjectId?.name} <br />
                      🏫 {lesson.classId?.name}
                    </div>

                    {lesson.videoUrl && (
                      <a
                        href={lesson.videoUrl}
                        className="btn btn-sm btn-outline-success mt-2"
                        target="_blank"
                      >
                        Watch Video
                      </a>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Page;