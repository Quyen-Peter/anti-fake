type Props = {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
};

export default function LiveProductCard({
  product,
}: Props) {
  return (
    <div className="live-product-card">
      <img
        src={product.image}
        alt={product.name}
      />

      <div className="product-info">
        <h4>{product.name}</h4>

        <p>{product.price}</p>

        <button>Mua ngay</button>
      </div>
    </div>
  );
}