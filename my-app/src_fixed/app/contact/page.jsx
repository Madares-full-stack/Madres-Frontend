"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Mail, Phone, MapPin, SendHorizonal } from "lucide-react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div>
      <Toaster />
       <Navbar/>
      <div className="container py-5" style={{ minHeight: "100vh" }}>
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Contact <span className="text-warning">Us</span>
          </h1>

          <p className="text-muted fs-5">
            We'd love to hear from you. Send us your questions or feedback.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100 " style={{backgroundColor:"#031b4d"}}>
              <div className="card-body p-4 text-white">
                <h3 className="fw-bold mb-4">Get In Touch</h3>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center "
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#22c55e",
                      color: "white",
                    }}
                  >
                    <Mail size={22} />
                  </div>

                  <div>
                    <h6 className="fw-bold  mb-1">Email</h6>

                    <p className="text-white mb-0">issaAbuhadhoud@gmail.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4 ">
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#0ea5e9",
                      color: "white",
                    }}
                  >
                    <Phone size={22} />
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">Phone</h6>

                    <p className="mb-0 ">+962 7 9882 4513</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#f97316",
                      color: "white",
                    }}
                  >
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">Address</h6>

                    <p className="mb-0">Amman, Jordan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Send Message</h3>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Name</label>

                      <input
                        type="text"
                        name="name"
                        className="form-control rounded-3"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Email</label>

                      <input
                        type="email"
                        name="email"
                        className="form-control rounded-3"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Subject</label>

                    <input
                      type="text"
                      name="subject"
                      className="form-control rounded-3"
                      placeholder="Message subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Message</label>

                    <textarea
                      name="message"
                      rows="6"
                      className="form-control rounded-3"
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success px-4 py-2 rounded-3 d-flex align-items-center gap-2"
                  >
                    <SendHorizonal size={18} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Page;
