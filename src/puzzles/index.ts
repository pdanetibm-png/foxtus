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
    // SHA-256 de "un boulon" et "boulon" salés avec foxtus-dev-salt
    expectedHashes: [
      '68fdaa65450404832bb347a322a054dbc9aa52254bb54f43a33762972184a6ac',
      'c32a6b776296293934e13936a17a226e515c0cb2b7415600dd8db37349b27cf8',
    ],
    hints: ['Non vraiment ?! Tu veux un indice pour ça ...'],
  },
  {
    slug: 'commencement',
    order: 2,
    title: 'II — Le commencement',
    Component: CommencementPuzzle,
    // TODO: placeholder — réponse "blanc". À remplacer par un vrai souvenir.
    expectedHashes: [
      '21a76881e9278f41cdf9a1d4020b0ab3be3c7843ddd1745be38df5233b786c82',
    ],
    hints: ['Indice placeholder — à remplacer quand le contenu réel sera défini.'],
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
