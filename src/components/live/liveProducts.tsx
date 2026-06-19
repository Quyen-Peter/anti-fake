import LiveProductCard from "./liveProductCard";


const products = [
  {
    id: 1,
    name: "Jordan 1 Retro High OG",
    price: "12,500,000đ",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 2,
    name: "Rolex Submariner Date",
    price: "380,000,000đ",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
  },
  {
    id: 3,
    name: "Louis Vuitton Brazza",
    price: "22,000,000đ",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93",
  },
];

export default function LiveProducts() {
  return (
    <div className="live-products">
      <div className="live-products-header">
        <h3>Sản phẩm đang giới thiệu</h3>

        <span>{products.length} sản phẩm</span>
      </div>

      <div className="live-products-grid">
        {products.map((product) => (
          <LiveProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}