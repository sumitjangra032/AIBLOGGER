import { create } from "zustand";

export const useStore = create(set => ({
  isSearchDisabled: false,
  setIsSearchDisabled: (v) => set({ isSearchDisabled: v })
}));
