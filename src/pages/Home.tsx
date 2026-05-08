import { Link } from 'react-router-dom';
import { PUZZLES } from '../puzzles';
import { useProgress } from '../store/progress';

export function Home() {
  const solved = useProgress((s) => s.solved);
  const reset = useProgress((s) => s.reset);

  const next = PUZZLES.find((p) => !solved.includes(p.slug));
  const allDone = !next;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <img
        src={`${import.meta.env.BASE_URL}image1.png`}
        alt=""
        className="w-full max-w-sm mb-8 rounded-lg"
      />
      <p className="text-fog/80 max-w-md italic mb-10 leading-relaxed">
        Tu as ouvert la boite et tu penses que c’était dur ? Ce n’est que le
        début. Ce qui suit ne se résout qu’une étape à la fois.
      </p>

      {!allDone ? (
        <Link
          to={`/puzzle/${next.slug}`}
          className="tap-target px-7 py-4 rounded-lg bg-ember text-night font-semibold text-lg"
        >
          {solved.length === 0 ? 'Commencer' : 'Reprendre'}
        </Link>
      ) : (
        <Link
          to="/final"
          className="tap-target px-7 py-4 rounded-lg bg-ember text-night font-semibold text-lg"
        >
          Voir la révélation
        </Link>
      )}

      <p className="mt-12 text-fog/30 text-xs">
        {solved.length} / {PUZZLES.length} résolues
      </p>

      {solved.length > 0 && (
        <button
          onClick={() => {
            if (confirm('Tout recommencer depuis le début ?')) reset();
          }}
          className="mt-3 text-fog/30 text-xs underline underline-offset-4"
        >
          (recommencer)
        </button>
      )}
    </main>
  );
}
