export default function DashboardHeader() {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50/50 to-blue-50/30 dark:from-black dark:via-blue-950/20 dark:to-blue-950/10">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 md:py-20">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-tight">Dashboard</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">Track and analyze your spending with confidence</p>
        </div>
      </div>
    </div>
  )
}
