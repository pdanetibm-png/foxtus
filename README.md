# Foxtus

Suite d'énigmes narratives pour un anniversaire.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router (HashRouter — compatible GitHub Pages sans config 404)
- Zustand + middleware `persist` (localStorage)

## Dev local

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:5173/foxtus/`.

## Construction

```bash
npm run build
npm run preview
```

## Déploiement

Push sur `main` → GitHub Action déploie sur GitHub Pages.

URL finale : `https://pdanetibm-png.github.io/foxtus/`

### Avant le premier déploiement

Dans **Settings → Pages** du repo GitHub :
- Source : "GitHub Actions"

Dans **Settings → Secrets and variables → Actions** :
- Ajouter un secret `VITE_PUZZLE_SALT` (chaîne aléatoire, ex : `openssl rand -hex 16`).
  Ce salt sert à hasher les bonnes réponses dans les énigmes — il doit être stable entre dev et prod.

En local, copier `.env.example` vers `.env.local` et y mettre le même salt.

## Hash d'une réponse

```bash
PUZZLE_SALT="ton-salt" npx tsx scripts/hash-answer.ts "ma réponse"
```

Le hash retourné se colle dans `expectedHash` du registry `src/puzzles/index.ts`.

## Architecture

```
src/
├── store/progress.ts       # Zustand : { solved, hintsUsed }
├── puzzles/
│   ├── index.ts            # registry [{ slug, order, Component, expectedHash, hints }]
│   ├── types.ts
│   └── 01-intro.tsx        # contenu narratif d'une énigme
├── components/
│   ├── PuzzleLayout.tsx    # wrapper commun
│   ├── AnswerInput.tsx     # input + validation hash
│   ├── HintButton.tsx      # indices progressifs
│   └── Lockscreen.tsx      # accès anticipé refusé
├── pages/
│   ├── Home.tsx
│   ├── PuzzlePage.tsx
│   └── Final.tsx
└── lib/validate.ts         # normalize + sha256 + checkAnswer
```

## Ajouter une énigme

1. Créer `src/puzzles/0X-nom.tsx` (export default un composant React).
2. Générer le hash : `npx tsx scripts/hash-answer.ts "réponse"`.
3. L'ajouter à `PUZZLES` dans `src/puzzles/index.ts` avec son `slug`, `order`, `Component`, `expectedHash`, `hints`.
