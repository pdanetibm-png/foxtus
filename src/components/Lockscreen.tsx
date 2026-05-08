import { Link } from 'react-router-dom';
import { PUZZLES } from '../puzzles';
import { useProgress } from '../store/progress';

export function Lockscreen() {
  const solved = useProgress((s) => s.solved);
  const next = PUZZLES.find((p) => !solved.includes(p.slug)) ?? PUZZLES[0];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <p className="text-ember/70 uppercase tracking-[0.3em] text-xs mb-3">
        Verrouillé
      </p>
      <h1 className="font-serif text-3xl text-fog mb-4">
        Cette porte ne s’ouvre pas encore.
      </h1>
      <p className="text-fog/60 max-w-sm mb-8 italic">
        Chaque énigme se révèle à son tour. Reviens à la dernière étape ouverte
        et avance pas à pas.
      </p>
      <Link
        to={`/puzzle/${next.slug}`}
        className="tap-target px-6 py-3 rounded-lg bg-ember text-night font-semibold"
      >
        Reprendre où j’en suis
      </Link>
    </main>
  );
}
