
import { useEffect, useState } from "react";
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
            label: "Highest Reading",
            value: summary.highest ?? "--",
            icon: "↑",
            color: "text-rose-600",
            background: "bg-rose-50"
        },
        {
            label: "Lowest Reading",
            value: summary.lowest ?? "--",
            icon: "↓",
            color: "text-blue-600",
            background: "bg-blue-50"
        },
        {
            label: "Average Reading",
            value: summary.average ?? "--",
            icon: "↗",
            color: "text-teal-700",
            background: "bg-teal-50"
        },
        {
            label: "Total Readings",
            value: summary.total_readings,
            icon: "◷",
            color: "text-violet-600",
            background: "bg-violet-50"
        }
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
                Loading your dashboard...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-5 md:p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-teal-700">
                            SWEETY HEALTH TRACKER
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            Good to see you, {user.name || "User"}!
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Here's your blood glucose overview.
                        </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                </header>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">
                                    {item.label}
                                </p>
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${item.background} ${item.color}`}>
                                    {item.icon}
                                </span>
                            </div>

                            <div className="mt-5 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-900">
                                    {item.value}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {item.label === "Total Readings" ? "records" : "mg/dL"}
                                </span>
                            </div>
                        </div>
                    ))}
                    </section>

                    <div className="mb-8">
                        <GlucoseChart readings={readings} />
                    </div>

                    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Readings
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest blood glucose records.
                                </p>
                            </div>
                        </div>

                    {readings.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="font-medium text-slate-700">
                                No readings yet
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Add your first blood glucose reading to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Time slot</th>
                                        <th className="px-4 py-3">Glucose value</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {readings.slice(0, 8).map((reading) => (
                                        <tr
                                            key={reading.id}
                                            className="border-b border-slate-50 last:border-0"
                                        >
                                            <td className="px-4 py-4 text-sm text-slate-600">
                                                {reading.reading_date}
                                            </td>
                                            <td className="px-4 py-4 text-sm capitalize text-slate-600">
                                                {reading.time_slot.replaceAll("_", " ")}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                                                {reading.glucose_value} mg/dL
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
