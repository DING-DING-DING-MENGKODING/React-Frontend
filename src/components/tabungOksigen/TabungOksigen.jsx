import { Calendar, Droplets, Minus, Plus, User, X } from "lucide-react";
import React, { useState } from "react";
import { dummyData } from "../dummy/data";

export default function TabungOksigen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [personName, setPersonName] = useState("");

  const oksigen = dummyData.tabungOksigen;

  return (
    <>
      <div className="space y-6">
        <div className="text-4xl font-bold mb-8">Manajemen Tabung Oksigen</div>
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-[#E30030]/10 rounded-xl">
                  <Droplets className="w-8 h-8 text-[#E30030]" />
                </div>
                <div>
                  <p className="text-[#80808A]">Total Stok</p>
                  <h3 className="text-3xl font-bold text-[#1F1F1F]">
                    {oksigen.total}
                  </h3>
                  <p className="text-[#80808A] text-sm">Tabung</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center space-x-2 bg-[#E30030] text-[#FFFFFF] p-4 rounded-xl hover:bg-opacity-90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Stok</span>
              </button>
              <button
                onClick={() => setShowRemoveModal(true)}
                className="flex items-center justify-center space-x-2 bg-[#1F1F1F] text-[#FFFFFF] p-4 rounded-xl hover:bg-opacity-90 transition-colors"
              >
                <Minus className="w-5 h-5" />
                <span>Ambil Stok</span>
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 border border-[#80808A]/10 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">
                Log Tabung Oksigen
              </h2>
              <div className="bg-[#E30030]/10 px-4 py-2 rounded-lg mb-3">
                <span className="text-[#E30030] font-medium">
                  Stok: {oksigen.total} Tabung
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {oksigen.logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between border-b border-[#80808A]/10 pb-4 mb-4 last:border-b-0 last:mb-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-[#E30030]/10">
                      {log.type === "in" ? (
                        <Plus className="w-6 h-6 text-[#E30030]" />
                      ) : (
                        <Minus className="w-6 h-6 text-[#E30030]" />
                      )}
                    </div>
                    <div>
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
                        <span>{log.date}</span>
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    Jumlah Kantong
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
                      Jumlah Kantong
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
