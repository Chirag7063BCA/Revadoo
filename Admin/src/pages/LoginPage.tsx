import React from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ADMIN_CREDENTIALS, isAdminAuthenticated, loginAdmin } from "../utils/adminAuth";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof LoginFormData;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await loginAdmin({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setErrorMessage(result.message || "Only the fixed admin credentials can access this dashboard.");
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-950">
      
      {/* LEFT SIDE (BLACK) */}
      <div className="hidden md:flex w-2/5 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.28),_transparent_45%),linear-gradient(160deg,_#09090b_0%,_#18181b_100%)] text-white flex-col justify-between p-12">
        <div>
          <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
            Revadoo Admin
          </div>
          <h1 className="mt-8 max-w-sm text-5xl font-bold leading-tight">
            Secure access for the admin dashboard only.
          </h1>
          <p className="mt-5 max-w-md text-base text-zinc-300">
            Use the fixed admin email and password to continue. Any other credentials will be blocked from entering the dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Allowed credentials</p>
          <p className="mt-4 text-sm text-zinc-300">
            Email: <span className="font-semibold text-white">{ADMIN_CREDENTIALS.email}</span>
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            Password: <span className="font-semibold text-white">{ADMIN_CREDENTIALS.password}</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (WHITE) */}
      <div className="flex w-full md:w-3/5 bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_35%,_#fff1e6_100%)] justify-center items-center p-6">
        <div className="w-full max-w-md rounded-[28px] border border-orange-100 bg-white p-8 shadow-[0_25px_80px_rgba(120,53,15,0.12)]">
          
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
              Admin sign in
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-gray-900">Login</h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter the fixed admin credentials to open the dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            ) : null}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 py-3 text-white font-semibold transition duration-300 hover:bg-orange-600"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            This page allows access for one admin user only.
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
