import type { ComponentType } from 'react';

export type Puzzle = {
  slug: string;
  order: number;
  title: string;
  subtitle?: string;
  Component: ComponentType;
  expectedHash: string;
  hints: string[];
};
