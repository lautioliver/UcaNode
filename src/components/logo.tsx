export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill="var(--accent-ghost)"
        stroke="var(--border-accent)"
      />
      <path
        d="M13 12v11c0 4 3.1 7 7 7s7-3 7-7V12"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M11 10c3-2.4 6.4-3.5 9-3.5s6 1.1 9 3.5"
        stroke="var(--warning)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="11" cy="10" r="1.7" fill="var(--danger)" />
      <circle cx="29" cy="10" r="1.7" fill="var(--success)" />
    </svg>
  );
}
