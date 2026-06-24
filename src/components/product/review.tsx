import { useState } from "react";
import "../../css/components/product/review.css";
import { Star } from "lucide-react";

type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  media: string[];
};

type Props = {
  reviews: ReviewItem[];
  loading: boolean;
};

export default function Review({ reviews, loading }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(reviews.length / pageSize);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (loading) {
    return <div className="pd-review-loading">Đang tải đánh giá...</div>;
  }

  return (
    <div className="pd-review">
      <h2>Đánh giá sản phẩm</h2>

      {reviews.length === 0 && (
        <div className="pd-review-empty">Chưa có đánh giá nào</div>
      )}

      {paginatedReviews.map((item) => (
        <div key={item.id} className="pd-review-item">
          <div className="pd-review-top">
            <strong>{item.authorName}</strong>

            <div className="pd-review-rating">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  fill={index < item.rating ? "#f59e0b" : "none"}
                  color={index < item.rating ? "#f59e0b" : "#d1d5db"}
                />
              ))}
            </div>
          </div>

          <p>{item.comment}</p>
          {item.media?.length > 0 && (
            <div className="pd-review-media">
              {item.media.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`review-${index}`}
                  className="pd-review-image"
                />
              ))}
            </div>
          )}
          <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pd-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="pd-page-btn"
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`pd-page-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="pd-page-btn"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
