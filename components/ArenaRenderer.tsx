import { TilePosition, PlacementStep } from '@/lib/counterGuide/strategies';

interface ArenaRendererProps {
  placements: PlacementStep[];
  width?: number;
  height?: number;
}

export function ArenaRenderer({ placements, width = 360, height = 640 }: ArenaRendererProps) {
  const tileSize = width / 18; // 18 tiles wide
  
  return (
    <div className="relative bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden border-4 border-brown-600" style={{ width, height }}>
      {/* River (middle line) */}
      <div className="absolute w-full h-8 bg-blue-400 opacity-50" style={{ top: '50%', transform: 'translateY(-50%)' }} />
      
      {/* Grid overlay (optional, for debugging) */}
      {/* <div className="absolute inset-0 grid grid-cols-18 grid-rows-32 opacity-20">
        {Array.from({ length: 18 * 32 }).map((_, i) => (
          <div key={i} className="border border-white" />
        ))}
      </div> */}
      
      {/* Placement markers */}
      {placements.map((placement, idx) => {
        const x = placement.position.x * tileSize;
        const y = placement.position.y * tileSize;
        
        return (
          <div
            key={idx}
            className="absolute"
            style={{
              left: x,
              top: y,
              width: tileSize * 2,
              height: tileSize * 2,
            }}
          >
            {/* Marker circle */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-70 border-4 border-yellow-600 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900">
                {idx + 1}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 rounded p-3 text-white text-sm">
        <div className="font-bold mb-2">Placement Steps:</div>
        {placements.map((placement, idx) => (
          <div key={idx} className="mb-1">
            <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full text-center text-black font-bold mr-2">
              {idx + 1}
            </span>
            {placement.card}: {placement.description}
          </div>
        ))}
      </div>
    </div>
  );
}
