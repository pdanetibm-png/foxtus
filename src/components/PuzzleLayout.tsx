import { useNavigate } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { nextPuzzle, type Puzzle, PUZZLES } from '../puzzles';
import { AnswerInput } from './AnswerInput';
import { HintButton } from './HintButton';
import { notifyAttempt } from '../lib/notify';
import { type ReactNode } from 'react';

type Props = {
  puzzle: Puzzle;
  salt: string;
  children: ReactNode;
};

export function PuzzleLayout({ puzzle, salt, children }: Props) {
  const solve = useProgress((s) => s.solve);
  const navigate = useNavigate();

  function onSolved() {
    solve(puzzle.slug);
    const next = nextPuzzle(puzzle.slug);
    setTimeout(() => {
      if (next) navigate(`/puzzle/${next.slug}`);
      else navigate('/final');
    }, 400);
  }

  return (
    <main className="min-h-screen flex flex-col px-5 py-10 max-w-xl mx-auto">
      <header className="mb-10 text-center">
        <p className="text-ember/70 uppercase tracking-[0.3em] text-xs mb-2">
          Foxtus
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-fog">{puzzle.title}</h1>
        {puzzle.subtitle && (
          <p className="mt-2 text-fog/60 italic">{puzzle.subtitle}</p>
        )}
      </header>

      <section className="prose prose-invert prose-p:text-fog/85 prose-headings:text-fog max-w-none mb-10 text-lg leading-relaxed">
        {children}
      </section>

      {puzzle.expectedHashes.length > 0 && (
        <AnswerInput
          expectedHashes={puzzle.expectedHashes}
          salt={salt}
          onSolved={onSolved}
          onAttempt={(answer, success) =>
            notifyAttempt({
              puzzleOrder: puzzle.order,
              totalPuzzles: PUZZLES.length,
              puzzleTitle: puzzle.title,
              answer,
              success,
            })
          }
        />
      )}

      <HintButton slug={puzzle.slug} hints={puzzle.hints} />
    </main>
  );
}
