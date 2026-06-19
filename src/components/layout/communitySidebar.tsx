import { MessageSquare, Radio } from "lucide-react";

type Props = {
  activeTab: "discussion" | "live";
  onChangeTab: (
    tab: "discussion" | "live"
  ) => void;
};

export default function CommunitySidebar({
  activeTab,
  onChangeTab,
}: Props) {
  return (
    <aside className="community-sidebar">
      <h3>Cộng đồng</h3>

      <button
        className={
          activeTab === "discussion"
            ? "sidebar-menu active"
            : "sidebar-menu"
        }
        onClick={() =>
          onChangeTab("discussion")
        }
      >
        <MessageSquare size={18} />
        Thảo luận
      </button>

      <button
        className={
          activeTab === "live"
            ? "sidebar-menu active"
            : "sidebar-menu"
        }
        onClick={() => onChangeTab("live")}
      >
        <Radio size={18} />
        Live trực tiếp
      </button>
    </aside>
  );
}