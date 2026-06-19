import LiveShopCard from "../../components/live/liveShopCard";

export default function LiveFeed() {
  const mockLiveShops = [
    {
      id: "1",
      shopName: "TechWorld Official",
      shopAvatar: "https://i.pravatar.cc/100?img=1",
      liveThumbnail: "https://picsum.photos/600/400?random=1",
      liveTitle: "Flash Sale điện thoại giảm đến 50%",
      viewerCount: 12400,
      isVerified: true,
    },
    {
      id: "2",
      shopName: "Beauty Care VN",
      shopAvatar: "https://i.pravatar.cc/100?img=2",
      liveThumbnail: "https://picsum.photos/600/400?random=2",
      liveTitle: "Livestream mỹ phẩm chính hãng",
      viewerCount: 8600,
      isVerified: true,
    },
    {
      id: "3",
      shopName: "Fresh Food Mart",
      shopAvatar: "https://i.pravatar.cc/100?img=3",
      liveThumbnail: "https://picsum.photos/600/400?random=3",
      liveTitle: "Nông sản sạch giá tốt hôm nay",
      viewerCount: 5200,
      isVerified: true,
    },
    {
      id: "9",
      shopName: "TechWorld Official",
      shopAvatar: "https://i.pravatar.cc/100?img=1",
      liveThumbnail: "https://picsum.photos/600/400?random=1",
      liveTitle: "Flash Sale điện thoại giảm đến 50%",
      viewerCount: 12400,
      isVerified: true,
    },
    {
      id: "7",
      shopName: "Beauty Care VN",
      shopAvatar: "https://i.pravatar.cc/100?img=2",
      liveThumbnail: "https://picsum.photos/600/400?random=2",
      liveTitle: "Livestream mỹ phẩm chính hãng",
      viewerCount: 8600,
      isVerified: true,
    },
    {
      id: "6",
      shopName: "Fresh Food Mart",
      shopAvatar: "https://i.pravatar.cc/100?img=3",
      liveThumbnail: "https://picsum.photos/600/400?random=3",
      liveTitle: "Nông sản sạch giá tốt hôm nay",
      viewerCount: 5200,
      isVerified: true,
    },
  ];
  return (
    <div className="live-grid">
      {mockLiveShops.map((item) => (
        <LiveShopCard key={item.id} live={item} />
      ))}
    </div>
  );
}
