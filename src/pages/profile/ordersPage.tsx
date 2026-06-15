import OrderCard from "../../components/order/orderCard";

export default function OrdersPage() {
  const mockOrders = [
    {
      id: "1",
      orderCode: "DH250615001",
      status: "ĐANG GIAO HÀNG",
      shopName: "Apple Flagship Store",
      totalAmount: 32990000,
      paymentMethod: "VNPay",

      firstProduct: {
        name: "iPhone 15 Pro Max 256GB",
        variant: "Titan Tự Nhiên, 256GB",
        quantity: 1,
        price: 27490000,
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d3b66?w=400",
      },

      otherProducts: 2,
    },

    {
      id: "2",
      orderCode: "DH250615002",
      status: "HOÀN THÀNH",
      shopName: "Sony Official Store",
      totalAmount: 8490000,
      paymentMethod: "Momo",

      firstProduct: {
        name: "Tai nghe Sony WH-1000XM5",
        variant: "Đen",
        quantity: 1,
        price: 8490000,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },

      otherProducts: 0,
    },

    {
      id: "3",
      orderCode: "DH250615003",
      status: "CHỜ XÁC NHẬN",
      shopName: "Samsung Official Store",
      totalAmount: 22990000,
      paymentMethod: "COD",

      firstProduct: {
        name: "Samsung Galaxy S25 Ultra",
        variant: "Titan Gray, 512GB",
        quantity: 1,
        price: 21990000,
        image:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      },

      otherProducts: 1,
    },
  ];

  return (
    <div>
      {mockOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
