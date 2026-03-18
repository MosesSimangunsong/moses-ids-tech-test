// src/components/TransactionTable.jsx
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

// Helper: format Rupiah
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// Helper: format tanggal
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TransactionTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center py-8 text-slate-400 text-sm">
        Tidak ada data untuk periode ini.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {["ID", "Produk", "Amount", "Customer", "Status", "Tanggal", "Aksi"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-indigo-50/40 transition-colors duration-150"
            >
              {/* ID — monospace agar rapi */}
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                #{item.id}
              </td>

              {/* Product Name */}
              <td className="px-4 py-3 font-medium text-slate-800">
                {item.productname}
              </td>

              {/* Amount */}
              <td className="px-4 py-3 font-semibold text-slate-700">
                {formatRupiah(item.amount)}
              </td>

              {/* Customer */}
              <td className="px-4 py-3 text-slate-600">{item.customername}</td>

              {/* Status Badge */}
              <td className="px-4 py-3">
                <StatusBadge status={item.status_name} />
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                {formatDate(item.transactiondate)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/detail/${item.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                  >
                    Detail
                  </Link>
                  <Link
                    to={`/edit/${item.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;