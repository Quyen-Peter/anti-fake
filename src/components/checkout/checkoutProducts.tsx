import { Store } from "lucide-react";
import type { CheckoutShop } from "../../type/checkout";
import { formatVnd } from "../../ultil/currency";


interface Props {
  shops?: CheckoutShop[];
}

export default function CheckoutProducts({ shops }: Props) {


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
                {item.variantSku ? <span>Phân loại: {item.variantSku}</span> : null}

                <span>Số lượng: {item.quantity}</span>

              </div>

              <div className="product-price">
                {formatVnd(item.unitPriceSnapshot, item.currencySnapshot)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
