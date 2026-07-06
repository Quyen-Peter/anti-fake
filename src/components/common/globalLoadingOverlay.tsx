import LoadingOverlay from "../loadingOverlay";
import { useGlobalLoadingStore } from "../../store/globalLoadingStore";

export default function GlobalLoadingOverlay() {
  const active = useGlobalLoadingStore((state) => state.active);
  const message = useGlobalLoadingStore((state) => state.message);

  if (!active) return null;

  return <LoadingOverlay message={message} />;
}
