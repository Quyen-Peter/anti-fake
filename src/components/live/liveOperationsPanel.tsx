import { Eye, EyeOff, MessageCircle, ShoppingBag, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getLiveAnalytics,
  listLiveComments,
  updateLiveCommentVisibility,
  type LiveAnalytics,
  type LiveComment,
  type LiveSession,
} from "../../services/live.api";

export default function LiveOperationsPanel({
  session,
  onClose,
}: {
  session: LiveSession;
  onClose: () => void;
}) {
  const [analytics, setAnalytics] = useState<LiveAnalytics | null>(null);
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [metrics, commentItems] = await Promise.all([
        getLiveAnalytics(session.id),
        listLiveComments(session.id, true),
      ]);
      setAnalytics(metrics);
      setComments(commentItems);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải dữ liệu vận hành",
      );
    } finally {
      setLoading(false);
    }
  }, [session.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleVisibility = async (comment: LiveComment) => {
    try {
      const updated = await updateLiveCommentVisibility(
        session.id,
        comment.id,
        comment.visibility === "PUBLIC" ? "HIDDEN" : "PUBLIC",
      );
      setComments((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể kiểm duyệt bình luận",
      );
    }
  };

  return (
    <div className="live-operations-backdrop" role="presentation">
      <section
        className="live-operations-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Vận hành ${session.title}`}
      >
        <header>
          <div>
            <small>Vận hành livestream</small>
            <h2>{session.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Đóng">
            <X size={19} />
          </button>
        </header>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <div className="live-operations-metrics">
              <article><Users /><b>{analytics?.currentViewers ?? 0}</b><span>Đang xem</span></article>
              <article><MessageCircle /><b>{analytics?.commentCount ?? 0}</b><span>Bình luận</span></article>
              <article><ShoppingBag /><b>{analytics?.conversionCount ?? 0}</b><span>Đơn từ live</span></article>
              <article><b>{new Intl.NumberFormat("vi-VN").format(analytics?.grossRevenue ?? 0)}đ</b><span>Doanh thu gộp</span></article>
            </div>
            <div className="live-operations-comments">
              <h3>Kiểm duyệt bình luận</h3>
              {comments.length === 0 ? (
                <p>Chưa có bình luận.</p>
              ) : (
                comments.map((comment) => (
                  <article key={comment.id}>
                    <div>
                      <b>{comment.authorName}</b>
                      <p>{comment.body}</p>
                    </div>
                    <button
                      onClick={() => void toggleVisibility(comment)}
                      title={comment.visibility === "PUBLIC" ? "Ẩn" : "Hiện"}
                    >
                      {comment.visibility === "PUBLIC" ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </article>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
