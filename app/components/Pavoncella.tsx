type PavoncellaProps = {
  className?: string;
  title?: string;
};

export function Pavoncella({ className = "", title }: PavoncellaProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g className="pavoncella-tail" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
        <path d="M69 98C35 96 18 73 22 45c24 3 43 17 52 37" />
        <path d="M68 98C39 84 31 59 42 35c21 10 34 28 38 51" />
        <path d="M71 99C52 78 51 53 68 34c17 15 23 35 18 56" />
      </g>
      <path
        className="pavoncella-body"
        d="M56 101c18-19 34-30 54-31 12-1 22 5 26 14-13 0-22 5-27 14 6 13 5 26-5 35-16 15-45 7-54-10-4-8-2-15 6-22Z"
        fill="currentColor"
      />
      <path d="M129 75c9-8 16-14 21-18-2 11-6 19-14 27" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
      <path d="M131 70c-1-8 1-15 5-21 3 7 3 13 1 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
      <circle cx="124" cy="82" r="3.5" fill="var(--pavoncella-eye, #ffca58)" />
      <path d="M67 132c-7 8-16 13-27 13M83 137c-3 7-9 12-17 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
      <path className="pavoncella-wing" d="M67 105c13-12 27-16 39-12-3 16-15 26-34 29" fill="none" stroke="var(--pavoncella-wing, #70d7ca)" strokeLinecap="round" strokeWidth="6" />
    </svg>
  );
}
