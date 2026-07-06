import { create } from "zustand";

type GlobalLoadingStore = {
  active: boolean;
  message: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
};

export const useGlobalLoadingStore = create<GlobalLoadingStore>((set) => ({
  active: false,
  message: "Đang xử lý...",
  showLoading: (message = "Đang xử lý...") =>
    set({
      active: true,
      message,
    }),
  hideLoading: () =>
    set({
      active: false,
    }),
}));
