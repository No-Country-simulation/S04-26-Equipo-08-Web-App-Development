"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  icon: React.ElementType;
  label: string;
  href: string;
  onClick?: () => void;
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  onClick,
}: Props) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-medium transition-all ${
        isActive
          ? "bg-[#dfe3f0] text-indigo-500 shadow-inner"
          : "text-slate-500 hover:bg-white/40"
      }`}
    >
      <Icon size={20} />

      {label && (
        <span className="whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}