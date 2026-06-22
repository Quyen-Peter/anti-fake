export default function SellerTopProducts() {
  const products = [
    {
      id: 1,
      name: "Túi xách da",
      sold: "124 lượt bán",
      price: "2.450k",
    },
    {
      id: 4,
      name: "Đồng hồ cơ",
      sold: "90 lượt bán",
      price: "15.800k",
    },
    {
      id: 3,
      name: "Sneaker Limited",
      sold: "76 lượt bán",
      price: "3.200k",
    },
    {
      id: 2,
      name: "Smartphone V-Gold Smartphone V-Gold Smartphone V-Gold",
      sold: "54 lượt bán",
      price: "22.500k",
    },
  ];

  return (
    <div className="seller-top-card">
      <div className="seller-card-header">
        <h3>Bán chạy nhất</h3>
      </div>

      {products.map((p, index) => (
        <div
          key={index}
          className="seller-top-item"
        >
          <img
            src={`https://picsum.photos/60?random=${p.id}`}
            alt=""
          />

          <div className="seller-top-info">
            <h4>{p.name}</h4>
            <span>{p.sold}</span>
          </div>

          <b>{p.price}</b>
        </div>
      ))}
    </div>
  );
}