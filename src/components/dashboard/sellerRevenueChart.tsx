import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SellerRevenueChart() {
  const data = [
    { day: "T2", value: 12 },
    { day: "T3", value: 18 },
    { day: "T4", value: 10 },
    { day: "T5", value: 2 },
    { day: "T6", value: 24 },
    { day: "T7", value: 35 },
    { day: "CN", value: 50 },
  ];

  return (
    <div className="seller-chart-card">
      <div className="seller-card-header">
        <h3>Biểu đồ doanh thu (7 ngày qua)</h3>
      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#c91c1c"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}