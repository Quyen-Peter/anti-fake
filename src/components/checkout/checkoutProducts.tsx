import { Store } from "lucide-react";
import type { CheckoutShop } from "../../type/checkout";


interface Props {
  shops?: CheckoutShop[];
}

export default function CheckoutProducts({ shops }: Props) {


  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  return (
    <>
      {shops?.map((shop) => (
        <div className="checkout-card" key={shop.shopId}>
          {/* SHOP */}
          <div className="checkout-shop-header">
            <Store size={18} />
            <span>{shop.shopName}</span>
          </div>

          {/* PRODUCTS */}
          {shop.items.map((item) => (
            <div className="checkout-product" key={item.id}>
              <img src={item.thumbnailUrl} alt={item.offerTitleSnapshot} />

              <div className="product-info">
                <h4>{item.offerTitleSnapshot}</h4>

                <span>Số lượng: {item.quantity}</span>

              </div>

              <div className="product-price">
                {formatPrice(item.unitPriceSnapshot)} {item.currencySnapshot}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
