import { useParams } from 'react-router-dom';
import { puzzleBySlug, isUnlocked } from '../puzzles';
import { useProgress } from '../store/progress';
import { PuzzleLayout } from '../components/PuzzleLayout';
import { Lockscreen } from '../components/Lockscreen';

const SALT = import.meta.env.VITE_PUZZLE_SALT || 'foxtus-dev-salt';

export function PuzzlePage() {
  const { slug = '' } = useParams();
  const solved = useProgress((s) => s.solved);
  const puzzle = puzzleBySlug(slug);

  if (!puzzle) return <Lockscreen />;
  if (!isUnlocked(slug, solved) && !solved.includes(slug)) {
    return <Lockscreen />;
  }

  const PuzzleComponent = puzzle.Component;

  return (
    <PuzzleLayout puzzle={puzzle} salt={SALT}>
      <PuzzleComponent />
    </PuzzleLayout>
  );
}
