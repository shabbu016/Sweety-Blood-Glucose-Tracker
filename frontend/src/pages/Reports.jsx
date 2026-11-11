
import { useEffect, useState } from "react";
import {
    CalendarDays,
    TrendingUp,
    TrendingDown,
    Activity,
    FileBarChart,
    RefreshCw,
    Clock3
} from "lucide-react";
import api from "../services/api";

const timeSlotLabels = {
    morning_fasting: "Morning fasting",
    after_breakfast: "After breakfast",
    after_lunch: "After lunch",
    after_dinner: "After dinner"
};

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function Reports() {
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [dailyReport, setDailyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [previousMonthReport, setPreviousMonthReport] = useState(null);

    const [loading, setLoading] = useState(true);
    const [dailyLoading, setDailyLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDailyReport = async () => {
        try {
            setDailyLoading(true);
            setError("");

            const response = await api.get("/reports/daily", {
                params: { date: selectedDate }
            });

            setDailyReport(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load daily report."
            );
            setDailyReport(null);
        } finally {
            setDailyLoading(false);
        }
    };

    const fetchMonthlyReports = async () => {
        try {
            setLoading(true);
            setError("");

            const [monthlyResponse, previousResponse] = await Promise.all([
                api.get("/reports/monthly"),
                api.get("/reports/previous-month")
            ]);

            setMonthlyReport(monthlyResponse.data);
            setPreviousMonthReport(previousResponse.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load monthly reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyReport();
    }, [selectedDate]);

    useEffect(() => {
        fetchMonthlyReports();
    }, []);

    const handleRefresh = async () => {
        await Promise.all([
            fetchDailyReport(),
            fetchMonthlyReports()
        ]);
    };

    const monthlyCards = [
        {
            title: "Current Month",
            description: "Month-to-date",
            report: monthlyReport
        },
        {
            title: "Previous Month",
            description: "Previous complete calendar month",
            report: previousMonthReport
        }
    ];

    return (
        <main className="min-h-screen bg-[#F5F8F8] p-5 text-slate-900 dark:bg-[#101820] dark:text-slate-100 md:p-8">

            <div className="mx-auto max-w-7xl space-y-8">

                {/* Page heading */}
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-teal-100 p-3 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                            <FileBarChart size={25} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
                                Analytics
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Reports
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Review your daily and monthly glucose records.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading || dailyLoading}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#182634] dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <RefreshCw
                            size={16}
                            className={loading || dailyLoading ? "animate-spin" : ""}
                        />
                        Refresh reports
                    </button>
                </header>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                        {error}
                    </div>
                )}

                {/* Daily report */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#182634]">

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Daily Report
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                View your glucose readings for a selected date.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <CalendarDays
                                className="text-teal-700 dark:text-teal-400"
                                size={20}
                            />

                            <input
                                type="date"
                                value={selectedDate}
                                max={getToday()}
                                onChange={(event) => setSelectedDate(event.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-600 dark:bg-[#203140] dark:text-white"
                            />
                        </div>
                    </div>

                    {dailyLoading ? (
                        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500 dark:text-slate-400">
                            <RefreshCw size={17} className="animate-spin" />
                            Loading daily report...
                        </div>
                    ) : dailyReport ? (
                        <>
                            {/* Total readings */}
                            <div className="mb-6 flex items-center justify-between rounded-xl bg-teal-50 p-5 dark:bg-teal-900/20">
                                <div>
                                    <p className="text-sm font-medium text-teal-800 dark:text-teal-300">
                                        Total readings
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-teal-900 dark:text-teal-200">
                                        {dailyReport.total_readings} / 4
                                    </p>

                                    <p className="mt-1 text-xs text-teal-700 dark:text-teal-400">
                                        Recorded measurements for this date
                                    </p>
                                </div>

                                <Activity
                                    className="text-teal-700 dark:text-teal-400"
                                    size={30}
                                />
                            </div>

                            {/* Daily time slots */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {(dailyReport.slots || []).map((item) => (
                                    <div
                                        key={item.time_slot}
                                        className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm dark:border-slate-700 dark:bg-[#203140]"
                                    >
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <Clock3 size={16} />

                                            <p className="text-sm font-semibold">
                                                {timeSlotLabels[item.time_slot] ||
                                                    item.time_slot.replaceAll("_", " ")}
                                            </p>
                                        </div>

                                        {item.reading ? (
                                            <>
                                                <p className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
                                                    {item.reading.glucose_value}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    mg/dL
                                                </p>

                                                <span className="mt-4 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                                    Recorded
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <p className="mt-5 text-3xl font-semibold text-slate-300 dark:text-slate-600">
                                                    --
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    No reading recorded
                                                </p>

                                                <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                                    Missing
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <Activity
                                size={30}
                                className="mx-auto text-slate-300 dark:text-slate-600"
                            />

                            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                                No daily report available.
                            </p>
                        </div>
                    )}
                </section>

                {/* Monthly overview */}
                <section className="space-y-5">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Monthly Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Compare your current month with the previous month.
                        </p>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-[#182634] dark:text-slate-400">
                            <RefreshCw
                                size={22}
                                className="mx-auto mb-3 animate-spin"
                            />
                            Loading monthly reports...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                            {monthlyCards.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#182634]"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        {/* Highest */}
                                        <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
                                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                                <TrendingUp size={18} />

                                                <span className="text-xs font-semibold">
                                                    Highest
                                                </span>
                                            </div>

                                            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                                                {item.report?.summary?.highest ?? "--"}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                mg/dL
                                            </p>
                                        </div>

                                        {/* Lowest */}
                                        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
                                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                <TrendingDown size={18} />

                                                <span className="text-xs font-semibold">
                                                    Lowest
                                                </span>
                                            </div>

                                            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                                                {item.report?.summary?.lowest ?? "--"}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                mg/dL
                                            </p>
                                        </div>

                                        {/* Average */}
                                        <div className="rounded-xl bg-teal-50 p-4 dark:bg-teal-950/30">
                                            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                                                <Activity size={18} />

                                                <span className="text-xs font-semibold">
                                                    Average
                                                </span>
                                            </div>

                                            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                                                {item.report?.summary?.average ?? "--"}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                mg/dL
                                            </p>
                                        </div>

                                        {/* Total */}
                                        <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-950/30">
                                            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                                                <FileBarChart size={18} />

                                                <span className="text-xs font-semibold">
                                                    Total
                                                </span>
                                            </div>

                                            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                                                {item.report?.summary?.total_readings ?? 0}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                readings
                                            </p>
                                        </div>
                                    </div>

                                    {!item.report && (
                                        <p className="mt-4 text-xs text-slate-400">
                                            Report data is currently unavailable.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}

export default Reports;
