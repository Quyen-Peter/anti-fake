import { Truck } from "lucide-react";
import type { ShippingOption } from "../../type/checkout";
import { formatVnd } from "../../ultil/currency";

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
        <div className="shipping-state">Đang tải phương thức vận chuyển...</div>
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
                checked={selectedOptionCode === option.optionCode}
                onChange={() => setSelectedOptionCode(option.optionCode)}
              />

              <div>
                <strong>
                   {option.methodName}
                </strong>

                <p>Dự kiến giao: {option.estimatedDelivery}</p>
              </div>

              <span>{formatVnd(option.shippingFee)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
