
import { useNavigate } from "react-router-dom";
import {
    UserRound,
    Mail,
    ShieldCheck,
    ArrowLeft,
    CircleUserRound,
    LockKeyhole,
    Activity,
    ChevronRight
} from "lucide-react";

function Profile() {
    const navigate = useNavigate();

    // Retrieve the logged-in user's information
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

    const email =
        typeof user.email === "string" && user.email.trim()
            ? user.email.trim()
            : "Email not available";

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <main className="min-h-screen bg-[#F5F8F8] p-5 text-slate-900 dark:bg-[#101820] dark:text-slate-100 md:p-8">

            <div className="mx-auto w-full max-w-5xl space-y-7">

                {/* Page heading */}
                <header>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
                        <UserRound size={15} />
                        Account settings
                    </div>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Manage and view your account information.
                    </p>
                </header>

                {/* Main profile card */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#182634]">

                    {/* Compact profile banner */}
                    <div className="relative flex h-32 items-center justify-between overflow-hidden bg-gradient-to-r from-[#075E59] via-[#078F83] to-[#12B8A6] px-7 md:px-9">

                        <div className="relative z-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">
                                Sweety Health Companion
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-white">
                                Your personal account
                            </h2>

                            <p className="mt-1 text-sm text-teal-50">
                                Your profile at a glance
                            </p>
                        </div>

                        <div className="absolute -right-8 -top-16 h-52 w-52 rounded-full border border-white/15" />

                        <div className="absolute -right-2 -bottom-28 h-52 w-52 rounded-full border border-white/15" />

                        <div className="relative z-10 hidden rounded-2xl bg-white/15 p-4 text-white backdrop-blur-sm sm:block">
                            <CircleUserRound size={34} />
                        </div>
                    </div>

                    {/* Profile identity */}
                    <div className="px-6 pb-7 md:px-9">

                        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 py-6 dark:border-slate-700">

                            {/* Avatar */}
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-2xl font-bold text-teal-800 ring-4 ring-white dark:bg-teal-900 dark:text-teal-200 dark:ring-[#182634]">
                                {initials || <UserRound size={32} />}
                            </div>

                            {/* Name and email */}
                            <div className="min-w-0 flex-1">
                                <h2 className="break-words text-xl font-bold text-slate-900 dark:text-white">
                                    {name}
                                </h2>

                                <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                                    {email}
                                </p>

                                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                    Account details
                                </div>
                            </div>
                        </div>

                        {/* Personal information */}
                        <div className="pt-7">
                            <div className="mb-5">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                    Personal information
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Information associated with your account.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">

                                {/* Full name */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-teal-200 dark:border-slate-700 dark:bg-[#203140] dark:hover:border-teal-800">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white p-2.5 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                            <UserRound size={19} />
                                        </div>

                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Full name
                                        </span>
                                    </div>

                                    <p className="mt-4 break-words text-base font-semibold text-slate-900 dark:text-white">
                                        {name}
                                    </p>
                                </div>

                                {/* Email address */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-teal-200 dark:border-slate-700 dark:bg-[#203140] dark:hover:border-teal-800">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white p-2.5 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                            <Mail size={19} />
                                        </div>

                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Email address
                                        </span>
                                    </div>

                                    <p className="mt-4 break-all text-base font-semibold text-slate-900 dark:text-white">
                                        {email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy information */}
                <section className="rounded-2xl border border-teal-100 bg-teal-50 p-5 dark:border-teal-900/60 dark:bg-teal-950/30">
                    <div className="flex items-start gap-4">

                        <div className="shrink-0 rounded-xl bg-white p-3 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                            <ShieldCheck size={23} />
                        </div>

                        <div>
                            <h3 className="font-bold text-teal-900 dark:text-teal-200">
                                Your account privacy
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-teal-800 dark:text-teal-300">
                                Your glucose readings are associated with your
                                authenticated account. The application uses
                                account-based access to protect your records.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Account information */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#182634]">
                    <div className="flex items-start gap-4">

                        <div className="shrink-0 rounded-xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            <LockKeyhole size={21} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Account information
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Your profile details are displayed from your
                                signed-in account. Profile editing is not
                                currently available.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-[#101820]"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <Activity size={15} />
                        Sweety Blood Glucose Tracker
                        <ChevronRight size={13} />
                        Profile
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Profile;
