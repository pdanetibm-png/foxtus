import type { Puzzle } from './types';
import IntroPuzzle from './01-intro';
import CommencementPuzzle from './02-commencement';
import LieuPuzzle from './03-lieu';
import SimonPuzzle from './04-simon';
import AquariumPuzzle from './05-aquarium';

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
    hints: ['Nombre à 6 chiffres', 'Le mois ou tout à changé'],
  },
  {
    slug: 'lieu',
    order: 3,
    title: 'III — Le lieu',
    Component: LieuPuzzle,
    // Pas de réponse à saisir : la validation se fait via GPS dans le composant
    expectedHashes: [],
    hints: ['Un verre de champagne t\'y attend.'],
  },
  {
    slug: 'simon',
    order: 4,
    title: 'IV — La mémoire',
    Component: SimonPuzzle,
    // Auto-validation via mini-jeu : pas de réponse à taper
    expectedHashes: [],
    hints: [
      'La séquence change à chaque essai. Tu peux la refaire autant de fois que tu veux.',
    ],
  },
  {
    slug: 'aquarium',
    order: 5,
    title: 'V — L\'aquarium',
    Component: AquariumPuzzle,
    // SHA-256 de "0", "zero", "aucun" salés avec foxtus-dev-salt
    expectedHashes: [
      'd860858049d0c7905cff8e1cfc84af6bd15f2c3723dec8b6208448d25f173e70',
      'ada557314535ff01b775ec905327c22e52b4516f8e59f9db0929156cf05bade6',
      '4d0289dc0acfdbbe8da04ab06b2f394fd85b677fbd3434f87645de9e2503e9e9',
    ],
    hints: [
      'Sois précise sur l\'espèce, pas seulement sur la couleur.',
      'L\'eau de l\'aquarium est salée. Lui, non.',
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
