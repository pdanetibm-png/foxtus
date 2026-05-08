const TOPIC = import.meta.env.VITE_NTFY_TOPIC as string | undefined;

type NotifyArgs = {
  title: string;
  body: string;
  tags?: string[];
  priority?: 1 | 2 | 3 | 4 | 5;
};

async function notify({ title, body, tags = [], priority = 3 }: NotifyArgs): Promise<void> {
  if (!TOPIC) return;
  try {
    await fetch('https://ntfy.sh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: TOPIC,
        title,
        message: body,
        tags,
        priority,
      }),
      keepalive: true,
    });
  } catch {
    // notif failures must never block gameplay
  }
}

export function notifyAttempt(args: {
  puzzleOrder: number;
  totalPuzzles: number;
  puzzleTitle: string;
  answer: string;
  success: boolean;
}): void {
  const { puzzleOrder, totalPuzzles, puzzleTitle, answer, success } = args;
  const flag = success ? '✓' : '✗';
  void notify({
    title: `Foxtus · ${puzzleOrder}/${totalPuzzles} · ${flag}`,
    body: [
      `Q: ${puzzleTitle}`,
      `R: ${answer}`,
      `UA: ${navigator.userAgent}`,
    ].join('\n'),
    tags: [success ? 'white_check_mark' : 'x'],
    priority: success ? 4 : 3,
  });
}

const ARRIVAL_FLAG = 'foxtus.notified.arrival.v1';

export function notifyArrival(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(ARRIVAL_FLAG)) return;
  localStorage.setItem(ARRIVAL_FLAG, String(Date.now()));
  void notify({
    title: 'Foxtus · arrivée',
    body: [
      `Quelqu'un vient d'ouvrir Foxtus.`,
      `UA: ${navigator.userAgent}`,
    ].join('\n'),
    tags: ['eyes'],
    priority: 4,
  });
}
