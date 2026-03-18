import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatRibuan = (angka) => {
  if (!angka && angka !== 0) return "0";
  return new Intl.NumberFormat("id-ID").format(angka);
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatPeriod = (yyyyMm) => {
  const [year, month] = yyyyMm.split("-");
  return new Date(year, parseInt(month) - 1).toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

// ─── Definisi Lebar & Alignment Kolom Tabel (Agars Konsisten) ───────────────
const TABLE_HEADERS = [
  { label: "ID", className: "w-[8%] text-left" },
  { label: "Produk", className: "w-[10%] text-left" },
  { label: "Jumlah", className: "w-[15%] text-right" },
  { label: "Pelanggan", className: "w-[18%] text-left" },
  { label: "Status", className: "w-[12%] text-center" },
  { label: "Tanggal", className: "w-[15%] text-center" },
  { label: "Aksi", className: "w-[23%] text-center" },
];

const SkeletonRow = () => (
  <tr className="border-b border-slate-800">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div
          className="h-4 rounded-md bg-slate-700/60 animate-pulse"
          style={{ width: `${60 + Math.random() * 30}%` }}
        />
      </td>
    ))}
  </tr>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#0a0f1e] px-4 sm:px-6 lg:px-8 py-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="h-8 w-56 rounded-lg bg-slate-700/60 animate-pulse mb-2" />
          <div className="h-4 w-80 rounded-md bg-slate-800/80 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-slate-700/60 animate-pulse" />
      </div>
      {[...Array(2)].map((_, gi) => (
        <div
          key={gi}
          className="mb-8 rounded-xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl"
        >
          <div className="px-5 py-4 border-b border-slate-800">
            <div className="h-5 w-40 rounded-md bg-slate-700/60 animate-pulse" />
          </div>
          <table className="w-full table-fixed min-w-[900px]">
            <tbody>
              {[...Array(3)].map((_, ri) => (
                <SkeletonRow key={ri} />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 ring-1 ring-rose-500/30 flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-1">
        Gagal Memuat Data
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Coba Lagi
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20 flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-7 h-7 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
        />
      </svg>
    </div>
    <p className="text-slate-300 font-medium">Belum ada transaksi</p>
    <p className="text-slate-500 text-sm mt-1">
      Mulai dengan menambahkan transaksi pertama Anda
    </p>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const Home = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions",
      );
      const rawData = response.data.data;

      const grouped = rawData.reduce((acc, curr) => {
        const dateStr = curr.transactiondate.substring(0, 7);
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(curr);
        return acc;
      }, {});

      setGroupedData(grouped);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus transaksi #${id}? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        toast.success("Transaksi berhasil dihapus!");
        fetchData(); // Sekarang dia akan kenal siapa itu fetchData!
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        toast.error("Gagal menghapus transaksi. Data mungkin sudah terhapus.");
      }
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={fetchData} />;

  // Urutkan dari yang terbaru ke yang terlama
  const sortedPeriods = Object.keys(groupedData).sort((a, b) =>
    b.localeCompare(a),
  );
  const totalTransactions = Object.values(groupedData).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div
      className="min-h-screen bg-[#0a0f1e]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1f2d45; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #2d3f5a; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-500/40 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
                Daftar Transaksi
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-10.5">
              <span className="text-indigo-400 font-semibold">
                {totalTransactions}
              </span>{" "}
              transaksi dari{" "}
              <span className="text-indigo-400 font-semibold">
                {sortedPeriods.length}
              </span>{" "}
              periode
            </p>
          </div>

          <Link to="/add">
            <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30 whitespace-nowrap">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Data
            </button>
          </Link>
        </div>

        {/* ── Empty State ───────────────────────────────────────────── */}
        {sortedPeriods.length === 0 && <EmptyState />}

        {/* ── Period Groups ─────────────────────────────────────────── */}
        <div className="space-y-8">
          {sortedPeriods.map((monthYear) => {
            const items = groupedData[monthYear];
            const successCount = items.filter(
              (i) => i.status_name === "SUCCESS",
            ).length;

            return (
              <div
                key={monthYear}
                className="rounded-xl border border-slate-800 bg-[#111827] shadow-2xl overflow-hidden transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-[#0d1424]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/60" />
                    <h2 className="text-sm font-semibold text-slate-100 tracking-wide">
                      {formatPeriod(monthYear)}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <span className="inline-flex items-center rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      {items.length} transaksi
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                      {successCount} sukses
                    </span>
                  </div>
                </div>

                {/* Table - Menggunakan table-fixed agar lebar kolom konsisten */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm table-fixed min-w-[900px]">
                    <thead>
                      <tr className="border-b border-slate-800">
                        {TABLE_HEADERS.map((h) => (
                          <th
                            key={h.label}
                            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${h.className}`}
                          >
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {items.map((item, rowIdx) => (
                        <tr
                          key={item.id}
                          className="group transition-colors duration-150 hover:bg-slate-800/40"
                          style={{ animationDelay: `${rowIdx * 40}ms` }}
                        >
                          {/* ID */}
                          <td className="px-4 py-3.5 truncate">
                            <span
                              className="font-mono text-xs text-slate-500 group-hover:text-slate-400 transition-colors"
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              #{String(item.id).padStart(4, "0")}
                            </span>
                          </td>

                          {/* Product Name */}
                          <td className="px-4 py-3.5 truncate">
                            <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                              {item.productname}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3.5 text-right truncate">
                            <span
                              className="font-semibold text-slate-100 tabular-nums"
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {formatRibuan(item.amount)}
                            </span>
                          </td>

                          {/* Customer Name */}
                          <td className="px-4 py-3.5 truncate">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-500/20 ring-1 ring-indigo-500/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-indigo-400 text-xs font-bold leading-none">
                                  {item.customername?.[0]?.toUpperCase() ?? "?"}
                                </span>
                              </div>
                              <span className="text-slate-300 text-sm truncate">
                                {item.customername}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 text-center">
                            <StatusBadge status={item.status_name} />
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-center truncate">
                            <span
                              className="text-xs text-slate-400 tabular-nums"
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {formatDate(item.transactiondate)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Tombol Detail */}
                              <Link to={`/detail/${item.id}`}>
                                <button
                                  aria-label={`Lihat detail transaksi ${item.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 hover:bg-slate-700 hover:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 transition-all duration-150"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  Detail
                                </button>
                              </Link>

                              {/* Tombol Edit */}
                              <Link to={`/edit/${item.id}`}>
                                <button
                                  aria-label={`Edit transaksi ${item.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 hover:border-indigo-500/50 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-all duration-150"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                              </Link>

                              {/* Tombol Hapus (Dipisah dari Link Edit) */}
                              <button
                                onClick={() => handleDelete(item.id)}
                                aria-label={`Hapus transaksi ${item.id}`}
                                className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-all duration-150"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-slate-800 bg-[#0d1424] flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    Menampilkan {items.length} dari {items.length} data
                  </span>
                  <span className="text-xs text-slate-600">
                    Total Barang:{" "}
                    <span
                      className="text-slate-400 font-semibold font-mono"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {formatRibuan(
                        items.reduce((s, i) => s + Number(i.amount), 0),
                      )}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        {sortedPeriods.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-600">
            <span>Sistem Manajemen Transaksi</span>
            <span>
              Total keseluruhan:{" "}
              <span
                className="text-slate-400 font-semibold"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {formatRibuan(
                  Object.values(groupedData)
                    .flat()
                    .reduce((s, i) => s + Number(i.amount), 0),
                )}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
