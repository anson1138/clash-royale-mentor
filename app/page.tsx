import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Clash Royale Mentor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Level up your game with AI-powered coaching
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Deck Doctor */}
          <Link href="/deck-doctor" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏥</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Deck Doctor
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Get your deck analyzed with expert tips. Receive grades from F to S tier with actionable improvements.
              </p>
            </div>
          </Link>

          {/* Counter Guide */}
          <Link href="/counter-guide" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🛡️</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Counter Guide
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Learn how to counter any card with placement diagrams and step-by-step strategies.
              </p>
            </div>
          </Link>

          {/* Replay Analyzer */}
          <Link href="/replay-analyzer" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Replay Analyzer
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Analyze your recent battles to identify patterns and mistakes you need to fix.
              </p>
            </div>
          </Link>

          {/* Tutorials */}
          <Link href="/tutorials" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Tutorials
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Browse 20+ expert tutorials on deck building, synergy, and advanced mechanics.
              </p>
            </div>
          </Link>

          {/* Pro Tips */}
          <Link href="/pro-tips" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Pro Tips
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Learn advanced strategies from top players: kiting, placement tiles, and more.
              </p>
            </div>
          </Link>

          {/* Admin Sources */}
          <Link href="/admin/sources" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Admin Sources
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage expert content sources (YouTube videos, articles, guides).
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
