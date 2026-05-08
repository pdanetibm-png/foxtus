import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProgressState = {
  solved: string[];
  hintsUsed: Record<string, number>;
  startedAt: number | null;

  isSolved: (slug: string) => boolean;
  solve: (slug: string) => void;
  useHint: (slug: string) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      solved: [],
      hintsUsed: {},
      startedAt: null,

      isSolved: (slug) => get().solved.includes(slug),

      solve: (slug) =>
        set((state) => {
          if (state.solved.includes(slug)) return state;
          return {
            solved: [...state.solved, slug],
            startedAt: state.startedAt ?? Date.now(),
          };
        }),

      useHint: (slug) =>
        set((state) => ({
          hintsUsed: {
            ...state.hintsUsed,
            [slug]: (state.hintsUsed[slug] ?? 0) + 1,
          },
        })),

      reset: () => set({ solved: [], hintsUsed: {}, startedAt: null }),
    }),
    { name: 'foxtus.progress.v1' },
  ),
);
