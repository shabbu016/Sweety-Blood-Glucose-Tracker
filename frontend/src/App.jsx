
import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Link,
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Droplets,
    Eye,
    EyeOff,
    HeartPulse,
    Moon,
    ShieldCheck,
    Sun,
    TrendingUp
} from "lucide-react";

import api from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Readings from "./pages/Readings";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";


function useAppTheme() {
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("sweety_theme") === "dark"
    );

    useEffect(() => {
        const root = document.documentElement;
        const theme = isDark ? "dark" : "light";

        // Apply the same theme mechanism used by DashboardLayout.
        root.dataset.theme = theme;
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = theme;

        document.body.style.colorScheme = theme;

        localStorage.setItem("sweety_theme", theme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((current) => !current);
    };

    return { isDark, toggleTheme };
}

// Reusable theme button.
function ThemeButton({ isDark, toggleTheme }) {
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-300 dark:hover:bg-slate-700"
        >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
    );
}

// Shared branding panel.
function BrandPanel({ isDark, toggleTheme, register = false }) {
    return (
        <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 p-12 text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-between xl:p-16">

            <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full border border-white/10" />
            <div className="absolute right-16 top-1/3 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-lg">
                    <HeartPulse size={27} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sweety</h1>
                    <p className="text-xs text-teal-100">
                        Blood Glucose Tracker
                    </p>
                </div>
            </div>

            <div className="relative z-10 max-w-xl">
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-teal-50">
                    <Activity size={16} />
                    Your personal health companion
                </span>

                <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                    {register
                        ? "Start your journey towards better health."
                        : "Understand your numbers. Take charge of your health."}
                </h2>

                <p className="mt-6 max-w-lg text-base leading-8 text-teal-50/90">
                    Track your blood glucose readings, understand your
                    daily patterns, and make informed decisions with
                    your health information in one place.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                        <Droplets size={23} className="mb-4 text-teal-100" />
                        <h3 className="font-semibold">Track readings</h3>
                        <p className="mt-1 text-sm text-teal-100">
                            Keep your daily records organized.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                        <TrendingUp size={23} className="mb-4 text-teal-100" />
                        <h3 className="font-semibold">View progress</h3>
                        <p className="mt-1 text-sm text-teal-100">
                            Understand your glucose trends.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-sm text-teal-100">
                <p>© {new Date().getFullYear()} Sweety</p>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Your health data matters
                </div>
            </div>

            <div className="absolute right-8 top-8">
                <ThemeButton isDark={isDark} toggleTheme={toggleTheme} />
            </div>
        </section>
    );
}

// Authentication page wrapper.
function AuthLayout({ children, isDark, toggleTheme, register = false }) {
    return (
        <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
            <div className="flex min-h-screen">
                <BrandPanel
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    register={register}
                />

                <section className="relative flex min-h-screen w-full items-center justify-center px-5 py-10 lg:w-1/2 lg:px-10">

                    <div className="absolute right-5 top-5 lg:hidden">
                        <ThemeButton
                            isDark={isDark}
                            toggleTheme={toggleTheme}
                        />
                    </div>

                    <div className="w-full max-w-md">

                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
                                <HeartPulse size={25} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Sweety
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Blood Glucose Tracker
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

                            {children}

                        </div>

                        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                            © {new Date().getFullYear()} Sweety. All rights reserved.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

// Login page.
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useAppTheme();

    const successMessage = location.state?.message;

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: formData.email.trim(),
                password: formData.password
            });

            localStorage.setItem("sweety_token", response.data.token);
            localStorage.setItem(
                "sweety_user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard", {
                state: {
                    message: "Login successful! Welcome back to Sweety."
                },
                replace: true
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout isDark={isDark} toggleTheme={toggleTheme}>

            <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <HeartPulse size={26} />
                </div>

                <p className="mb-2 text-sm font-semibold text-teal-700 dark:text-teal-400">
                    WELCOME BACK
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Sign in to Sweety
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Access your health dashboard and continue tracking
                    your progress.
                </p>
            </div>

            {successMessage && (
                <div className="mb-5 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <CheckCircle2 size={18} className="shrink-0" />
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label
                        htmlFor="login-email"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Email address
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                </div>

                <div>
                    <label
                        htmlFor="login-password"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                        >
                            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400">NEW TO SWEETY?</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-teal-950/30 dark:hover:text-teal-300"
            >
                Create an account
            </Link>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <ShieldCheck size={15} />
                Your account information is protected.
            </p>

        </AuthLayout>
    );
}

// Registration page.
function Register() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useAppTheme();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const password = formData.password;

    const passwordChecks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];

    const strength = passwordChecks.filter(Boolean).length;

    const strengthLabel = [
        "Very weak",
        "Very weak",
        "Weak",
        "Fair",
        "Good",
        "Strong"
    ][strength];

    const strengthColor = [
        "bg-slate-200",
        "bg-red-500",
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-emerald-500"
    ][strength];

    const handleChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const { name, email, password, confirmPassword } = formData;

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (strength < 5) {
            setError("Please meet all password strength requirements.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password
            });

            navigate("/login", {
                state: {
                    message: "Account created successfully. Please sign in."
                }
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            isDark={isDark}
            toggleTheme={toggleTheme}
            register
        >

            <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <HeartPulse size={26} />
                </div>

                <p className="mb-2 text-sm font-semibold text-teal-700 dark:text-teal-400">
                    GET STARTED
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Join Sweety and start organizing your glucose readings.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label
                        htmlFor="register-name"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Full name
                    </label>

                    <input
                        id="register-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                </div>

                <div>
                    <label
                        htmlFor="register-email"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Email address
                    </label>

                    <input
                        id="register-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                </div>

                <div>
                    <label
                        htmlFor="register-password"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {password && (
                        <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Password strength
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    {strengthLabel}
                                </span>
                            </div>

                            <div className="flex gap-1.5">
                                {passwordChecks.map((check, index) => (
                                    <div
                                        key={index}
                                        className={`h-1.5 flex-1 rounded-full ${
                                            check ? strengthColor : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                                {[
                                    "At least 8 characters",
                                    "One uppercase letter",
                                    "One lowercase letter",
                                    "One number",
                                    "One special character"
                                ].map((label, index) => (
                                    <p
                                        key={label}
                                        className={`text-xs ${
                                            passwordChecks[index]
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {passwordChecks[index] ? "✓" : "○"} {label}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="register-confirm-password"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Confirm password
                    </label>

                    <div className="relative">
                        <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((value) => !value)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                        >
                            {showConfirmPassword
                                ? <EyeOff size={18} />
                                : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-teal-700 hover:underline dark:text-teal-400"
                >
                    Sign in
                </Link>
            </p>

        </AuthLayout>
    );
}

// Application routes.
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="readings" element={<Readings />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
