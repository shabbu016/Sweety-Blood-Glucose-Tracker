
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList
} from "recharts";
import { Activity } from "lucide-react";

const slotOrder = [
    "morning_fasting",
    "after_breakfast",
    "after_lunch",
    "after_dinner"
];

const slotLabels = {
    morning_fasting: "Fasting",
    after_breakfast: "Breakfast",
    after_lunch: "Lunch",
    after_dinner: "Dinner"
};

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
}

function CustomXAxisTick({ x, y, payload, dark }) {
    const [date, slot] = payload.value.split("|");

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                textAnchor="middle"
                fill={dark ? "#9AABBA" : "#64748b"}
                fontSize={11}
            >
                <tspan x="0" dy="16">{date}</tspan>
                <tspan x="0" dy="15" fontWeight="500">{slot}</tspan>
            </text>
        </g>
    );
}

function CustomTooltip({ active, payload, dark }) {
    if (!active || !payload || !payload.length) return null;

    const reading = payload[0].payload;

    return (
        <div className={`rounded-xl border px-4 py-3 shadow-xl ${
            dark
                ? "border-slate-600 bg-[#203140] text-white"
                : "border-slate-200 bg-white text-slate-800"
        }`}>
            <p className="text-sm font-semibold">{reading.slot}</p>

            <p className={`mt-1 text-xs ${
                dark ? "text-slate-400" : "text-slate-500"
            }`}>
                {reading.date}
            </p>

            <p className="mt-2 text-lg font-bold text-teal-500">
                {reading.value} mg/dL
            </p>
        </div>
    );
}

function GlucoseChart({ readings = [] }) {
    const dark =
        document.documentElement.classList.contains("dark");

    const chartData = [...readings]
        .sort((a, b) => {
            const dateComparison =
                a.reading_date.localeCompare(b.reading_date);

            if (dateComparison !== 0) return dateComparison;

            return (
                slotOrder.indexOf(a.time_slot) -
                slotOrder.indexOf(b.time_slot)
            );
        })
        .map((reading) => {
            const slot =
                slotLabels[reading.time_slot] || reading.time_slot;

            const date = formatDate(reading.reading_date);

            return {
                date,
                slot,
                value: Number(reading.glucose_value),
                axisLabel: `${date}|${slot}`
            };
        });

    const values = chartData.map((item) => item.value);

    const minimum = values.length ? Math.min(...values) : 80;
    const maximum = values.length ? Math.max(...values) : 160;

    const yAxisMin = Math.min(80, Math.floor(minimum / 10) * 10);
    const yAxisMax = Math.max(160, Math.ceil(maximum / 10) * 10);

    const yAxisTicks = [];

    for (let value = yAxisMin; value <= yAxisMax; value += 10) {
        yAxisTicks.push(value);
    }

    const axisColor = dark ? "#9AABBA" : "#64748b";
    const gridColor = dark ? "#344654" : "#e2e8f0";

    return (
        <div className="w-full">
            {chartData.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-slate-50 text-center dark:bg-slate-800/60">
                    <Activity
                        size={30}
                        className="mb-3 text-slate-400"
                    />

                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                        No trend data available
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Add glucose readings to see your trend here.
                    </p>
                </div>
            ) : (
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 25,
                                right: 35,
                                left: 5,
                                bottom: 45
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 5"
                                vertical={false}
                                stroke={gridColor}
                            />

                            <XAxis
                                dataKey="axisLabel"
                                interval={0}
                                tick={
                                    <CustomXAxisTick dark={dark} />
                                }
                                height={55}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                domain={[yAxisMin, yAxisMax]}
                                ticks={yAxisTicks}
                                tick={{
                                    fontSize: 11,
                                    fill: axisColor
                                }}
                                axisLine={false}
                                tickLine={false}
                                width={42}
                            />

                            <Tooltip
                                content={<CustomTooltip dark={dark} />}
                                cursor={{
                                    stroke: dark ? "#64748b" : "#cbd5e1",
                                    strokeDasharray: "4 4"
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#14b8a6"
                                strokeWidth={3}
                                dot={{
                                    r: 5,
                                    fill: "#14b8a6",
                                    stroke: dark ? "#182634" : "#ffffff",
                                    strokeWidth: 2
                                }}
                                activeDot={{
                                    r: 7,
                                    fill: "#14b8a6",
                                    stroke: dark ? "#182634" : "#ffffff",
                                    strokeWidth: 2
                                }}
                                connectNulls
                            >
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    offset={10}
                                    style={{
                                        fill: dark ? "#E5EDF3" : "#334155",
                                        fontSize: 11,
                                        fontWeight: 600
                                    }}
                                />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Measurements are displayed in mg/dL. This chart presents
                recorded values and does not provide medical interpretation.
            </p>
        </div>
    );
}

export default GlucoseChart;
