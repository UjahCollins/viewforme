
const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Assigned: "bg-blue-100 text-blue-800",
  Confirmed: "bg-indigo-100 text-indigo-800",
  "In Progress": "bg-cyan-100 text-cyan-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Paid: "bg-green-100 text-green-800",
  Unpaid: "bg-amber-100 text-amber-800",
  Refunded: "bg-slate-100 text-slate-700",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-slate-100 text-slate-700",
  Suspended: "bg-red-100 text-red-800",
  "Under Review": "bg-blue-100 text-blue-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  "Awaiting Materials": "bg-amber-100 text-amber-800",
  "Under Review": "bg-blue-100 text-blue-800",
  Ready: "bg-teal-100 text-teal-800",
  Delivered: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  "Partially Refunded": "bg-orange-100 text-orange-800",
  New: "bg-amber-100 text-amber-800",
  Responded: "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

function StatusBadge({ status }) {
  const style =
    statusStyles[status] ||
    "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
