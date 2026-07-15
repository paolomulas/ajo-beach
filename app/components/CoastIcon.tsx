export type CoastIconName = "wind" | "wave" | "water" | "thermometer" | "cloud" | "location" | "crowd" | "parking" | "leaf" | "camera" | "bell" | "sun" | "relax" | "spark" | "surf" | "kite";

export function CoastIcon({ name, className = "" }: { name: CoastIconName; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {name === "wind" && <><path d="M3 7h10.5c3.3 0 3.3-4.5.2-4.5-1.4 0-2.4.8-2.7 1.9"/><path d="M3 12h15c3.5 0 3.8 4.8.3 4.8-1.6 0-2.7-.9-3-2.2M3 17h7.5"/></>}
      {name === "wave" && <><path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M4 18h16"/></>}
      {name === "water" && <><path d="M12 2S6.5 9 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9 12 2 12 2Z"/><path d="M9.5 15.5c.7 1 1.5 1.4 2.7 1.5"/></>}
      {name === "thermometer" && <><path d="M9 4a3 3 0 0 1 6 0v9.2a5 5 0 1 1-6 0V4Z"/><path d="M12 7v9M9 10h3"/></>}
      {name === "cloud" && <path d="M6.5 18.5h11a4.5 4.5 0 0 0 .2-9A6 6 0 0 0 6.2 8.2 5.2 5.2 0 0 0 6.5 18.5Z"/>}
      {name === "location" && <><path d="M20 10c0 5.5-8 12-8 12S4 15.5 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>}
      {name === "crowd" && <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.3"/><path d="M3.5 20c.4-4 2.3-6 5.5-6s5.2 2 5.5 6M14 15c3.6-.7 5.8 1 6.5 4"/></>}
      {name === "parking" && <><rect x="4" y="2.5" width="16" height="19" rx="4"/><path d="M9 17V7h4.2a3.5 3.5 0 0 1 0 7H9"/></>}
      {name === "leaf" && <><path d="M20.5 3.5C12 3.5 5 7.2 5 13.2c0 3.4 2.7 5.8 6 5.3 5.8-.8 8.6-7.6 9.5-15Z"/><path d="M3 21c3.2-5 7.5-8.2 12.8-11"/></>}
      {name === "camera" && <><rect x="2.5" y="5.5" width="19" height="14" rx="3"/><path d="m8 5.5 1.2-2h5.6l1.2 2"/><circle cx="12" cy="12.5" r="4"/><circle cx="18.3" cy="8.7" r=".7" fill="currentColor" stroke="none"/></>}
      {name === "bell" && <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></>}
      {name === "sun" && <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></>}
      {name === "relax" && <><path d="M3 18h18M5 18c.5-5.5 4-9 9-9 2.4 0 4.5.7 6 2"/><path d="M14 9V4M11.5 4h5L14 9"/></>}
      {name === "spark" && <><path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>}
      {name === "surf" && <><path d="M2 14c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 6-3"/><path d="M5 18c2.8 0 2.8-2 5.6-2s2.8 2 5.6 2"/><path d="M14 4c2 1 3.5 2.5 4 5"/></>}
      {name === "kite" && <><path d="m13 3 7 7-8 4-5-5 6-6Z"/><path d="m7 9 13 1M12 14c-2 2-1 3-3 4s-3 0-4 3"/></>}
    </svg>
  );
}
