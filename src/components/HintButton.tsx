import { useState } from 'react';
import { useProgress } from '../store/progress';

type Props = {
  slug: string;
  hints: string[];
};

export function HintButton({ slug, hints }: Props) {
  const used = useProgress((s) => s.hintsUsed[slug] ?? 0);
  const useHint = useProgress((s) => s.useHint);
  const [open, setOpen] = useState(false);

  if (hints.length === 0) return null;

  const visible = hints.slice(0, used);
  const canReveal = used < hints.length;

  return (
    <div className="mt-8 text-center">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-fog/50 text-sm underline underline-offset-4 hover:text-ember transition-colors"
        >
          Bloquée ? Demander un indice…
        </button>
      ) : (
        <div className="text-left space-y-3 bg-night/40 border border-fog/10 rounded-lg p-4">
          {visible.map((hint, i) => (
            <p key={i} className="text-fog/80 text-sm italic">
              · {hint}
            </p>
          ))}
          {canReveal && (
            <button
              onClick={() => useHint(slug)}
              className="tap-target text-ember text-sm underline underline-offset-4"
            >
              Révéler {visible.length === 0 ? 'un indice' : 'le suivant'}
            </button>
          )}
          {!canReveal && visible.length > 0 && (
            <p className="text-fog/40 text-xs italic">
              Plus d’indices disponibles. Respire.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
