import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
} from "lucide-react";
import {
  getShopSummaryMetrics,
  type ShopSummaryMetricsResponse,
} from "../../services/shop.api";
import { formatVnd } from "../../ultil/currency";

type SellerStatsProps = {
  shopId?: string;
};

const getTodayRange = () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
};

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("vi-VN").format(value ?? 0);

const formatChange = (value?: number) => {
  const percent = value ?? 0;
  const prefix = percent > 0 ? "+" : "";
  return `${prefix}${percent}%`;
};

export default function SellerStats({ shopId }: SellerStatsProps) {
  const [metrics, setMetrics] = useState<ShopSummaryMetricsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shopId) return;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        const { from, to } = getTodayRange();
        const data = await getShopSummaryMetrics(shopId, from, to);
        setMetrics(data);
      } catch (error) {
        console.error(error);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [shopId]);

  const stats = useMemo(
    () => [
      {
        title: "Doanh thu",
        value: loading ? "..." : formatVnd(metrics?.revenue?.value ?? 0),
        icon: DollarSign,
        change: formatChange(metrics?.revenue?.growthPercent),
      },
      {
        title: "Đơn hàng",
        value: loading ? "..." : formatNumber(metrics?.orders?.value),
        icon: ShoppingBag,
        change: formatChange(metrics?.orders?.growthPercent),
      },
      {
        title: "Sản phẩm bán ra",
        value: loading ? "..." : formatNumber(metrics?.offers?.value),
        icon: Package,
        change: formatChange(metrics?.offers?.growthPercent),
      },
    ],
    [loading, metrics],
  );

  return (
    <div className="seller-stats-grid">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="seller-stat-card"
          >
            <div className="seller-stat-top">
              <div className="seller-stat-icon">
                <Icon size={18} />
              </div>

              <span className="seller-stat-change">
                {item.change}
              </span>
            </div>

            <p>{item.title}</p>
            <h3>{item.value}</h3>
          </div>
        );
      })}
    </div>
  );
}
