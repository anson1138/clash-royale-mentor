import { TilePosition, PlacementStep } from '@/lib/counterGuide/strategies';

interface ArenaRendererProps {
  placements: PlacementStep[];
  width?: number;
  height?: number;
}

export function ArenaRenderer({ placements, width = 350, height = 600 }: ArenaRendererProps) {
  const tileSize = width / 18; // 18 tiles wide (standard CR arena)
  const totalRows = 32; // 32 tiles tall
  
  // Tower positions (approximate, in tile coordinates)
  const towers = {
    // Your side (bottom)
    yourKing: { x: 9, y: 30, label: '👑' },
    yourLeftPrincess: { x: 3.5, y: 28, label: '🏰' },
    yourRightPrincess: { x: 14.5, y: 28, label: '🏰' },
    // Opponent side (top)
    opponentKing: { x: 9, y: 2, label: '👑' },
    opponentLeftPrincess: { x: 3.5, y: 4, label: '🏰' },
    opponentRightPrincess: { x: 14.5, y: 4, label: '🏰' },
  };
  
  return (
    <div className="relative rounded-lg overflow-hidden border-4 border-amber-800 shadow-lg" style={{ width, height }}>
      {/* Arena background - gradient from green grass */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-600" />
      
      {/* Grid overlay for tile visualization */}
      <svg className="absolute inset-0 opacity-10" width={width} height={height}>
        {/* Vertical lines */}
        {Array.from({ length: 19 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * tileSize}
            y1={0}
            x2={i * tileSize}
            y2={height}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: totalRows + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * (height / totalRows)}
            x2={width}
            y2={i * (height / totalRows)}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      
      {/* River (middle section) */}
      <div 
        className="absolute w-full bg-gradient-to-b from-blue-400 via-blue-300 to-blue-400 opacity-60" 
        style={{ 
          top: '48%', 
          height: '4%',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
        }} 
      />
      
      {/* Bridge indicators */}
      <div className="absolute left-[20%] bg-amber-700 opacity-50 rounded" style={{ top: '48%', width: '10%', height: '4%' }} />
      <div className="absolute right-[20%] bg-amber-700 opacity-50 rounded" style={{ top: '48%', width: '10%', height: '4%' }} />
      
      {/* Side labels */}
      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow-lg">
        OPPONENT
      </div>
      <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow-lg">
        YOUR SIDE
      </div>
      
      {/* Tower markers */}
      {Object.entries(towers).map(([key, tower]) => (
        <div
          key={key}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: tower.x * tileSize,
            top: tower.y * (height / totalRows),
          }}
        >
          <div className="relative">
            {/* Tower icon */}
            <div className={`text-2xl ${key.includes('King') ? 'text-3xl' : 'text-xl'}`}>
              {tower.label}
            </div>
          </div>
        </div>
      ))}
      
      {/* Placement markers */}
      {placements.map((placement, idx) => {
        const x = placement.position.x * tileSize;
        const y = placement.position.y * (height / totalRows);
        
        return (
          <div
            key={idx}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: x,
              top: y,
              zIndex: 10,
            }}
          >
            {/* Marker circle with glow effect */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-80 border-3 border-yellow-600 shadow-lg" />
              <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-50 blur-sm scale-125" />
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900 drop-shadow-md" style={{ zIndex: 11 }}>
                {idx + 1}
              </div>
            </div>
            
            {/* Card label below marker */}
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-gray-900 bg-opacity-80 text-white text-xs px-2 py-0.5 rounded font-semibold shadow-md">
                {placement.card}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
