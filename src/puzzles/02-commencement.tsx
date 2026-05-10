export default function CommencementPuzzle() {
  return (
    <>
      <img
        src={`${import.meta.env.BASE_URL}image3.png`}
        alt=""
        className="w-full max-w-sm mx-auto mb-8 rounded-lg"
      />

      <aside className="mb-8 p-4 rounded-lg bg-ember/10 border-l-4 border-ember/60 text-fog/85 italic">
        Ça, c’était une question piège. Sans avoir vu le puzzle, tu ne serais
        pas là. Commençons réellement.
      </aside>

      <p>
        Quel est le nombre d’or entre 1 et 1 000 000 ?
      </p>
    </>
  );
}
