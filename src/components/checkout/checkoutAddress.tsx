import { MapPin, ShieldCheck } from "lucide-react";

export default function CheckoutAddress (){
    return(
        <div className="checkout-card">
          <div className="section-title">
            <MapPin size={18} />
            Địa chỉ nhận hàng
          </div>


          <div className="address-box">
            <div className="address-header">
              <strong>
                Nguyễn Văn A | 0901234567
              </strong>

              <button>Thay đổi</button>
            </div>

            <p>
              123 Đường Lê Lợi, Phường Bến Thành,
              Quận 1, TP Hồ Chí Minh
            </p>

            <span className="verified-address">
              <ShieldCheck size={14} />
              Địa chỉ đã xác thực
            </span>
          </div>
        </div>
    )
}