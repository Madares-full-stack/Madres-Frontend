"use client";

import { useState } from "react";
import api from "@/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  return (
    <>
      <style>{`
        body { background: #f1f5f9; font-family: 'Segoe UI', sans-serif; }
        .register-card {
          max-width: 520px;
          margin: 2.5rem auto;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #fff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .register-header {
          background: #1e293b;
          padding: 2rem 2.25rem 1.75rem;
          color: #fff;
        }
        .register-header .brand-icon {
          width: 40px; height: 40px;
          background: #3b82f6;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }
        .register-header h2 { font-size: 1.35rem; font-weight: 600; margin: 0 0 0.25rem; }
        .register-header p { font-size: 0.875rem; color: #94a3b8; margin: 0; }
        .register-body { padding: 1.75rem 2.25rem 2rem; }
        .form-label { font-size: 0.8125rem; font-weight: 500; color: #475569; margin-bottom: 0.35rem; }
        .form-control, .form-select {
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 0.9rem;
          padding: 0.55rem 0.85rem;
          color: #1e293b;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-control:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .form-control.is-valid { border-color: #22c55e; }
        .form-control.is-invalid, .form-select.is-invalid { border-color: #ef4444; }
        .input-group .form-control { border-right: none; border-radius: 8px 0 0 8px !important; }
        .btn-eye {
          border: 1px solid #cbd5e1;
          border-left: none;
          background: #f8fafc;
          color: #64748b;
          border-radius: 0 8px 8px 0;
          padding: 0 0.75rem;
          cursor: pointer;
          transition: color 0.15s;
        }
        .btn-eye:hover { color: #3b82f6; }
        .strength-bar { height: 4px; border-radius: 2px; background: #e2e8f0; margin-top: 6px; overflow: hidden; }
        .strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
        .strength-label { font-size: 0.72rem; color: #94a3b8; margin-top: 3px; text-align: right; }
        .btn-register {
          background: #3b82f6;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.65rem;
          width: 100%;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-register:hover:not(:disabled) { background: #2563eb; }
        .btn-register:active { transform: scale(0.99); }
        .btn-register:disabled { opacity: 0.7; cursor: not-allowed; }
        .invalid-feedback { font-size: 0.77rem; }
        .terms-text { font-size: 0.78rem; color: #94a3b8; text-align: center; margin-top: 0.9rem; }
        .terms-text a, .signin-text a { color: #3b82f6; text-decoration: none; }
        .terms-text a:hover, .signin-text a:hover { text-decoration: underline; }
        .signin-text { font-size: 0.84rem; color: #64748b; text-align: center; margin-top: 1.25rem; }
      `}</style>

      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2>Create your account</h2>
          <p>Join thousands of users already on the platform</p>
        </div>

        {/* Body */}
        <div className="register-body">
          <form onSubmit={handleSubmit} noValidate>

            {/* First & Last Name */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label" htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`form-control ${errors.firstName ? "is-invalid" : form.firstName ? "is-valid" : ""}`}
                  placeholder="Ahmed"
                  value={form.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`form-control ${errors.lastName ? "is-invalid" : form.lastName ? "is-valid" : ""}`}
                  placeholder="Al-Rashid"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : form.email ? "is-valid" : ""}`}
                placeholder="ahmed@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label" htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                className={`form-select ${errors.role ? "is-invalid" : form.role ? "is-valid" : ""}`}
                value={form.role}
                onChange={handleChange}
              >
                <option value="" disabled>Select your role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Administrator</option>
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>

            {/* Password */}
            <div className="mb-1">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : form.password ? "is-valid" : ""}`}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                />
                <button type="button" className="btn-eye" onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <>
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <div className="strength-label" style={{ color }}>{label}</div>
                </>
              )}
              {errors.password && <div className="invalid-feedback d-block" style={{ fontSize: "0.77rem" }}>{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="mb-3 mt-3">
              <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
              <div className="input-group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : form.confirmPassword ? "is-valid" : ""}`}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button type="button" className="btn-eye" onClick={() => setShowConfirm((p) => !p)}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              {errors.confirmPassword && <div className="invalid-feedback d-block" style={{ fontSize: "0.77rem" }}>{errors.confirmPassword}</div>}
            </div>

            {/* Terms */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className={`form-check-input ${errors.agreeTerms ? "is-invalid" : ""}`}
                id="agreeTerms"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="agreeTerms" style={{ fontSize: "0.83rem", color: "#475569" }}>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
              {errors.agreeTerms && <div className="invalid-feedback">{errors.agreeTerms}</div>}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="terms-text">
              By registering, you agree to receive platform updates and notifications.
            </p>
            <p className="signin-text">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}