export type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  soldPercent: number;
  discount: number;
};

export type ProductView = {
  id: string;
  title: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  soldQuantity: number;
  categoryName: string;
  salesMode: "WHOLESALE" | "RETAIL";
  verificationLevel: string;
  offerStatus: string;
  brandId: string;
  shopId: string;
};