import { useState, type FormEvent } from 'react';
import { checkAnswer } from '../lib/validate';

type Props = {
  expectedHashes: string[];
  salt: string;
  onSolved: () => void;
  onAttempt?: (answer: string, success: boolean) => void;
  placeholder?: string;
};

export function AnswerInput({ expectedHashes, salt, onSolved, onAttempt, placeholder }: Props) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'wrong'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || state === 'checking') return;
    setState('checking');
    const ok = await checkAnswer(value, expectedHashes, salt);
    onAttempt?.(value, ok);
    if (ok) {
      onSolved();
    } else {
      setState('wrong');
      setTimeout(() => setState('idle'), 800);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? 'Ta réponse…'}
          className={[
            'w-full px-4 py-3 rounded-lg bg-night/60 border-2 text-fog placeholder:text-fog/40',
            'focus:outline-none transition-colors',
            state === 'wrong'
              ? 'border-red-500/70 animate-pulse'
              : 'border-fog/20 focus:border-ember',
          ].join(' ')}
          aria-invalid={state === 'wrong'}
        />
        <button
          type="submit"
          disabled={state === 'checking' || !value.trim()}
          className="tap-target px-5 py-3 rounded-lg bg-ember text-night font-semibold disabled:opacity-40 transition-opacity"
        >
          {state === 'checking' ? '…' : 'Valider'}
        </button>
      </div>
    </form>
  );
}
