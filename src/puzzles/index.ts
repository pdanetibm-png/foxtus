import type { Puzzle } from './types';
import IntroPuzzle from './01-intro';

export type { Puzzle } from './types';

export const PUZZLES: Puzzle[] = [
  {
    slug: 'foxtus',
    order: 1,
    title: 'I — Foxtus',
    subtitle: 'Le commencement.',
    Component: IntroPuzzle,
    // SHA-256("foxtus-dev-salt:foxtus") — placeholder, régénérer avec un vrai salt + une vraie réponse
    expectedHash:
      '983436571e4f9aba6db7de4c8e418447923cb2a293aa974829aed9d533ec3b9c',
    hints: [
      'Indice 1 — un mot, en minuscules, sans accent.',
      'Indice 2 — pense au nom du repo que tu viens d’ouvrir.',
    ],
  },
];

export function puzzleBySlug(slug: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.slug === slug);
}

export function nextPuzzle(currentSlug: string): Puzzle | undefined {
  const idx = PUZZLES.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return undefined;
  return PUZZLES[idx + 1];
}

export function isUnlocked(slug: string, solvedSlugs: string[]): boolean {
  const idx = PUZZLES.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  if (idx === 0) return true;
  const prev = PUZZLES[idx - 1];
  return solvedSlugs.includes(prev.slug);
}
