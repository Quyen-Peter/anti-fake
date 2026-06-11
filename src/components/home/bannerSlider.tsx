import { useEffect, useState } from "react";
import "../../css/components/bannerSlider.css";

const banners = [
  "/brand/home-banner-1.png",
  "/brand/home-banner-2.png",
  "/brand/home-banner-3.png",
  "/brand/home-banner-4.png",
  "/brand/home-banner-5.png",
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-slider">
      <div
        className="banner-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`banner-${index}`}
            className="banner-image"
          />
        ))}
      </div>

      <div className="banner-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`dot ${
              current === index ? "active" : ""
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}