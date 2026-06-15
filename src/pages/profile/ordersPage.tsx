import { useEffect } from "react";

export default function OrdersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <h1>Đơn mua</h1>;
}
