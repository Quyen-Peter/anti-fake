import { useState } from "react";

import "../../css/pages/community.css";
import CommunitySidebar from "../../components/layout/communitySidebar";
import DiscussionFeed from "./discussionFeed";
import LiveFeed from "./liveFeed";

export default function CommunityPage() {
  const [tab, setTab] = useState<"discussion" | "live">("discussion");

  return (
    <div className="community-page">
      <CommunitySidebar activeTab={tab} onChangeTab={setTab} />

      <div className="community-content">
        {tab === "discussion" ? <DiscussionFeed /> : <LiveFeed />}
      </div>
    </div>
  );
}
