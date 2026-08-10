import { create } from 'zustand';
import { persist, StateStorage } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

interface UIState {
  showAddModal: boolean;
  showEditModal: boolean;
  editingItemId: string | null;
  showFinishPurchaseModal: boolean;
  activeSessionId: string | null;
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean, itemId?: string) => void;
  setShowFinishPurchaseModal: (show: boolean, sessionId?: string) => void;
  clearEditItem: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      showAddModal: false,
      showEditModal: false,
      editingItemId: null,
      showFinishPurchaseModal: false,
      activeSessionId: null,
      setShowAddModal: (show) => set({ showAddModal: show }),
      setShowEditModal: (show, itemId) => set({ showEditModal: show, editingItemId: itemId ?? null }),
      setShowFinishPurchaseModal: (show, sessionId) => set({ showFinishPurchaseModal: show, activeSessionId: sessionId ?? null }),
      clearEditItem: () => set({ showEditModal: false, editingItemId: null }),
    }),
    {
      name: 'ui-store',
      storage: zustandStorage,
      partialize: (state) => ({
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);