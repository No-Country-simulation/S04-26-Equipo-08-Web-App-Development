export default function DashboardHeader() {
  return (
    <header className="w-full top-0 z-50 bg-background neo-raised">
      <nav className="flex justify-between items-center px-8 h-16 w-full max-w-7xl mx-auto">
        <div className="text-xl font-semibold text-primary">
          NorthPay
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <a
            className="text-primary font-semibold border-b-2 border-primary transition-colors duration-200"
            href="#"
          >
            Dashboard
          </a>

          <a
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
            href="#"
          >
            Contractors
          </a>

          <a
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
            href="#"
          >
            Reports
          </a>

          <a
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
            href="#"
          >
            Settings
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-all duration-200 active:neo-inset">
            🔔
          </button>

          <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-all duration-200 active:neo-inset">
            👤
          </button>
        </div>
      </nav>
    </header>
  )
}