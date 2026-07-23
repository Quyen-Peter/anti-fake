import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Navigate } from "react-router-dom";
import { getMyShop, type MyShop } from "../services/shop.api";
import {
  SellerShopContext,
  type SellerShopContextValue,
} from "./sellerShopContext";

const getShopStatus = (shop: MyShop) =>
  String(shop.shopStatus ?? "").trim().toLowerCase();

const isRejectedShop = (status: string) =>
  status.includes("reject") ||
  status.includes("declined") ||
  status.includes("failed");

export function SellerShopProvider({ children }: { children: ReactNode }) {
  const [shop, setShop] = useState<MyShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshShop = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const shops = await getMyShop();
      setShop(shops?.[0] ?? null);
    } catch (requestError) {
      setShop(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tải thông tin cửa hàng",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void getMyShop()
      .then((shops) => {
        if (active) setShop(shops?.[0] ?? null);
      })
      .catch((requestError) => {
        if (!active) return;
        setShop(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải thông tin cửa hàng",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<SellerShopContextValue | null>(
    () =>
      shop
        ? {
            shop,
            shopId: shop.id,
            refreshShop,
          }
        : null,
    [refreshShop, shop],
  );

  if (loading) {
    return (
      <main className="seller-access-state" aria-busy="true">
        <div>
          <span className="seller-access-spinner" aria-hidden="true" />
          <h1>Đang tải Seller Center</h1>
          <p>Hệ thống đang xác nhận cửa hàng của bạn.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="seller-access-state" role="alert">
        <div>
          <h1>Không thể tải cửa hàng</h1>
          <p>{error}</p>
          <button type="button" onClick={() => void refreshShop()}>
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  if (!shop) {
    return <Navigate to="/register" replace />;
  }

  const status = getShopStatus(shop);
  if (status !== "verified") {
    if (status === "pending_kyc") {
      return (
        <Navigate
          to="/register"
          replace
          state={{ initialStep: 2, shopId: shop.id }}
        />
      );
    }

    if (status === "pending_verification") {
      return (
        <Navigate
          to="/register"
          replace
          state={{
            initialStep: 3,
            registrationStatus: "pending_kyc",
            shopId: shop.id,
          }}
        />
      );
    }

    if (isRejectedShop(status)) {
      return (
        <Navigate
          to="/register"
          replace
          state={{
            initialStep: 3,
            registrationStatus: "rejected",
            shopId: shop.id,
          }}
        />
      );
    }

    return <Navigate to="/register" replace />;
  }

  return (
    <SellerShopContext.Provider value={value}>
      {children}
    </SellerShopContext.Provider>
  );
}
