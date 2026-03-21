import { TilePosition, PlacementStep } from '@/lib/counterGuide/strategies';

interface ArenaRendererProps {
  placements: PlacementStep[];
  width?: number;
  height?: number;
}

export function ArenaRenderer({ placements, width = 350, height = 530 }: ArenaRendererProps) {
  // The arena image maps to an 18x32 tile grid
  // We calculate pixel positions from tile coordinates
  const tileW = width / 18;
  const tileH = height / 32;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10"
      style={{ width, height }}
    >
      {/* Real CR arena background */}
      <img
        src="/arena-bg.png"
        alt="Clash Royale Arena"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Slight dark overlay for contrast with markers */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Placement markers */}
      {placements.map((placement, idx) => {
        const px = placement.position.x * tileW;
        const py = placement.position.y * tileH;

        return (
          <div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: px, top: py, zIndex: 10 }}
          >
            {/* Glow pulse ring */}
            <div className="absolute inset-0 -m-3 rounded-full bg-[#FFD700]/20 animate-ping" style={{ animationDuration: '2s' }} />

            {/* Outer ring */}
            <div className="relative w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border-[3px] border-[#FFD700] shadow-[0_0_16px_rgba(255,215,0,0.5)] flex items-center justify-center">
              <span className="text-[#FFD700] font-black text-base leading-none">
                {idx + 1}
              </span>
            </div>

            {/* Card label */}
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-black/85 backdrop-blur-sm text-[#FFD700] text-[10px] px-2.5 py-1 rounded-lg font-bold tracking-wide border border-[#FFD700]/30 shadow-lg">
                {placement.card}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
