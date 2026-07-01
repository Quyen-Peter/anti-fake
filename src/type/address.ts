export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  provinceCode?: string;
  provinceName?: string;
  wardCode?: string;
  wardName?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  recipientName: string;
  phone: string;
  addressLine: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest {
  recipientName: string;
  phone: string;
  addressLine: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  isDefault: boolean;
}

export interface AddressProvince {
  provinceCode: string;
  provinceName: string;
}

export interface AddressWard {
  provinceCode: string;
  wardCode: string;
  wardName: string;
}
