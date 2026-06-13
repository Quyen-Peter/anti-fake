import { useEffect, useState } from "react";
import "../../css/components/product/review.css";
import { Star } from "lucide-react";

type Props = {
  productId: string;
};

type ReviewItem = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function Review({ productId }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(reviews.length / pageSize);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const mockReviews: ReviewItem[] = [
    {
      id: "1",
      userName: "Nguyễn Văn Hùng",
      rating: 5,
      comment:
        "Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh hơn dự kiến. Sẽ tiếp tục ủng hộ shop.",
      createdAt: "12/06/2026",
    },
    {
      id: "2",
      userName: "Trần Thị Mai",
      rating: 4,
      comment: "Chất lượng ổn, dùng khá thích. Giá hợp lý so với thị trường.",
      createdAt: "11/06/2026",
    },
    {
      id: "3",
      userName: "Lê Quốc Bảo",
      rating: 5,
      comment: "Đúng mô tả, hàng chính hãng. Shop hỗ trợ nhiệt tình.",
      createdAt: "10/06/2026",
    },
    {
      id: "4",
      userName: "Phạm Minh Anh",
      rating: 5,
      comment: "Mình mua lần thứ 2 rồi. Chất lượng vẫn rất tốt.",
      createdAt: "08/06/2026",
    },
    {
      id: "5",
      userName: "Đỗ Thanh Tùng",
      rating: 3,
      comment: "Sản phẩm ổn nhưng giao hàng hơi chậm.",
      createdAt: "05/06/2026",
    },
    {
      id: "6",
      userName: "Đỗ Thanh Tùng",
      rating: 3,
      comment: "Sản phẩm ổn nhưng giao hàng hơi chậm.",
      createdAt: "05/06/2026",
    },
    {
      id: "7",
      userName: "Phạm Minh Anh",
      rating: 5,
      comment: "Mình mua lần thứ 2 rồi. Chất lượng vẫn rất tốt.",
      createdAt: "08/06/2026",
    },
  ];

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setReviews(mockReviews);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            <strong>{item.userName}</strong>

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

          <span>{item.createdAt}</span>
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
