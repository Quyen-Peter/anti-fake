export interface ShippingMethod {
  providerCode: string;
  providerName: string;
  shippingFee: number;
  estimatedDays: string;
  isEnabled: boolean;
}