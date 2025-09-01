export default function FnaydekLiveLogo({ width = 280 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 220"
      width={width}
      role="img"
      aria-label="Fnaydek Live logo"
      style={{ display: 'block' }}
    >
      <rect width="600" height="220" fill="#a10000" />
      <g fontFamily="Tajawal, Arial, sans-serif" fontWeight="800" fill="#fff">
        <text x="40" y="95" fontSize="72" style={{ direction: 'rtl' }}>فنيدق</text>
        <text x="40" y="165" fontSize="64">Live</text>
      </g>
      <rect x="360" y="30" width="20" height="160" fill="#fff" rx="10" />
      <g transform="translate(395,25)" fill="#fff">
        <rect x="0" y="0" width="28" height="170" rx="14" />
        <rect x="0" y="0" width="110" height="28" rx="14" />
        <rect x="0" y="70" width="95" height="28" rx="14" />
        <rect x="125" y="0" width="28" height="170" rx="14" />
        <rect x="100" y="142" width="90" height="28" rx="14" />
      </g>
    </svg>
  );
}