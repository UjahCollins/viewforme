
import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-4 text-3xl font-extrabold text-[#17324D]">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <Icon size={24} />
        </div>
      </div>

      {description && (
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
          <ArrowUpRight
            size={16}
            className="text-[#2A9D8F]"
          />

          <p className="text-xs text-slate-500">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

export default StatCard;
