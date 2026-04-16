export function Header() {
  return (
    <header
      className="w-full flex items-center px-6 py-4"
      style={{
        background: 'rgba(0, 20, 40, 0.72)',
        borderBottom: '1px solid rgba(75, 200, 182, 0.08)',
      }}
    >
      <img
        src="/cbar%20logo.svg"
        alt="Central Bank of Azerbaijan"
        style={{
          height: '52px',
          width: 'auto',
          flexShrink: 0,
          display: 'block',
        }}
      />
    </header>
  );
}
