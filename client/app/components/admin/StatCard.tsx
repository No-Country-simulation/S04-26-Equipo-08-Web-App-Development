import React from "react";

interface Props {
  title: string;
  value: string;
  icon: React.ElementType;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
      <div className="mb-5">
        <div className="w-fit rounded-2xl bg-indigo-100 p-3">
          <Icon
            className="text-indigo-500"
            size={24}
          />
        </div>
      </div>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {title}
      </p>
    </div>
  );
}