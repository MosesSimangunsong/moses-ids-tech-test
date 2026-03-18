import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge"; // <-- Import StatusBadge

const EditData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/${id}`
        );
        const data = response.data.data;
        if (data.transactiondate) {
          data.transactiondate = new Date(data.transactiondate)
            .toISOString()
            .slice(0, 16);
        }
        setFormData(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id]);

  // ─── Helper untuk auto-format ribuan di UI ───
  const formatRibuan = (angka) => {
    if (!angka && angka !== 0) return "";
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // ─── Modifikasi handleChange untuk filter input angka ───
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const rawValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: rawValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}`, {
        productID: formData.productid,
        productName: formData.productname,
        amount: formData.amount,
        customerName: formData.customername,
        status: formData.status,
        transactionDate: formData.transactiondate,
      });
      toast.success("Perubahan data berhasil disimpan!");
      navigate("/");
    } catch (error) {
      console.error("Gagal mengubah data:", error);
      toast.error("Gagal memperbarui data transaksi.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 py-12 px-4 sm:px-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-xl bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-50 tracking-tight">
              Edit Transaksi
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Perbarui data untuk Transaksi #{id}
            </p>
          </div>
          <Link
            to="/"
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                ID Transaksi
              </label>
              <input
                type="text"
                value={id}
                disabled
                className="w-full bg-[#0a0f1e]/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Product ID
              </label>
              <input
                type="text"
                name="productid"
                required
                value={formData.productid || ""}
                onChange={handleChange}
                className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Product Name
            </label>
            <input
              type="text"
              name="productname"
              required
              value={formData.productname || ""}
              onChange={handleChange}
              className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Amount (Qty)
              </label>
              <input
                type="text" // <-- Ubah ke text agar auto-format titik bekerja
                name="amount"
                required
                placeholder="Misal: 100"
                value={formatRibuan(formData.amount)} // <-- Bungkus dengan formatRibuan
                onChange={handleChange}
                className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Customer Name
              </label>
              <input
                type="text"
                name="customername"
                required
                value={formData.customername || ""}
                onChange={handleChange}
                className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* ── Custom Radio Buttons Menggunakan StatusBadge ── */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Status
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="cursor-pointer">
                  {/* Gunakan String() untuk berjaga-jaga jika backend mengirim angka 0 bukan string "0" */}
                  <input type="radio" name="status" value="0" checked={String(formData.status) === "0"} onChange={handleChange} className="peer sr-only" />
                  <div className="transition-all duration-200 opacity-50 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0a0f1e] peer-focus-visible:ring-indigo-500 rounded-full">
                    <StatusBadge status="SUCCESS" />
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="status" value="1" checked={String(formData.status) === "1"} onChange={handleChange} className="peer sr-only" />
                  <div className="transition-all duration-200 opacity-50 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0a0f1e] peer-focus-visible:ring-indigo-500 rounded-full">
                    <StatusBadge status="FAILED" />
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Transaction Date
              </label>
              <input
                type="datetime-local"
                name="transactiondate"
                required
                value={formData.transactiondate || ""}
                onChange={handleChange}
                className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-8 flex justify-end gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 text-sm font-medium rounded-lg text-slate-300 bg-slate-800/60 hover:bg-slate-700 hover:text-white transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Perbarui Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditData;