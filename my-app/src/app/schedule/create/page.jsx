"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, User, BookOpen, GraduationCap, Clock, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const CreateSchedule = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    day: "Sunday", 
    period: 1, 
    subject: "", 
    teacherName: "", 
    gradeLevel: "10" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // الربط مع الباك-إند الخاص بكم
      await axios.post("http://localhost:5000/api/schedule", {
        ...form,
        period: Number(form.period) // التأكد من إرسال رقم الحصة كـ Number
      });

      toast.success("Schedule Updated Successfully!", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      
      router.push("/schedule");
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to update schedule. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="bg-primary p-4 text-white d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-3">
              <CalendarCheck size={24}/>
            </div>
            <div>
              <h4 className="mb-0 fw-bold">Assign New Lesson Slot</h4>
              <small className="opacity-75">Add a new class to the weekly timetable</small>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-body p-5 bg-white">
            <div className="row g-4">
              
              {/* Day Selection */}
              <div className="col-md-6">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Day of Week</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Clock size={18} className="text-primary"/></span>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    value={form.day} 
                    onChange={e => setForm({...form, day: e.target.value})}
                  >
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Period Selection */}
              <div className="col-md-6">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Class Period</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Clock size={18} className="text-primary"/></span>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    value={form.period} 
                    onChange={e => setForm({...form, period: e.target.value})}
                  >
                    {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>Period {p}</option>)}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="col-12">
                <label className="form-label fw-bold small text-uppercase text-muted mb-2">Subject Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><BookOpen size={18} className="text-primary"/></span>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="e.g. Advanced Mathematics" 
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    required 
                  />
                </div>
              </div>

              {/* Teacher */}
              <div className="col-md-6">
                 <label className="form-label fw-bold small text-uppercase text-muted mb-2">Teacher Name</label>
                 <div className="input-group">
                  <span className="input-group-text bg-light border-0"><User size={18} className="text-primary"/></span>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="Instructor Name" 
                    value={form.teacherName}
                    onChange={e => setForm({...form, teacherName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              {/* Grade Level */}
              <div className="col-md-6">
                 <label className="form-label fw-bold small text-uppercase text-muted mb-2">Grade Level</label>
                 <div className="input-group">
                  <span className="input-group-text bg-light border-0"><GraduationCap size={18} className="text-primary"/></span>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    value={form.gradeLevel} 
                    onChange={e => setForm({...form, gradeLevel: e.target.value})}
                  >
                    {["10", "11", "12"].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 mt-5">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <Save size={20}/> Save Assignment
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="btn btn-light px-4 rounded-pill text-muted fw-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;