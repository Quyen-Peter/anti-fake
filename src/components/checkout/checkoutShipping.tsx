import { Truck } from "lucide-react";
import type { ShippingOption } from "../../type/checkout";
import { formatVnd } from "../../ultil/currency";
import "../../css/components/dataSkeleton.css";

interface Props {
  error: string;
  loading: boolean;
  options: ShippingOption[];
  selectedOptionCode: string;
  setSelectedOptionCode: (value: string) => void;
}

export default function CheckoutShipping({
  error,
  loading,
  options,
  selectedOptionCode,
  setSelectedOptionCode,
}: Props) {
  return (
    <div className="checkout-card">
      <div className="section-title">
        <Truck size={18} />
        Phương thức vận chuyển
      </div>

      {loading ? (
        <div className="shipping-state"><div className="data-skeleton data-skeleton-shipping" role="status" aria-label="Đang tải phương thức vận chuyển">{Array.from({ length: 3 }, (_, i) => <div className="data-skeleton-row" key={i}><span className="data-skeleton-thumbnail" /><span className="data-skeleton-lines"><span /><span /><span /></span></div>)}</div></div>
      ) : error ? (
        <div className="shipping-state shipping-error">{error}</div>
      ) : options.length === 0 ? (
        <div className="shipping-state">
          Chưa có phương thức vận chuyển phù hợp.
        </div>
      ) : (
        <div className="shipping-list">
          {options.map((option) => (
            <label
              key={option.optionCode}
              className={`shipping-item ${
                selectedOptionCode === option.optionCode ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="shippingOption"
                checked={selectedOptionCode === option.optionCode}
                onChange={() => setSelectedOptionCode(option.optionCode)}
              />

              <div className="shipping-item-content">
                <strong>{option.providerName}</strong>
                <span className="shipping-method">{option.methodName}</span>
                <p>Dự kiến giao: {option.estimatedDelivery}</p>
              </div>

              <span className="shipping-price">
                {formatVnd(option.shippingFee)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
