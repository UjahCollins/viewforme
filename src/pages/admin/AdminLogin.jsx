import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/adminAuthApi.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CalendarCheck,
  Users,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-[#17324D] outline-none transition placeholder:text-slate-400 focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberEmail: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAdminAuth();
const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

 

const handleLogin = async (event) => {
  event.preventDefault();
  setError("");

  const email = formData.email.trim().toLowerCase();
  const password = formData.password;

  if (!email) {
    setError("Please enter your email address.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!password) {
    setError("Please enter your password.");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await loginAdmin({
      email,
      password,
    });

    const result =
      response?.data?.success !== undefined
        ? response.data
        : response;

    if (!result?.success) {
      throw new Error(
        result?.message || "Unable to sign in."
      );
    }

    // Verify the session and update shared auth state.
    const currentAdmin = await signIn();

    if (!currentAdmin) {
      throw new Error(
        "Login succeeded, but the administrator session could not be verified."
      );
    }

    navigate("/admin/dashboard", {
      replace: true,
    });
  } catch (error) {
    setError(
      error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials."
    );
  } finally {
    setIsSubmitting(false);
  }
};



  const handlePasswordReset = (event) => {
    event.preventDefault();
    setError("");

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        resetEmail.trim()
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(
      "Password recovery is not available yet. This feature will be enabled when the authentication API is connected."
    );
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword((previous) => !previous);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F6F9FA] lg:grid lg:grid-cols-2">
      {/* LEFT BRANDING PANEL */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#17324D] px-12 py-12 text-white lg:flex lg:flex-col xl:px-20">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full border border-white/10" />

        {/* Logo */}
        <Link
          to="/"
          className="relative z-10 inline-flex w-fit flex-col"
        >
          <span className="text-3xl font-extrabold tracking-tight">
            ViewForMe
            <span className="text-[#78D6C9]">.</span>
          </span>

          <span className="mt-1 text-xs font-medium tracking-[0.16em] text-[#78D6C9]">
            ADMINISTRATION PORTAL
          </span>
        </Link>

        {/* Main content */}
        <div className="relative z-10 my-auto max-w-xl py-20">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <ShieldCheck
              size={31}
              className="text-[#78D6C9]"
            />
          </div>

          <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">
            Manage Every Viewing
            <span className="mt-2 block text-[#78D6C9]">
              With Confidence.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-slate-200">
            Your central workspace for managing
            property viewing requests, coordinating
            local viewers, and keeping operations
            organised.
          </p>

          <div className="mt-12 space-y-6">
            {[
              {
                icon: CalendarCheck,
                title: "Manage Bookings",
                description:
                  "Track property viewing requests and appointment progress.",
              },
              {
                icon: Users,
                title: "Coordinate Viewers",
                description:
                  "Manage your viewer network and assignments.",
              },
              {
                icon: ClipboardCheck,
                title: "Review Reports",
                description:
                  "Organise completed viewing information.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#78D6C9]">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-300">
            ViewForMe — Your Eyes on the Property.
          </p>
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            to="/"
            className="mb-12 inline-block lg:hidden"
          >
            <span className="text-2xl font-extrabold text-[#17324D]">
              ViewForMe
              <span className="text-[#2A9D8F]">.</span>
            </span>

            <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-[#2A9D8F]">
              Admin Portal
            </span>
          </Link>

          {/* Back navigation */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#2A9D8F]"
          >
            <ArrowLeft size={17} />
            Back to Website
          </Link>

          {showForgotPassword ? (
            /* FORGOT PASSWORD FORM */
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F]">
                <Mail size={26} />
              </div>

              <h2 className="mt-7 text-3xl font-extrabold text-[#17324D]">
                Forgot Password?
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Enter the email address associated
                with your administrator account.
                Password recovery will become
                available when the backend
                authentication service is connected.
              </p>

              <form
                onSubmit={handlePasswordReset}
                className="mt-9"
              >
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(event) => {
                      setResetEmail(event.target.value);
                      setError("");
                    }}
                    required
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
                  >
                    <AlertCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <p className="text-sm leading-6 text-amber-800">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-4 font-semibold text-white transition hover:bg-[#238579]"
                >
                  Request Password Reset
                  <ArrowRight size={19} />
                </button>
              </form>

              <button
                type="button"
                onClick={toggleForgotPassword}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F] hover:underline"
              >
                <ArrowLeft size={17} />
                Back to Login
              </button>
            </div>
          ) : (
            /* LOGIN FORM */
            <div>
              <div className="mb-9">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F]">
                  <LockKeyhole size={26} />
                </div>

                <h2 className="text-3xl font-extrabold text-[#17324D] sm:text-4xl">
                  Welcome Back
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Sign in to manage your ViewForMe
                  operations.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="username"
                      placeholder="admin@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="mt-6">
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-password"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2A9D8F]"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER EMAIL / FORGOT PASSWORD */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberEmail"
                      checked={formData.rememberEmail}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#2A9D8F]"
                    />

                    <span className="text-sm text-slate-600">
                      Remember email
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    className="text-sm font-semibold text-[#2A9D8F] transition hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
                  >
                    <AlertCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <p className="text-sm leading-6 text-amber-800">
                      {error}
                    </p>
                  </div>
                )}

                {/* SUBMIT */}
                <button
  type="submit"
  disabled={isSubmitting}
  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-4 font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting ? "Signing In..." : "Sign In"}

  {!isSubmitting && <ArrowRight size={19} />}
</button>

                {/* SECURITY NOTE */}
                <div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[#2A9D8F]"
                  />

                  <p className="text-xs leading-6 text-slate-500">
                    This portal is intended for
                    authorised ViewForMe
                    administrators only.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* COPYRIGHT */}
          <p className="mt-12 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} ViewForMe.
            All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;
