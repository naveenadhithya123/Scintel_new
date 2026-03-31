import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAdminSession } from "../auth/adminAuth";

const API_BASE = "http://localhost:3000/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const targetPath = location.state?.from?.pathname || "/admin";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to sign in");
      }

      saveAdminSession(result);
      navigate(targetPath, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_30%),linear-gradient(135deg,_#f8fafc,_#eef5f7_45%,_#dce8eb)] text-[#023347]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-2xl shadow-[#023347]/10 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-between bg-[#023347] px-8 py-10 text-white md:px-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
                SCINTEL Admin
              </p>
              <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight md:text-5xl">
                Protected controls for announcements, activities, and member management.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/75">
                Public landing pages stay open to visitors. Admin tools unlock only after a valid
                sign-in.
              </p>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-white/80 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Announcements</p>
                <p className="mt-2 text-xs leading-6 text-white/65">Create and edit event pages.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Activities</p>
                <p className="mt-2 text-xs leading-6 text-white/65">Manage batches and event data.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Members</p>
                <p className="mt-2 text-xs leading-6 text-white/65">Maintain association records.</p>
              </div>
            </div>
          </section>

          <section className="flex items-center px-6 py-10 md:px-10">
            <form onSubmit={handleSubmit} className="w-full">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2A8E9E]">
                Login
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#023347]">Admin sign in</h2>
              <p className="mt-3 text-sm leading-6 text-[#023347]/65">
                Use the configured admin email and password to continue.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#023347]/60">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2A8E9E] focus:ring-4 focus:ring-[#2A8E9E]/10"
                    placeholder="admin@scintel.local"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#023347]/60">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2A8E9E] focus:ring-4 focus:ring-[#2A8E9E]/10"
                    placeholder="Enter password"
                  />
                </label>
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button className="transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#023347] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#2A8E9E] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={submitting}
               
              >
                {submitting ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
