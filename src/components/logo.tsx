export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      >
        <path d="M8 8v20l20 0" />
        <path d="M28 8v20" />
      </g>
      <g fill="currentColor">
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="8" cy="18" r="2.5" />
        <circle cx="8" cy="28" r="2.5" />
        <circle cx="28" cy="8" r="2.5" />
        <circle cx="28" cy="18" r="2.5" />
        <circle cx="28" cy="28" r="2.5" />
      </g>
    </svg>
  );
}
