// src/components/StatusBadge.jsx

const STATUS_STYLES = {
  SUCCESS: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  FAILED:  "bg-rose-100 text-rose-700 ring-rose-200",
  PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
};

const STATUS_ICONS = {
  SUCCESS: "✓",
  FAILED:  "✗",
  PENDING: "◷",
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  const icon  = STATUS_ICONS[status]  ?? "•";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${style}`}
    >
      <span>{icon}</span>
      {status}
    </span>
  );
};

export default StatusBadge;