import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

const DetailData = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/${id}`,
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      }
    };
    fetchDetail();
  }, [id]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isSuccess = data.status_name === "SUCCESS";

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 py-12 px-4 sm:px-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-lg bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Banner Status Header */}
        <div
          className={`px-8 py-6 flex items-center justify-between border-b ${isSuccess ? "bg-emerald-500/5 border-emerald-500/10" : "bg-rose-500/5 border-rose-500/10"}`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Status Transaksi
            </span>
            {/* Menggunakan Komponen Reusable */}
            <StatusBadge status={data.status_name} />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              ID Transaksi
            </span>
            <span className="text-lg font-mono font-semibold text-slate-200">
              #{data.id}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          <div className="pb-6 border-b border-slate-800/60">
            <p className="text-sm text-slate-400 mb-1">Jumlah Barang</p>
            <p className="text-3xl font-bold text-slate-50 font-mono tracking-tight">
              {data.amount}{" "}
              <span className="text-lg text-slate-500 font-sans font-medium">
                unit
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Nama Pelanggan
              </p>
              <p className="font-medium text-slate-200">{data.customername}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Tanggal Transaksi
              </p>
              <p className="font-medium text-slate-200 text-sm">
                {formatDate(data.transactiondate)}
              </p>
            </div>

            <div className="col-span-2 pt-4 border-t border-slate-800/40">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Detail Produk
              </p>
              <p className="font-medium text-slate-200">
                {data.productname}{" "}
                <span className="text-slate-500 font-mono text-sm ml-2">
                  ({data.productid})
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p>
                Dibuat oleh:{" "}
                <span className="text-slate-400 font-medium">
                  {data.createby}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p>Waktu Sistem:</p>
              <p className="font-mono">
                {new Date(data.createon).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0d1424] border-t border-slate-800 flex justify-between items-center">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </Link>
          <Link
            to={`/edit/${data.id}`}
            className="px-5 py-2 text-sm font-medium rounded-lg text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all inline-flex items-center gap-2"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Transaksi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailData;
