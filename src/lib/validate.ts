export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function checkAnswer(
  raw: string,
  expectedHashes: string[],
  salt: string,
): Promise<boolean> {
  const normalized = normalizeAnswer(raw);
  if (!normalized) return false;
  const hash = await sha256Hex(`${salt}:${normalized}`);
  return expectedHashes.includes(hash);
}
