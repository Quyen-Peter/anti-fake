export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  recipientName: string;
  phone: string;
  addressLine: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest {
  recipientName: string;
  phone: string;
  addressLine: string;
  isDefault: boolean;
}
