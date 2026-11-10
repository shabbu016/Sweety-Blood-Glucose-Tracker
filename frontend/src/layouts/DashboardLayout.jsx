import { useState } from "react";
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
    ShieldCheck,
    UserRound,
    X
} from "lucide-react";

const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Readings", path: "/dashboard/readings", icon: Activity },
    { label: "Reports", path: "/reports", icon: ChartNoAxesCombined },
    { label: "Profile", path: "/profile", icon: UserRound }
];

function DashboardLayout() {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem("sweety_user") || "{}");
    const name = user.name || "User";
    const initials = name
        .split(" ")
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const logout = () => {
        localStorage.removeItem("sweety_token");
        localStorage.removeItem("sweety_user");
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#F5F8F8] text-slate-900">
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
                    collapsed ? "lg:w-20" : "lg:w-64"
                } w-64 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white">
                            <HeartPulse size={25} strokeWidth={2.2} />
                        </div>
                        {!collapsed && (
                            <div>
                                <p className="text-xl font-extrabold tracking-tight text-[#163B3D]">
                                    sweety<span className="text-teal-600">.</span>
                                </p>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Health companion
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="text-slate-500 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 px-3 py-7">
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
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-teal-50 text-teal-700"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <Icon size={20} strokeWidth={1.9} />
                                {!collapsed && <span>{label}</span>}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-slate-100 p-4">
                    {!collapsed && (
                        <div className="mb-4 flex items-start gap-3 rounded-xl bg-teal-50 p-3">
                            <ShieldCheck size={20} className="shrink-0 text-teal-700" />
                            <p className="text-xs leading-5 text-teal-800">
                                Your glucose records are private to your account.
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                        <LogOut size={20} />
                        {!collapsed && "Sign out"}
                    </button>
                </div>
            </aside>

            <div
                className={`min-h-screen transition-all duration-300 ${
                    collapsed ? "lg:ml-20" : "lg:ml-64"
                }`}
            >
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/95 px-5 backdrop-blur md:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:block"
                            aria-label="Toggle sidebar"
                        >
                            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Health workspace
                            </p>
                            <p className="text-xs text-slate-400">
                                Your personal glucose tracker
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">Personal account</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                            {initials}
                        </div>
                    </div>
                </header>

                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
