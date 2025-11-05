import { useRef, useState } from "react";

type Props = {
  before: string;
  after: string;
  alt?: string;
};

export default function BeforeAfter({ before, after, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, percent)));
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      className="relative w-full overflow-hidden rounded-2xl select-none cursor-ew-resize"
    >
      <img src={after} alt={alt} className="block w-full" />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img src={before} alt={alt} className="block w-full" />
      </div>
      <div
        className="absolute inset-y-0"
        style={{ left: `${pos}%` }}
      >
        <div className="w-px bg-white/70 h-full" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/90 text-onyx text-xs font-semibold px-2 py-0.5 rounded-full">
          ↔
        </div>
      </div>
    </div>
  );
}
