import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { nextPuzzle, PUZZLES } from './index';
import { notifyAttempt } from '../lib/notify';

const SLUG = 'lieu';

type State = 'idle' | 'checking' | 'unlocked';

export default function LieuPuzzle() {
  const [state, setState] = useState<State>('idle');
  const solve = useProgress((s) => s.solve);
  const navigate = useNavigate();

  function unlock(answer: string) {
    const puzzle = PUZZLES.find((p) => p.slug === SLUG);
    if (puzzle) {
      notifyAttempt({
        puzzleOrder: puzzle.order,
        totalPuzzles: PUZZLES.length,
        puzzleTitle: puzzle.title,
        answer,
        success: true,
      });
    }
    setState('unlocked');
    solve(SLUG);
    const next = nextPuzzle(SLUG);
    setTimeout(() => {
      if (next) navigate(`/puzzle/${next.slug}`);
      else navigate('/final');
    }, 1200);
  }

  function check() {
    setState('checking');
    // Toute position valide cette étape. On tente une lecture GPS à titre
    // indicatif (pour la notif), mais le déblocage ne dépend plus de la distance.
    if (!navigator.geolocation) {
      unlock('(GPS indisponible)');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        unlock(
          `(GPS ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)})`,
        );
      },
      () => unlock('(GPS refusé)'),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  return (
    <>
      <img
        src={`${import.meta.env.BASE_URL}image2.png`}
        alt=""
        className="w-full max-w-sm mx-auto mb-8 rounded-lg"
      />

      {state === 'idle' && (
        <>
          <p className="mb-6">Cette étape ne peut se débloquer qu'à un endroit précis.</p>
          <button
            onClick={check}
            className="tap-target px-7 py-4 rounded-lg bg-ember text-night font-semibold text-lg"
          >
            Vérifier ma position
          </button>
        </>
      )}

      {state === 'checking' && (
        <p className="text-fog/60 italic">Localisation en cours…</p>
      )}

      {state === 'unlocked' && (
        <p className="text-ember text-xl font-semibold">
          Bravo, tu y es !
        </p>
      )}
    </>
  );
}
