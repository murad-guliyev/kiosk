export function AnimatedBg() {
  return (
    <>
      {/* Aurora gradient layers — slow organic drift */}
      <div className="ambient-aurora ambient-aurora-1" />
      <div className="ambient-aurora ambient-aurora-2" />
      <div className="ambient-aurora ambient-aurora-3" />

      {/* Diagonal light beam sweep */}
      <div className="ambient-beam" />

      {/* Faint dot-mesh texture */}
      <div className="ambient-mesh" />

      {/* Vignette — darkened edges */}
      <div className="ambient-vignette" />
    </>
  );
}
