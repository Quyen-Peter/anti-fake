export interface SocialPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    shopName: string | null;
  };
  postType: "SHARE" | "PRODUCT_SHARE";
  body: string;
  image: string | null;
  createdAt: string;
  stats: {
    reactions: number;
    comments: number;
    shares: number;
  };
  viewer: {
    liked: boolean;
  };
}