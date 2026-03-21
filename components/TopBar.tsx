'use client';

export default function TopBar() {
  return (
    <header className="w-full h-20 sticky top-0 z-40 bg-[#131313]/70 backdrop-blur-2xl flex justify-between items-center px-12">
      <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#A9C7FF] to-[#0075E4]">
        Clash Royale Mentor
      </h1>

      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-outline hover:text-primary cursor-pointer transition-colors">notifications</span>
        <span className="material-symbols-outlined text-outline hover:text-primary cursor-pointer transition-colors">settings</span>
        <div className="w-10 h-10 rounded-full border border-primary/20 bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-lg">person</span>
        </div>
      </div>
    </header>
  );
}
