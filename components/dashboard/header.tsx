export default function DashboardHeader() {
  return (
    <div className="border-b border-white/10 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and analyze your spending from Gmail receipts and payment emails</p>
      </div>
    </div>
  )
}
