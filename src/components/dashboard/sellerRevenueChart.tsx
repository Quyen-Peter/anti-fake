import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getShopDailyMetrics,
  type ShopDailyMetric,
} from "../../services/shop.api";

type SellerRevenueChartProps = {
  shopId?: string;
};

type ChartPoint = ShopDailyMetric & {
  day: string;
};

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    fromDate: toDateInput(monday),
    toDate: toDateInput(sunday),
  };
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function SellerRevenueChart({ shopId }: SellerRevenueChartProps) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const weekRange = useMemo(getCurrentWeekRange, []);

  useEffect(() => {
    if (!shopId) {
      setData([]);
      return;
    }

    let cancelled = false;

    const loadDailyMetrics = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getShopDailyMetrics(shopId, {
          days: 7,
          fromDate: weekRange.fromDate,
          toDate: weekRange.toDate,
        });

        if (!cancelled) {
          setData(
            response.series.map((item) => ({
              ...item,
              day: item.label || item.date,
            })),
          );
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Khong the tai du lieu doanh thu",
          );
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDailyMetrics();

    return () => {
      cancelled = true;
    };
  }, [shopId, weekRange.fromDate, weekRange.toDate]);

  return (
    <div className="seller-chart-card">
      <div className="seller-card-header">
        <h3>Biểu đồ doanh thu tuần hiện tại</h3>
      </div>

      {loading && (
        <div className="seller-dashboard-orders-state">Dang tai bieu do...</div>
      )}

      {!loading && error && (
        <div className="seller-dashboard-orders-state error">{error}</div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="seller-dashboard-orders-state">
          Chua co du lieu doanh thu trong tuan nay
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => `${Number(value) / 1000000}tr`} />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === "revenue" ? "Doanh thu" : name,
              ]}
              labelFormatter={(_, items) => {
                const payload = items?.[0]?.payload as ChartPoint | undefined;
                return payload
                  ? `${payload.label} - ${payload.orders} don hang`
                  : "";
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#c91c1c"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
