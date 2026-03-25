'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Deck Doctor', href: '/deck-doctor', icon: 'healing' },
  { label: 'Counter Guide', href: '/counter-guide', icon: 'shield' },
  { label: 'Tactical Replays', href: '/replay-analyzer', icon: 'slow_motion_video' },
  { label: 'News', href: '/news', icon: 'newspaper' },
  { label: 'Masterclass', href: '/tutorials', icon: 'school' },
  { label: 'Trophy Road', href: '/pro-tips', icon: 'emoji_events' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col py-8 bg-neutral-900/60 backdrop-blur-xl border-r border-white/10 shadow-[0_0_40px_rgba(26,115,232,0.08)] z-50">
      <div className="px-8 mb-12">
        <span className="text-lg font-black text-[#FFDB3C] tracking-tighter">Clash Royale Mentor</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'text-[#FFDB3C] bg-white/5 font-bold border-r-2 border-[#FFDB3C]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="font-medium uppercase text-xs tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="bg-surface-container-high rounded-xl p-4 mb-6 text-center">
          <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-secondary-container">military_tech</span>
          </div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Elite Mentor</p>
          <p className="text-xs font-bold text-white mb-3 tracking-tight">Grandmaster Status</p>
          <button className="w-full py-2 bg-gradient-to-br from-[#A9C7FF] to-[#0075E4] text-white text-[10px] font-black tracking-widest rounded-md hover:opacity-90 transition-opacity">
            PRO UPGRADE
          </button>
        </div>
      </div>
    </aside>
  );
}
