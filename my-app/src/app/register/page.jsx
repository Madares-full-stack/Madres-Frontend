"use client";

import { useState } from "react";
import api from "@/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";


export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthMeta = () => {
    const score = getStrength(form.password);
    const pct = Math.min(100, score * 20);
    const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
    const labels = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"];
    return {
      pct,
      color: form.password ? colors[Math.max(1, score)] : "",
      label: form.password ? labels[Math.max(1, score)] : "",
    };
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim() || form.firstName.length < 2)
      newErrors.firstName = "Please enter your first name.";
    if (!form.lastName.trim() || form.lastName.length < 2)
      newErrors.lastName = "Please enter your last name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email.";
    if (!form.role)
      newErrors.role = "Please select a role.";
    if (getStrength(form.password) < 2 || form.password.length < 8)
      newErrors.password = "Password is too weak.";
    if (form.confirmPassword !== form.password || !form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!form.agreeTerms)
      newErrors.agreeTerms = "You must agree before registering.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const { pct, color, label } = strengthMeta();

  const EyeOpen = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOff = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="register-page">
      <Toaster />
      <div className="row g-0 min-vh-100">

        <div className="col-lg-5 register-left d-none d-lg-flex">
          <div className="logo">Mad<span>ares</span></div>
          <p className="tagline">School Management System</p>
          <img
            src="/jaredd-craig-HH4WBGNyltc-unsplash.jpg"
            alt="school"
            className="img-fluid"
          />
        </div>

        <div className="col-lg-7 register-right">
          <div className="register-card">

            <div className="brand-circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>

            <h2>Create your account</h2>
            <p className="sub">Join thousands of users already on the platform</p>

            <form onSubmit={handleSubmit} noValidate>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label" htmlFor="firstName">First name</label>
                  <input
                    id="firstName" name="firstName" type="text"
                    className={`form-control ${errors.firstName ? "is-invalid" : form.firstName ? "is-valid" : ""}`}
                    placeholder="Ahmed"
                    value={form.firstName} onChange={handleChange}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label" htmlFor="lastName">Last name</label>
                  <input
                    id="lastName" name="lastName" type="text"
                    className={`form-control ${errors.lastName ? "is-invalid" : form.lastName ? "is-valid" : ""}`}
                    placeholder="Al-Rashid"
                    value={form.lastName} onChange={handleChange}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                  id="email" name="email" type="email"
                  className={`form-control ${errors.email ? "is-invalid" : form.email ? "is-valid" : ""}`}
                  placeholder="ahmed@example.com"
                  value={form.email} onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="role">Role</label>
                <select
                  id="role" name="role"
                  className={`form-select ${errors.role ? "is-invalid" : form.role ? "is-valid" : ""}`}
                  value={form.role} onChange={handleChange}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
              </div>

              <div className="mb-1">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-group">
                  <input
                    id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? "is-invalid" : form.password ? "is-valid" : ""}`}
                    placeholder="Min. 8 characters"
                    value={form.password} onChange={handleChange}
                  />
                  <button type="button" className="btn-eye" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {form.password && (
                  <>
                    <div className="strength-bar">
                      <div className="strength-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <div className="strength-label" style={{ color }}>{label}</div>
                  </>
                )}
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>

              <div className="mb-3 mt-3">
                <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                <div className="input-group">
                  <input
                    id="confirmPassword" name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : form.confirmPassword ? "is-valid" : ""}`}
                    placeholder="Repeat password"
                    value={form.confirmPassword} onChange={handleChange}
                  />
                  <button type="button" className="btn-eye" onClick={() => setShowConfirm((p) => !p)}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className={`form-check-input ${errors.agreeTerms ? "is-invalid" : ""}`}
                  id="agreeTerms" name="agreeTerms"
                  checked={form.agreeTerms} onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="agreeTerms" style={{ fontSize: "13px", color: "#475569" }}>
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
                {errors.agreeTerms && <div className="invalid-feedback">{errors.agreeTerms}</div>}
              </div>

              <button type="submit" className="btn-register" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </button>

              <p className="footer-txt">
                By registering, you agree to receive platform updates and notifications.
              </p>
              <p className="signin-txt">
                Already have an account? <a href="/login">Sign in</a>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
