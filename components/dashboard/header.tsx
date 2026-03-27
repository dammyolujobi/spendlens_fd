export default function DashboardHeader() {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50/50 to-blue-50/30 dark:from-black dark:via-blue-950/20 dark:to-blue-950/10">
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 py-4 sm:py-6 md:py-8">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">Track and analyze your spending with confidence</p>
        </div>
      </div>
    </div>
  )
}
