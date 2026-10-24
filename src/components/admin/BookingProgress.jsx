
import { Check } from "lucide-react";

const steps = [
  "Requested",
  "Paid",
  "Viewer",
  "Confirmed",
  "Completed",
  "Delivered",
];

function BookingProgress({
  paymentStatus,
  viewer,
  status,
  reportDelivered,
}) {
  const completed = [
    true,
    paymentStatus === "Paid",
    Boolean(viewer),
    ["Confirmed", "In Progress", "Completed"].includes(status),
    status === "Completed",
    reportDelivered,
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[650px] items-start">
        {steps.map((step, index) => (
          <div
            key={step}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {index < steps.length - 1 && (
              <div
                className={`absolute left-1/2 top-5 h-0.5 w-full ${
                  completed[index] && completed[index + 1]
                    ? "bg-[#2A9D8F]"
                    : "bg-slate-200"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                completed[index]
                  ? "border-[#2A9D8F] bg-[#2A9D8F] text-white"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              {completed[index] ? (
                <Check size={18} />
              ) : (
                <span className="text-sm font-semibold">
                  {index + 1}
                </span>
              )}
            </div>

            <span className="mt-3 text-xs font-semibold text-[#17324D]">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingProgress;
