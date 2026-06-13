import { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="pd-gallery">
      <img
        src={selectedImage}
        alt=""
        className="pd-main-image"
      />

      <div className="pd-thumb-list">
        {images.slice(0, 5).map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={
              selectedImage === img ? "pd-thumb active" : "pd-thumb"
            }
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
}