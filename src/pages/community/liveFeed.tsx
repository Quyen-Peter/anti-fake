import { useEffect, useState } from "react";
import LiveShopCard from "../../components/live/liveShopCard";
import {
  listLiveSessions,
  type LiveSession,
} from "../../services/live.api";

export default function LiveFeed() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listLiveSessions({ filter: "all" })
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải livestream...</p>;
  if (!sessions.length) return <p>Chưa có livestream.</p>;

  return (
    <div className="live-grid">
      {sessions.map((session) => (
        <LiveShopCard key={session.id} live={session} />
      ))}
    </div>
  );
}
