import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { nextPuzzle, PUZZLES } from './index';
import { notifyAttempt } from '../lib/notify';

const SLUG = 'simon';
const TARGET_ROUND = 20;
const COLORS = ['red', 'green', 'blue', 'yellow'] as const;
type Color = (typeof COLORS)[number];

const TONES: Record<Color, number> = {
  red: 329.63,
  green: 261.63,
  blue: 220,
  yellow: 164.81,
};

const COLOR_IDLE: Record<Color, string> = {
  red: 'bg-red-500/50',
  green: 'bg-green-500/50',
  blue: 'bg-blue-500/50',
  yellow: 'bg-yellow-500/50',
};

const COLOR_ACTIVE: Record<Color, string> = {
  red: 'bg-red-300',
  green: 'bg-green-300',
  blue: 'bg-blue-300',
  yellow: 'bg-yellow-300',
};

type Phase = 'idle' | 'showing' | 'playing' | 'wrong' | 'won';

function useTone() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback((freq: number, ms = 320) => {
    try {
      if (!ctxRef.current) {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new Ctx();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + ms / 1000);
    } catch {
      // audio is non-essential
    }
  }, []);
}

function randomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function SimonPuzzle() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const solve = useProgress((s) => s.solve);
  const navigate = useNavigate();
  const playTone = useTone();

  function start() {
    setSequence([randomColor()]);
    setPlayerIdx(0);
    setPhase('showing');
  }

  // Replay sequence visually
  useEffect(() => {
    if (phase !== 'showing') return;
    let cancelled = false;
    let i = 0;

    function showNext() {
      if (cancelled) return;
      if (i >= sequence.length) {
        setPhase('playing');
        return;
      }
      const c = sequence[i++];
      setActiveColor(c);
      playTone(TONES[c]);
      setTimeout(() => {
        if (cancelled) return;
        setActiveColor(null);
        setTimeout(showNext, 220);
      }, 360);
    }

    const t = setTimeout(showNext, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [phase, sequence, playTone]);

  function notifyResult(success: boolean, extra: string) {
    const puzzle = PUZZLES.find((p) => p.slug === SLUG);
    if (!puzzle) return;
    notifyAttempt({
      puzzleOrder: puzzle.order,
      totalPuzzles: PUZZLES.length,
      puzzleTitle: puzzle.title,
      answer: extra,
      success,
    });
  }

  function press(color: Color) {
    if (phase !== 'playing') return;
    setActiveColor(color);
    playTone(TONES[color]);
    setTimeout(() => setActiveColor((c) => (c === color ? null : c)), 180);

    if (color !== sequence[playerIdx]) {
      notifyResult(false, `(Simon: échec round ${sequence.length}, position ${playerIdx + 1})`);
      setPhase('wrong');
      setTimeout(() => {
        setSequence([]);
        setPlayerIdx(0);
        setPhase('idle');
      }, 1800);
      return;
    }

    const newIdx = playerIdx + 1;
    if (newIdx < sequence.length) {
      setPlayerIdx(newIdx);
      return;
    }

    // Round complete
    if (sequence.length >= TARGET_ROUND) {
      notifyResult(true, `(Simon: ${TARGET_ROUND} d'affilée)`);
      setPhase('won');
      solve(SLUG);
      const next = nextPuzzle(SLUG);
      setTimeout(() => {
        if (next) navigate(`/puzzle/${next.slug}`);
        else navigate('/final');
      }, 1600);
    } else {
      const newColor = randomColor();
      setSequence((s) => [...s, newColor]);
      setPlayerIdx(0);
      setTimeout(() => setPhase('showing'), 700);
    }
  }

  return (
    <>
      <p className="mb-4">
        Reproduis la séquence. À chaque réussite, elle s'allonge d'une couleur.
      </p>
      <p className="mb-8 text-ember font-semibold text-lg">
        Round {Math.max(sequence.length, 1)} / {TARGET_ROUND}
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8">
        {COLORS.map((c) => {
          const cls = activeColor === c ? COLOR_ACTIVE[c] : COLOR_IDLE[c];
          return (
            <button
              key={c}
              type="button"
              onClick={() => press(c)}
              disabled={phase !== 'playing'}
              className={[
                'tap-target aspect-square rounded-2xl transition-colors',
                cls,
                phase !== 'playing' ? 'opacity-60' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={c}
            />
          );
        })}
      </div>

      {phase === 'idle' && (
        <button
          onClick={start}
          className="tap-target px-7 py-4 rounded-lg bg-ember text-night font-semibold text-lg"
        >
          Commencer
        </button>
      )}
      {phase === 'showing' && <p className="text-fog/60 italic">Mémorise…</p>}
      {phase === 'playing' && <p className="text-fog/60 italic">À toi.</p>}
      {phase === 'wrong' && (
        <p className="text-red-400 font-semibold">
          Raté. On reprend du début…
        </p>
      )}
      {phase === 'won' && (
        <p className="text-ember text-xl font-semibold">
          Bravo, 20 d'affilée !
        </p>
      )}
    </>
  );
}
