import { create } from "zustand";

interface ApprovalsState {
  pendingCount: number;
  setPendingCount: (count: number) => void;
}

export const useApprovalsStore = create<ApprovalsState>((set) => ({
  pendingCount: 0,
  setPendingCount: (pendingCount) => set({ pendingCount }),
}));
