import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { nextPuzzle, PUZZLES } from './index';
import { notifyAttempt } from '../lib/notify';

const SLUG = 'lieu';
const TARGET_LAT = 48.65245275302803;
const TARGET_LNG = 2.2810737795599527;
const RADIUS_M = 100;

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type State = 'idle' | 'checking' | 'unlocked' | 'wrong-place' | 'denied';

export default function LieuPuzzle() {
  const [state, setState] = useState<State>('idle');
  const solve = useProgress((s) => s.solve);
  const navigate = useNavigate();

  function check() {
    setState('checking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = haversineM(pos.coords.latitude, pos.coords.longitude, TARGET_LAT, TARGET_LNG);
        const ok = d <= RADIUS_M;
        const puzzle = PUZZLES.find((p) => p.slug === SLUG);
        if (puzzle) {
          notifyAttempt({
            puzzleOrder: puzzle.order,
            totalPuzzles: PUZZLES.length,
            puzzleTitle: puzzle.title,
            answer: `(GPS ${Math.round(d)} m)`,
            success: ok,
          });
        }
        if (ok) {
          setState('unlocked');
          solve(SLUG);
          const next = nextPuzzle(SLUG);
          setTimeout(() => {
            if (next) navigate(`/puzzle/${next.slug}`);
            else navigate('/final');
          }, 1200);
        } else {
          setState('wrong-place');
        }
      },
      () => setState('denied'),
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

      {state === 'denied' && (
        <>
          <p className="text-red-400 mb-6">
            Tu dois autoriser la géolocalisation pour continuer.
          </p>
          <button
            onClick={check}
            className="tap-target px-7 py-4 rounded-lg bg-ember text-night font-semibold text-lg"
          >
            Réessayer
          </button>
        </>
      )}

      {state === 'wrong-place' && (
        <>
          <p className="text-red-400 mb-6">Tu n'es pas au bon endroit.</p>
          <button
            onClick={check}
            className="tap-target px-7 py-4 rounded-lg bg-ember text-night font-semibold text-lg"
          >
            Réessayer
          </button>
        </>
      )}

      {state === 'unlocked' && (
        <p className="text-ember text-xl font-semibold">
          Bravo, tu y es !
        </p>
      )}
    </>
  );
}
