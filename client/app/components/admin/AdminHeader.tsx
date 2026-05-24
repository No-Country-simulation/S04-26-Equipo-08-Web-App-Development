import { Bell } from "lucide-react";
import Image from "next/image";

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = "Dashboard" }: AdminHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between bg-[#e8eaf0] px-8 shadow-xl">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <button type="button" className=" hover:bg-slate-300 rounded-full p-3 shadow-md">
          <Bell size={20} />
        </button>

        <Image
        width={200}
        height={200}
          src="https://i.pravatar.cc/100"
          alt="Admin"
          className="h-11 w-11 rounded-full object-cover"
        />
      </div>
    </header>
  );
}