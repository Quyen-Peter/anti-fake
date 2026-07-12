import "../../css/pages/community.css";
import DiscussionFeed from "./discussionFeed";

export default function CommunityPage() {
  return (
    <div className="community-page">
      <div className="community-content">
        <DiscussionFeed />
      </div>
    </div>
  );
}
