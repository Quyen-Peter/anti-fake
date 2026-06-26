import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getDefaultAddress } from "../../services/address.api";
import type { Address } from "../../type/address";
import AddressSelectorModal from "../address/addressSelectorModal";

export default function CheckoutAddress() {
  const [address, setAddress] = useState<Address>();
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const fetchDefaultAddress = async () => {
    try {
      const address = await getDefaultAddress();
      setAddress(address);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  return (
    <div className="checkout-card">
      <div className="section-title">
        <MapPin size={18} />
        Địa chỉ nhận hàng
      </div>

      <div className="address-box">
        <div className="address-header">
          <strong>
            {address?.recipientName} | {address?.phone}
          </strong>

          <button onClick={() => setOpenAddressModal(true)}>Thay đổi</button>
        </div>

        <p>{address?.addressLine}</p>
      </div>
      <AddressSelectorModal
        open={openAddressModal}
        onClose={() => setOpenAddressModal(false)}
        onSuccess={fetchDefaultAddress}
      />
    </div>
  );
}
