
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Activity,
    ChartNoAxesCombined,
    ChevronLeft,
    ChevronRight,
    HeartPulse,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Sun,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Readings", path: "/dashboard/readings", icon: Activity },
    { label: "Reports", path: "/dashboard/reports", icon: ChartNoAxesCombined },
    { label: "Profile", path: "/dashboard/profile", icon: UserRound },
];

function DashboardLayout() {
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Initialize from the user's saved preference.
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("sweety_theme") === "dark"
    );

    // Apply the theme to the entire application.
    useEffect(() => {
        const root = document.documentElement;
        const theme = isDark ? "dark" : "light";

        root.dataset.theme = theme;
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = theme;

        document.body.style.colorScheme = theme;

        localStorage.setItem("sweety_theme", theme);
    }, [isDark]);

    // Change theme when the button is clicked.
    const toggleTheme = () => {
        setIsDark((current) => !current);
    };

    // Retrieve user information safely.
    let user = {};

    try {
        user = JSON.parse(localStorage.getItem("sweety_user") || "{}");
    } catch {
        user = {};
    }

    const name =
        typeof user.name === "string" && user.name.trim()
            ? user.name.trim()
            : "User";

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

    // Logout.
    const logout = () => {
        localStorage.removeItem("sweety_token");
        localStorage.removeItem("sweety_user");
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#F5F8F8] text-slate-900 transition-colors duration-200 dark:bg-[#101820] dark:text-slate-100">

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-[#17232D] ${
                    collapsed ? "lg:w-20" : "lg:w-64"
                } ${
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Brand and theme toggle */}
                <div
                    className={`relative flex shrink-0 border-b border-slate-100 dark:border-slate-700 ${
                        collapsed
                            ? "h-28 flex-col items-center justify-center gap-1 px-2"
                            : "h-20 items-center justify-between px-5"
                    }`}
                >
                    {/* Brand */}
                    <div
                        className={`flex items-center ${
                            collapsed ? "justify-center" : "gap-3"
                        }`}
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white">
                            <HeartPulse size={25} strokeWidth={2.2} />
                        </div>

                        {!collapsed && (
                            <div>
                                <p className="text-xl font-extrabold tracking-tight text-[#163B3D] dark:text-white">
                                    sweety<span className="text-teal-600">.</span>
                                </p>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Health companion
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`relative z-50 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 ${
                            collapsed ? "h-8 w-8" : ""
                        }`}
                        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        aria-pressed={isDark}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Mobile close button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-7">
                    {!collapsed && (
                        <p className="mb-4 px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Workspace
                        </p>
                    )}

                    <nav className="space-y-1.5">
                        {navigation.map(({ label, path, icon: Icon }) => (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === "/dashboard"}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={20} strokeWidth={1.9} />
                                {!collapsed && <span>{label}</span>}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Sidebar footer */}
                <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-700">
                    {!collapsed && (
                        <div className="mb-4 flex items-start gap-3 rounded-xl bg-teal-50 p-3 dark:bg-teal-900/30">
                            <ShieldCheck
                                size={20}
                                className="shrink-0 text-teal-700 dark:text-teal-400"
                            />

                            <p className="text-xs leading-5 text-teal-800 dark:text-teal-300">
                                Your glucose records are private to your account.
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={logout}
                        title={collapsed ? "Sign out" : undefined}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                    >
                        <LogOut size={20} />
                        {!collapsed && "Sign out"}
                    </button>
                </div>
            </aside>

            {/* Main application area */}
            <div
                className={`min-h-screen transition-all duration-300 ${
                    collapsed ? "lg:ml-20" : "lg:ml-64"
                }`}
            >
                {/* Top header */}
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/95 px-5 backdrop-blur transition-colors dark:border-slate-700 dark:bg-[#17232D] md:px-8">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>

                        {/* Desktop sidebar collapse */}
                        <button
                            type="button"
                            onClick={() => setCollapsed((current) => !current)}
                            className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:block"
                            aria-label="Toggle sidebar"
                            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? (
                                <ChevronRight size={20} />
                            ) : (
                                <ChevronLeft size={20} />
                            )}
                        </button>

                        {/* Workspace title */}
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Health workspace
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Your personal glucose tracker
                            </p>
                        </div>
                    </div>

                    {/* User information */}
                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                {name}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Personal account
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                            {initials || <UserRound size={20} />}
                        </div>
                    </div>
                </header>

                {/* Nested page content */}
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
