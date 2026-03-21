import Link from "next/link";

export default function Home() {
  return (
    <div className="hero-gradient">
      {/* Hero Section */}
      <section className="px-12 py-20 flex flex-col items-start relative overflow-hidden">
        <div className="max-w-4xl z-10">
          <span className="text-secondary-container font-black tracking-[0.3em] text-xs uppercase mb-4 block">
            PREMIUM TACTICAL ACCESS
          </span>
          <h2 className="text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-8">
            MASTER THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary-container to-secondary-container">
              ARENA
            </span>
          </h2>
          <p className="text-xl text-on-surface-variant max-w-xl mb-12 leading-relaxed">
            Deploy advanced AI-driven deck optimizations and high-fidelity match analysis.
            The ultimate command deck for the elite grandmaster.
          </p>
          <div className="flex gap-6">
            <Link
              href="/deck-doctor"
              className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              INITIALIZE LABORATORY
            </Link>
            <Link
              href="/pro-tips"
              className="px-10 py-5 bg-surface-container-high text-white font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-bright transition-colors"
            >
              VIEW RANKINGS
            </Link>
          </div>
        </div>
        {/* Background glow */}
        <div className="absolute right-[-10%] top-0 w-[60%] h-full opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-bl from-primary-container/30 via-transparent to-transparent rounded-full blur-3xl" />
        </div>
      </section>

      {/* Bento Grid: Tools & Insights */}
      <section className="px-12 pb-24 grid grid-cols-12 gap-8">
        {/* Deck Doctor AI - Large Card */}
        <Link href="/deck-doctor" className="col-span-12 md:col-span-8 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="z-10">
            <div className="flex justify-between items-start mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">psychology</span>
              </div>
              <span className="px-4 py-1 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold tracking-widest uppercase">
                Live Tactical Link
              </span>
            </div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Tactical Laboratory</h3>
            <p className="text-on-surface-variant max-w-md text-lg leading-relaxed mb-8">
              Our AI Deck Doctor analyzes your cards to provide real-time counter-meta adjustments and strategic insights.
            </p>
          </div>
          <div className="flex items-center gap-4 z-10">
            <span className="text-sm text-on-surface-variant font-medium">AI-Powered Deck Analysis</span>
          </div>
        </Link>

        {/* Replay Analyzer - Match History */}
        <Link href="/replay-analyzer" className="col-span-12 md:col-span-4 bg-surface-container-high rounded-xl p-10 flex flex-col border border-white/5">
          <div className="w-12 h-12 bg-tertiary-container/20 rounded-xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-tertiary text-2xl">slow_motion_video</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Match History</h3>
          <div className="space-y-4">
            <div className="p-4 bg-surface-container-lowest rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-medium">Win vs Clan_Nova</span>
              </div>
              <span className="text-[10px] text-outline uppercase font-bold">+32 TR</span>
            </div>
            <div className="p-4 bg-surface-container-lowest rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-sm font-medium">Loss vs Elite_One</span>
              </div>
              <span className="text-[10px] text-outline uppercase font-bold">-12 TR</span>
            </div>
            <div className="p-4 bg-surface-container-lowest rounded-lg flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-medium">Win vs Alpha_9</span>
              </div>
              <span className="text-[10px] text-outline uppercase font-bold">+28 TR</span>
            </div>
          </div>
          <span className="mt-auto pt-6 text-primary text-xs font-bold uppercase tracking-widest text-center">
            Analyze All Replays
          </span>
        </Link>

        {/* Masterclass / Tutorials */}
        <Link href="/tutorials" className="col-span-12 md:col-span-5 bg-surface-container rounded-xl p-10 border border-white/5 flex flex-col group">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-secondary-container">school</span>
            <span className="text-[10px] font-black tracking-widest text-secondary-container uppercase">Archive Masterclass</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-6 leading-tight">
            Elite Defensive <br />Mechanics
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Learn the micro-placement tactics used by top ladder players to mitigate tower damage.
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] font-bold text-outline uppercase">Browse Tutorials</span>
            <span className="text-xs text-secondary-container font-bold italic">Expert Access</span>
          </div>
        </Link>

        {/* Meta Stats / Counter Guide + Stats */}
        <div className="col-span-12 md:col-span-7 bg-[#1c1b1b] rounded-xl p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div>
              <h4 className="text-outline text-[10px] font-black tracking-[0.2em] uppercase mb-4">Meta Dominance</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white">Pekka Bridge-Spam</span>
                    <span className="text-primary font-bold">58% WR</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '58%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white">Log Bait Control</span>
                    <span className="text-primary font-bold">52% WR</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '52%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white">Lavahound Air</span>
                    <span className="text-primary font-bold">49% WR</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '49%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-highest rounded-2xl p-6 border border-white/5">
              <h4 className="text-outline text-[10px] font-black tracking-[0.2em] uppercase mb-6">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/counter-guide" className="aspect-square rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                  <span className="material-symbols-outlined text-primary mb-1">shield</span>
                  <span className="text-[10px] text-white font-bold uppercase">Counter</span>
                </Link>
                <Link href="/pro-tips" className="aspect-square rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <span className="material-symbols-outlined text-outline mb-1">emoji_events</span>
                  <span className="text-[10px] text-outline font-bold uppercase">Trophy</span>
                </Link>
              </div>
              <div className="mt-6">
                <Link href="/counter-guide" className="block w-full py-3 bg-primary-container text-white text-[10px] font-black uppercase tracking-widest rounded-lg text-center hover:bg-primary-container/80 transition-colors">
                  Load Meta Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Clan Alliances Section */}
      <section className="px-12 pb-24">
        <div className="mb-12">
          <h3 className="text-4xl font-black text-white tracking-tighter mb-4">CLAN ALLIANCES</h3>
          <p className="text-on-surface-variant font-medium">Top global rankings for the current competitive season.</p>
        </div>
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-outline uppercase">Rank</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-outline uppercase">Alliance</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-outline uppercase">Region</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-outline uppercase">Trophies</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-outline uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6 font-black text-secondary-container">#01</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FFDB3C]/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    </div>
                    <span className="text-white font-bold">Nova Esports</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-on-surface-variant font-medium text-sm">Global / EU</td>
                <td className="px-8 py-6 font-mono text-white tracking-tighter">1,248,390</td>
                <td className="px-8 py-6 text-right">
                  <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-[10px] font-black uppercase tracking-widest">Ascending</span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6 font-black text-on-surface-variant">#02</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                    </div>
                    <span className="text-white font-bold">Queso Kings</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-on-surface-variant font-medium text-sm">Americas</td>
                <td className="px-8 py-6 font-mono text-white tracking-tighter">1,210,550</td>
                <td className="px-8 py-6 text-right">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Stable</span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6 font-black text-on-surface-variant">#03</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-tertiary-container/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>swords</span>
                    </div>
                    <span className="text-white font-bold">Sandstorm Dynasty</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-on-surface-variant font-medium text-sm">Middle East</td>
                <td className="px-8 py-6 font-mono text-white tracking-tighter">1,195,200</td>
                <td className="px-8 py-6 text-right">
                  <span className="px-3 py-1 rounded-full bg-red-400/10 text-red-400 text-[10px] font-black uppercase tracking-widest">At Risk</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-12 border-t border-white/5 bg-surface-container-lowest">
        <div className="flex justify-between items-center opacity-40">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">SYSTEM OPERATIONAL</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">LATENCY: 14MS</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">v4.2.0-ELITE</span>
        </div>
      </footer>
    </div>
  );
}
