import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PUZZLES } from '../puzzles';
import { useProgress } from '../store/progress';

function fireConfetti() {
  const colors = ['#e0833a', '#f6e7c1', '#d4e0e8', '#fbb573'];
  const duration = 4_000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
      scalar: 0.9,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
      scalar: 0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.5 },
      colors,
    });
  }, 350);
}

export function Final() {
  const solved = useProgress((s) => s.solved);
  const allDone = PUZZLES.every((p) => solved.includes(p.slug));
  const fired = useRef(false);

  useEffect(() => {
    if (allDone && !fired.current) {
      fired.current = true;
      fireConfetti();
    }
  }, [allDone]);

  if (!allDone) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <p className="text-fog/60 italic">
          La fin n'existe pas encore pour toi.
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
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-ember/70 uppercase tracking-[0.3em] text-xs mb-3"
      >
        Révélation
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-4xl sm:text-5xl text-fog mb-8"
      >
        Tu y es arrivée.
      </motion.h1>

      <motion.img
        src={`${import.meta.env.BASE_URL}image-finale.png`}
        alt=""
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="w-full max-w-sm mb-10 rounded-2xl shadow-2xl shadow-ember/20"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="max-w-md space-y-6"
      >
        <p className="font-serif text-2xl sm:text-3xl text-ember leading-snug">
          Un voyage à deux,<br />quelque part en Europe.
        </p>

        <p className="text-fog/80 leading-relaxed">
          Une parenthèse rien que pour vous. Le où, le quand, le combien de
          jours — on en discutera ensemble. Mais la valise, elle est déjà
          prête dans nos têtes.
        </p>

        <p className="text-fog/50 italic text-sm">
          Joyeux anniversaire, foxtus.
        </p>
      </motion.div>
    </main>
  );
}
