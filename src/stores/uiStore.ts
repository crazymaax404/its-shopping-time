import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "@/utils/storage";

interface UIState {
  showAddModal: boolean;
  showEditModal: boolean;
  editingItemId: string | null;
  activeSessionId: string | null;
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean, itemId?: string) => void;
  setActiveSessionId: (sessionId: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      showAddModal: false,
      showEditModal: false,
      editingItemId: null,
      activeSessionId: null,
      setShowAddModal: (show) => set({ showAddModal: show }),
      setShowEditModal: (show, itemId) =>
        set({ showEditModal: show, editingItemId: itemId ?? null }),
      setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
    }),
    {
      name: "ui-store",
      storage: zustandStorage,
      partialize: (state) => ({
        activeSessionId: state.activeSessionId,
      }),
    },
  ),
);
