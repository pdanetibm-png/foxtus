import { createHash } from 'node:crypto';

const SALT = process.env.PUZZLE_SALT ?? 'foxtus-dev-salt';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: tsx scripts/hash-answer.ts "<answer>"');
  process.exit(1);
}

function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const answer = args.join(' ');
const normalized = normalize(answer);
const hash = createHash('sha256').update(`${SALT}:${normalized}`).digest('hex');

console.log(`raw:        ${answer}`);
console.log(`normalized: ${normalized}`);
console.log(`salt:       ${SALT}`);
console.log(`hash:       ${hash}`);
