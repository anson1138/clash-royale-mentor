export default function ProTips() {
  return (
    <div className="p-12 space-y-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Elite Strategies</span>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">Trophy Road</h2>
      </div>

      <div className="bg-surface-container-low rounded-xl p-10 border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-14 h-14 bg-secondary-container/20 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Coming Soon</h3>
          <p className="text-on-surface-variant mb-4 max-w-lg leading-relaxed">
            Learn advanced techniques from supreme experts: king tower activation, kiting, placement tiles, and more.
          </p>
          <p className="text-sm text-outline">
            Expert content from top players with detailed explanations and examples.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-secondary-container/5 rounded-full blur-[60px]" />
      </div>
    </div>
  );
}
