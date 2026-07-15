type PavoncellaProps = {
  className?: string;
  title?: string;
};

export function Pavoncella({ className = "", title }: PavoncellaProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 180"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M49 51c-9-12-7-24 2-32 3 11 1 19-5 25M42 57c-12-4-18-13-17-23 9 5 14 12 14 21M36 63c-9 3-16 1-21-5 8-2 14 0 18 5" strokeWidth="3.5" />
        <path d="M180 69c20-22 35-22 42-10 7 13-8 22-17 12M185 84c27-12 45-4 44 10-1 13-17 14-22 4M181 101c28 2 40 15 32 27-7 10-20 3-18-7M169 115c22 13 25 28 13 34-10 5-17-6-11-13" strokeWidth="4" />
      </g>

      <g className="pavoncella-tail" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
        <path d="m153 65 34-24 3 43Z" fill="var(--pavoncella-wing, #70d7ca)" />
        <path d="m158 81 39-7-12 30Z" fill="currentColor" />
        <path d="m159 98 35 12-27 20Z" fill="var(--pavoncella-wing, #70d7ca)" />
        <path d="m183 47-7 25 13 9M192 78l-23 11 16 12M190 111l-25-4 3 20" fill="none" strokeWidth="2.5" />
        <circle cx="181" cy="59" r="4" fill="var(--pavoncella-eye, #ffca58)" strokeWidth="2" />
        <circle cx="184" cy="89" r="4" fill="var(--pavoncella-eye, #ffca58)" strokeWidth="2" />
        <circle cx="176" cy="116" r="4" fill="var(--pavoncella-eye, #ffca58)" strokeWidth="2" />
      </g>

      <path
        className="pavoncella-body"
        d="M54 47c14-4 26 6 29 20 3 13 9 19 25 24 18 6 38 2 54-8l9 31c-13 3-23 11-31 20-13 15-36 22-57 15-25-8-37-31-33-56 2-11 0-20-7-28Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="m45 56-29 16 33 5Z" fill="var(--pavoncella-wing, #70d7ca)" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
      <path d="m20 70 25-7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="61" cy="55" r="4" fill="var(--pavoncella-eye, #ffca58)" />

      <path className="pavoncella-wing" d="M70 88c24-13 50-6 67 16-15 27-47 35-69 17-7-6-7-23 2-33Z" fill="var(--pavoncella-wing, #70d7ca)" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
      <g fill="none" stroke="var(--pavoncella-detail, #0d2f29)" strokeLinecap="round" strokeWidth="3">
        <path d="m77 78 72 15M81 72l6 18m8-15 5 18m9-14 5 17m9-13 5 16m9-12 5 10" />
        <path d="M81 103c5-5 10-3 12 3-4 5-9 5-12-3ZM100 111c5-5 10-3 12 3-4 5-9 5-12-3ZM120 106c5-5 10-3 12 3-4 5-9 5-12-3ZM83 123c5-5 10-3 12 3-4 5-9 5-12-3ZM106 128c5-5 10-3 12 3-4 5-9 5-12-3Z" />
      </g>

      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4">
        <path d="M83 146 76 166m0 0-8 5m8-5 4 7M124 146l8 20m0 0-4 7m4-7 9 4" />
        <path d="M61 82c15 9 28 9 43 2 15-8 30-6 47 4" stroke="var(--pavoncella-eye, #ffca58)" strokeWidth="3" strokeDasharray="1 8" />
      </g>
    </svg>
  );
}
