import type { Puzzle } from './types';
import IntroPuzzle from './01-intro';
import CommencementPuzzle from './02-commencement';

export type { Puzzle } from './types';

export const PUZZLES: Puzzle[] = [
  {
    slug: 'foxtus',
    order: 1,
    title: 'I — La boîte',
    Component: IntroPuzzle,
    // SHA-256 de "puzzle" et "un puzzle" salés avec foxtus-dev-salt
    expectedHashes: [
      'bab89e3560c71474b31ea0443fb514438c16812338bc824bc8d78c1ce22e69c9',
      '193281d797e1d47e4bbea6234bdae23d0ddb0c8dd9232a695aa46182d493c23b',
    ],
    hints: ['Non vraiment ?! Tu veux un indice pour ça ...'],
  },
  {
    slug: 'commencement',
    order: 2,
    title: 'II — Le commencement',
    Component: CommencementPuzzle,
    // SHA-256 de "198604" salé avec foxtus-dev-salt
    expectedHashes: [
      '856cbff673f0c62da864808c6bf1c704a524fa36f03451dddfb89ae46bc2ef65',
    ],
    hints: ['mais c\'est évident'],
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
