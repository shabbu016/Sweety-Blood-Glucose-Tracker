
import { useEffect, useState } from "react";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    BarChart3,
    CalendarDays,
    Droplets
} from "lucide-react";

import api from "../services/api";
import GlucoseChart from "../components/GlucoseChart";

function Dashboard() {
    const [summary, setSummary] = useState({
        highest: null,
        lowest: null,
        average: null,
        total_readings: 0
    });

    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [summaryResponse, readingsResponse] = await Promise.all([
                    api.get("/reports/summary"),
                    api.get("/readings")
                ]);

                setSummary(summaryResponse.data.summary);
                setReadings(readingsResponse.data.readings || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const user = JSON.parse(localStorage.getItem("sweety_user") || "{}");

    const stats = [
        {
            label: "Highest reading",
            value: summary.highest ?? "--",
            unit: "mg/dL",
            icon: TrendingUp,
            color: "text-rose-600 dark:text-rose-300",
            background: "bg-rose-50 dark:bg-rose-950/40"
        },
        {
            label: "Lowest reading",
            value: summary.lowest ?? "--",
            unit: "mg/dL",
            icon: TrendingDown,
            color: "text-blue-600 dark:text-blue-300",
            background: "bg-blue-50 dark:bg-blue-950/40"
        },
        {
            label: "Average reading",
            value: summary.average ?? "--",
            unit: "mg/dL",
            icon: Activity,
            color: "text-teal-700 dark:text-teal-300",
            background: "bg-teal-50 dark:bg-teal-950/40"
        },
        {
            label: "Total readings",
            value: summary.total_readings,
            unit: "records",
            icon: BarChart3,
            color: "text-violet-600 dark:text-violet-300",
            background: "bg-violet-50 dark:bg-violet-950/40"
        }
    ];

    if (loading) {
        return (
            <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-[#101820]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Loading your health overview...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F8F8] p-5 text-slate-900 dark:bg-[#101820] dark:text-slate-100 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Welcome section */}
                <section className="flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-teal-500" />
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
                                Sweety health tracker
                            </p>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
                            Good to see you, {user.name || "User"}!
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Here's an overview of your recorded blood glucose readings.
                        </p>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-xl font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                </section>

                {/* Error message */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Summary cards */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                            Glucose overview
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Summary of your recorded measurements
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.label}
                                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-[#182634]"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {item.label}
                                        </p>

                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.background} ${item.color}`}>
                                            <Icon size={19} strokeWidth={2} />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {item.value}
                                        </span>

                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                            {item.unit}
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Trend chart */}
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#182634] md:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Activity size={19} className="text-teal-600 dark:text-teal-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Glucose trends
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Your recorded blood glucose measurements
                            </p>
                        </div>
                    </div>

                    <GlucoseChart readings={readings} />
                </section>

                {/* Recent readings */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-[#182634]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-700 md:p-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <Droplets size={19} className="text-teal-600 dark:text-teal-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Recent readings
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Your latest recorded measurements
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                            <CalendarDays size={15} />
                            Latest records
                        </div>
                    </div>

                    {readings.length === 0 ? (
                        <div className="px-5 py-14 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                <Droplets size={25} />
                            </div>

                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                No readings recorded yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Your blood glucose records will appear here once added.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Time slot</th>
                                        <th className="px-5 py-4">Glucose value</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {readings.slice(0, 8).map((reading) => (
                                        <tr
                                            key={reading.id}
                                            className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0 dark:border-slate-700 dark:hover:bg-slate-800/60"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {reading.reading_date}
                                            </td>

                                            <td className="px-5 py-4 text-sm capitalize text-slate-600 dark:text-slate-300">
                                                {reading.time_slot.replaceAll("_", " ")}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {reading.glucose_value}
                                                </span>
                                                <span className="ml-1 text-xs text-slate-400">
                                                    mg/dL
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Dashboard;
