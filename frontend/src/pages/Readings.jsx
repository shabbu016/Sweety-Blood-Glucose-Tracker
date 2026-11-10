
import { useEffect, useState } from "react";
import { Activity, Plus, CalendarDays, Clock3, Droplet, RefreshCw, Pencil,Trash2,X} from "lucide-react";
import api from "../services/api";

const timeSlots = [
    { value: "morning_fasting", label: "Morning fasting" },
    { value: "after_breakfast", label: "After breakfast" },
    { value: "after_lunch", label: "After lunch" },
    { value: "after_dinner", label: "After dinner" }
];

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function Readings() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        reading_date: getToday(),
        time_slot: "morning_fasting",
        glucose_value: ""
    });

    const fetchReadings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/readings");
            setReadings(response.data.readings || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your readings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

        setError("");
        setSuccess("");
    };

const handleEdit = (reading) => {
    setEditingId(reading.id);

    setFormData({
        reading_date: reading.reading_date,
        time_slot: reading.time_slot,
        glucose_value: String(reading.glucose_value)
    });

    setError("");
    setSuccess("");
};

const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this reading?"
    );

    if (!confirmed) return;

    try {
        setDeletingId(id);
        setError("");
        setSuccess("");

        await api.delete(`/readings/${id}`);

        setSuccess("Reading deleted successfully.");

        if (editingId === id) {
            setEditingId(null);
            setFormData({
                reading_date: getToday(),
                time_slot: "morning_fasting",
                glucose_value: ""
            });
        }

        await fetchReadings();
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Unable to delete this reading."
        );
    } finally {
        setDeletingId(null);
    }
};

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const value = Number(formData.glucose_value);

        if (!formData.reading_date || !formData.time_slot || !formData.glucose_value) {
            setError("Please complete all fields.");
            return;
        }

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            setError("Enter a whole number between 40 and 600 mg/dL.");
            return;
        }

        try {
            setSubmitting(true);

            if (editingId) {
                    await api.put(`/readings/${editingId}`, {
                        reading_date: formData.reading_date,
                        time_slot: formData.time_slot,
                        glucose_value: value
                    });
                } else {
                    await api.post("/readings", {
                        reading_date: formData.reading_date,
                        time_slot: formData.time_slot,
                        glucose_value: value
                    });
                }

                setSuccess(
                    editingId
                        ? "Reading updated successfully."
                        : "Your glucose reading has been saved successfully."
                );

                setEditingId(null);

                setFormData({
                    reading_date: getToday(),
                    time_slot: "morning_fasting",
                    glucose_value: ""
                });

                await fetchReadings();

            setSuccess("Your glucose reading has been saved successfully.");

            setFormData({
                reading_date: getToday(),
                time_slot: "morning_fasting",
                glucose_value: ""
            });

            await fetchReadings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save your reading."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                        Health records
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Glucose readings
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Record and manage your daily blood glucose levels.
                    </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Activity size={25} />
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <Plus size={21} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Add new reading
                            </h2>
                            <p className="text-xs text-slate-500">
                                Enter your glucose measurement
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Reading date
                            </label>
                            <div className="relative">
                                <CalendarDays
                                    size={18}
                                    className="absolute left-3 top-3.5 text-slate-400"
                                />
                                <input
                                    type="date"
                                    name="reading_date"
                                    value={formData.reading_date}
                                    max={getToday()}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Time slot
                            </label>
                            <div className="relative">
                                <Clock3
                                    size={18}
                                    className="absolute left-3 top-3.5 text-slate-400"
                                />
                                <select
                                    name="time_slot"
                                    value={formData.time_slot}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                >
                                    {timeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Glucose value
                            </label>
                            <div className="relative">
                                <Droplet
                                    size={18}
                                    className="absolute left-3 top-3.5 text-slate-400"
                                />
                                <input
                                    type="number"
                                    name="glucose_value"
                                    value={formData.glucose_value}
                                    onChange={handleChange}
                                    min="40"
                                    max="600"
                                    step="1"
                                    placeholder="Enter value (e.g. 110)"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-20 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                />
                                <span className="absolute right-3 top-3.5 text-xs font-medium text-slate-400">
                                    mg/dL
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                Enter a whole number between 40 and 600.
                            </p>
                        </div>

                        {error && (
                            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        <button
                                type="submit"
                                disabled={submitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {editingId ? <Pencil size={18} /> : <Plus size={18} />}

                                {submitting
                                    ? "Saving reading..."
                                    : editingId
                                        ? "Update reading"
                                        : "Save reading"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            reading_date: getToday(),
                                            time_slot: "morning_fasting",
                                            glucose_value: ""
                                        });
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="w-full rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel editing
                                </button>
                            )}
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Reading history
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Your recorded glucose measurements
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchReadings}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-16 text-center text-sm text-slate-500">
                            Loading your readings...
                        </div>
                    ) : readings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                                <Droplet size={26} />
                            </div>
                            <h3 className="font-semibold text-slate-800">
                                No readings recorded yet
                            </h3>
                            <p className="mt-2 max-w-xs text-sm text-slate-500">
                                Add your first glucose measurement using the form.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        <th className="px-3 py-3">Date</th>
                                        <th className="px-3 py-3">Time slot</th>
                                        <th className="px-3 py-3">Value</th>
                                        <th className="px-3 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {readings.map((reading) => (
                                        <tr
                                            key={reading.id}
                                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                                        >
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                                                {reading.reading_date}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-600">
                                                {timeSlots.find(
                                                    (slot) => slot.value === reading.time_slot
                                                )?.label || reading.time_slot}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-slate-900">
                                                {reading.glucose_value}
                                                <span className="ml-1 text-xs font-normal text-slate-400">
                                                    mg/dL
                                                </span>
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(reading)}
                                                        title="Edit reading"
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(reading.id)}
                                                        disabled={deletingId === reading.id}
                                                        title="Delete reading"
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                                                    >
                                                        {deletingId === reading.id ? (
                                                            <RefreshCw size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Readings;
