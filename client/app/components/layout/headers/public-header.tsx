import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";

export default function PublicHeader() {
  return (
    <header className="w-full top-0 z-50 bg-background neo-raised">
      <nav className="flex justify-between items-center px-8 h-16 w-full max-w-7xl mx-auto">
        <div className="text-xl font-semibold text-primary">
          <Link href="/">
            NorthPay
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium">

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
            Soporte
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/register" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            <FiUsers />
          </Link>
          <Link href="/private/login" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            <GrUserAdmin />
          </Link>
        </div>
      </nav>
    </header>
  )
}