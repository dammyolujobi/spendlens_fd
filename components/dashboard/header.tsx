export default function DashboardHeader() {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50/50 to-blue-50/30 dark:from-black dark:via-blue-950/20 dark:to-blue-950/10">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-0.5 sm:mb-1 md:mb-2 tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">Track and analyze your spending with confidence</p>
        </div>
      </div>
    </div>
  )
}
