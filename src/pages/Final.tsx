import { Link } from 'react-router-dom';
import { PUZZLES } from '../puzzles';
import { useProgress } from '../store/progress';

export function Final() {
  const solved = useProgress((s) => s.solved);
  const allDone = PUZZLES.every((p) => solved.includes(p.slug));

  if (!allDone) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <p className="text-fog/60 italic">
          La fin n’existe pas encore pour toi.
        </p>
        <Link
          to="/"
          className="mt-6 text-ember underline underline-offset-4 tap-target"
        >
          Retourner au seuil
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <p className="text-ember/70 uppercase tracking-[0.3em] text-xs mb-3">
        Révélation
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl text-fog mb-6">
        Tu y es arrivée.
      </h1>
      <p className="max-w-md text-fog/80 leading-relaxed italic">
        (Le contenu de la révélation apparaîtra ici, déchiffré localement à
        partir de tes réponses. Cette page sera personnalisée d’ici l’anniversaire.)
      </p>
    </main>
  );
}
