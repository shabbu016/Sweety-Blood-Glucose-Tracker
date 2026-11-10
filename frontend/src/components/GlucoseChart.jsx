
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { Activity } from "lucide-react";

const slotOrder = [
  "morning_fasting",
  "after_breakfast",
  "after_lunch",
  "after_dinner",
];

const slotLabels = {
  morning_fasting: "Fasting",
  after_breakfast: "Breakfast",
  after_lunch: "Lunch",
  after_dinner: "Dinner",
};

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function CustomXAxisTick({ x, y, payload }) {
  const [date, slot] = payload.value.split("|");

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="middle"
        fill="#64748b"
        fontSize={11}
      >
        <tspan x="0" dy="16">{date}</tspan>
        <tspan x="0" dy="15" fontWeight="500">{slot}</tspan>
      </text>
    </g>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const reading = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">
        {reading.slot}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {reading.date}
      </p>
      <p className="mt-2 text-base font-semibold text-teal-700">
        {reading.value} mg/dL
      </p>
    </div>
  );
}

function GlucoseChart({ readings = [] }) {
  const chartData = [...readings]
    .sort((a, b) => {
      const dateComparison = a.reading_date.localeCompare(b.reading_date);

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return (
        slotOrder.indexOf(a.time_slot) -
        slotOrder.indexOf(b.time_slot)
      );
    })
    .map((reading) => {
      const slot = slotLabels[reading.time_slot] || reading.time_slot;

      const date = formatDate(reading.reading_date);

      return {
        date: reading.reading_date,
        slot,
        value: Number(reading.glucose_value),
        axisLabel: `${date}|${slot}`,
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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Glucose Trends
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your recorded blood glucose readings
          </p>
        </div>

        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Activity size={21} />
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
          <Activity size={30} className="mb-3 text-slate-400" />
          <p className="font-medium text-slate-700">
            No trend data available
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add glucose readings to see your trend here.
          </p>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 25, right: 65, left: 15, bottom: 45 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="axisLabel"
                interval={0}
                tick={<CustomXAxisTick />}
                height={55}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[yAxisMin, yAxisMax]}
                ticks={yAxisTicks}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={42}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
              />

              <Line
                type="linear"
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 5, fill: "#0d9488", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  offset={10}
                  style={{
                    fill: "#334155",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  formatter={(value) => `${value}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Values are displayed in mg/dL. This chart shows recorded readings,
        not a medical interpretation.
      </p>
    </section>
  );
}

export default GlucoseChart;
