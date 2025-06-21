import { Calendar, Droplets, Minus, Plus, User, X, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function TabungOksigen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [personName, setPersonName] = useState("");
  const [stockData, setStockData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://sadar-be.simogas.online/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const [stockRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/infostok`, { headers }),
        fetch(`${API_BASE}/log?tipe_item=oksigen`, { headers })
      ]);

      if (!stockRes.ok || !logRes.ok) {
        throw new Error("Gagal mengambil data dari server.");
      }

      const stockJson = await stockRes.json();
      const logJson = await logRes.json();

      setStockData(stockJson.stok_oksigen || []);
      setLogData(logJson.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const resetForm = () => {
    setAmount("");
    setNote("");
    setPersonName("");
  };

  const handleTransaction = async (type) => {
    if (!amount || !personName) {
      alert("Jumlah dan nama petugas harus diisi.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/transaksi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item: "oksigen",
          type: type,
          amount: parseInt(amount),
          note: note,
          person: personName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Gagal ${type === 'in' ? 'menambah' : 'mengambil'} stok.`);
      }

      alert(`Stok berhasil ${type === 'in' ? 'ditambahkan' : 'diambil'}!`);
      resetForm();
      setShowAddModal(false);
      setShowRemoveModal(false);
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };
  
  const totalStock = stockData.reduce((sum, item) => sum + parseInt(item.total, 10), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10">
        <div className="text-4xl font-bold mb-8">Manajemen Tabung Oksigen</div>

        <div className="bg-gradient-to-r from-[#E30030]/10 to-[#E30030]/5 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#E30030]/10">
          <div className="flex items-center space-x-6">
            <div className="p-6 bg-[#E30030]/20 rounded-2xl">
              <Droplets className="w-12 h-12 text-[#E30030]" />
            </div>
            <div>
              <p className="text-[#80808A] text-lg font-semibold">Total Stok</p>
              <h3 className="text-5xl font-extrabold text-[#1F1F1F] tracking-tight">
                {totalStock}
              </h3>
              <p className="text-[#80808A] text-base">Tabung</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center justify-center space-x-2 bg-[#E30030] text-[#FFFFFF] p-4 rounded-xl hover:bg-opacity-90 transition-colors font-semibold shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Stok</span>
            </button>
            <button
              onClick={() => { resetForm(); setShowRemoveModal(true); }}
              className="flex items-center justify-center space-x-2 bg-[#1F1F1F] text-[#FFFFFF] p-4 rounded-xl hover:bg-opacity-90 transition-colors font-semibold shadow"
            >
              <Minus className="w-5 h-5" />
              <span>Ambil Stok</span>
            </button>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl shadow-lg p-8 border border-[#80808A]/10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-[#1F1F1F]">Log Tabung Oksigen</h2>
            <div className="bg-[#E30030]/10 px-6 py-2 rounded-lg">
              <span className="text-[#E30030] font-semibold">
                Stok: {totalStock} Tabung
              </span>
            </div>
          </div>
          <div className="divide-y divide-[#80808A]/10">
            {logData.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between py-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-[#E30030]/10">
                    {log.type === "in" ? (
                      <Plus className="w-6 h-6 text-[#E30030]" />
                    ) : (
                      <Minus className="w-6 h-6 text-[#E30030]" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#1F1F1F]">
                      {log.type === "in"
                        ? "Penambahan Stok"
                        : "Pengurangan Stok"}
                    </h3>
                    <p className="text-[#80808A] text-sm">
                      {log.amount} tabung
                    </p>
                    <div className="flex items-center text-[#80808A] text-xs mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-[#80808A] text-xs">
                      <User className="w-4 h-4 mr-1" />
                      <span>{log.person}</span>
                    </div>
                    {log.note && (
                      <div className="flex items-center text-[#80808A] text-xs">
                        <span>Catatan: {log.note}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold ${
                    log.type === "in"
                      ? "bg-[#1F1F1F] text-[#FFFFFF]"
                      : "bg-[#E30030] text-[#FFFFFF]"
                  }`}
                >
                  {log.type === "in" ? "Masuk" : "Keluar"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FFFFFF] rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1F1F1F]">
                  Tambah Stok
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#80808A] hover:text-[#1F1F1F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#80808A] mb-2">
                    Jumlah Tabung
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-[#80808A]/20 rounded-lg focus:border-[#E30030] focus:ring-1 focus:ring-[#E30030]"
                    placeholder="Masukkan jumlah"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#80808A] mb-2">
                    Nama Petugas
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full p-3 border border-[#80808A]/20 rounded-lg focus:border-[#E30030] focus:ring-1 focus:ring-[#E30030]"
                    placeholder="Masukkan nama petugas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#80808A] mb-2">
                    Catatan
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-3 border border-[#80808A]/20 rounded-lg focus:border-[#E30030] focus:ring-1 focus:ring-[#E30030]"
                    rows="3"
                    placeholder="Masukkan catatan (opsional)"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleTransaction('in')}
                  className="flex-1 bg-[#E30030] text-[#FFFFFF] py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Tambah Stok
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#80808A] text-[#FFFFFF] py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {showRemoveModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FFFFFF] rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1F1F1F]">Ambil Stok</h3>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="text-[#80808A] hover:text-[#1F1F1F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#80808A] mb-2">
                      Jumlah Tabung
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 border border-[#80808A]/20 rounded-lg focus:border-[#E30030] focus:ring-1 focus:ring-[#E30030]"
                      placeholder="Masukkan jumlah"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#80808A] mb-2">
                      Nama Petugas
                    </label>
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      className="w-full p-3 border border-[#80808A]/20 rounded-lg focus:border-[#E30030] focus:ring-1 focus:ring-[#E30030]"
                      placeholder="Masukkan nama petugas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#80808A] mb-2">
                      Catatan
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full p-3 border border-[#80808A]/20 rounded-lg focus:border-[#E30030] focus:ring-1 focus:ring-[#E30030]"
                      rows="3"
                      placeholder="Masukkan catatan (opsional)"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleTransaction('out')}
                  className="flex-1 bg-[#E30030] text-[#FFFFFF] py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Ambil Stok
                </button>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="flex-1 bg-[#80808A] text-[#FFFFFF] py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
