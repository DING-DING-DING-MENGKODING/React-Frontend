import { Activity, Building2, Heart, Hospital } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [infoFaskes, setInfoFaskes] = useState({
    nama: "",
    alamat: "",
    latitude: "",
    longitude: "",
  });

  const [akunFaskes, setAkunFaskes] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleInfoChange = (e) => {
    setInfoFaskes({
      ...infoFaskes,
      [e.target.name]: e.target.value,
    });
  };

  const handleAkunChange = (e) => {
    setAkunFaskes({
      ...akunFaskes,
      [e.target.name]: e.target.value,
    });
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    // TODO: Kirim data infoFaskes ke backend
    alert("Faskes Informasi Tersimpan:\n" + JSON.stringify(infoFaskes, null, 2));
    setInfoFaskes({ nama: "", alamat: "", latitude: "", longitude: "" });
  };

  const handleAkunSubmit = (e) => {
    e.preventDefault();
    alert("Akun Faskes Tersimpan:\n" + JSON.stringify(akunFaskes, null, 2));
    setAkunFaskes({ email: "", username: "", password: "" });
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E30030] rounded-full mb-6">
            <Activity className="w-10 h-10 text-[#FFFFFF]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1F1F1F] mb-4">SADAR</h1>
          <p className="text-[#80808A] text-xl mb-8">Sistem Akses Darurat</p>
          {error && <p className="text-[#E30030] mb-4">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            className={`bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-left border border-[#80808A]/10 ${selectedType === "rs" ? "ring-2 ring-[#E30030]" : ""}`}
            onClick={() => handleSelectType("rs")}
            type="button"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-[#E30030] p-3 rounded-lg">
                <Hospital className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div>
                <h3 className="text-[#1F1F1F] font-bold">Rumah Sakit</h3>
                <p className="text-[#80808A] text-sm">Daftar Akun Rumah Sakit</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#80808A]/10 text-[#1F1F1F] rounded-full text-xs">
                Ambulance
              </span>
              <span className="px-3 py-1 bg-[#80808A]/10 text-[#1F1F1F] rounded-full text-xs">
                Kantong Darah
              </span>
              <span className="px-3 py-1 bg-[#80808A]/10 text-[#1F1F1F] rounded-full text-xs">
                Tabung Oksigen
              </span>
            </div>
          </button>

          <button
            className={`bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-left border border-[#80808A]/10 ${selectedType === "puskesmas" ? "ring-2 ring-[#E30030]" : ""}`}
            onClick={() => handleSelectType("puskesmas")}
            type="button"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-[#E30030] p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div>
                <h3 className="text-[#1F1F1F] font-bold">
                  Pusat Kesehatan Masyarakat
                </h3>
                <p className="text-[#80808A] text-sm">Daftar Akun Puskesmas</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#80808A]/10 text-[#1F1F1F] rounded-full text-xs">
                Ambulance
              </span>
              <span className="px-3 py-1 bg-[#80808A]/10 text-[#1F1F1F] rounded-full text-xs">
                Tabung Oksigen
              </span>
            </div>
          </button>

          <button
            className={`bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-left border border-[#80808A]/10 ${selectedType === "pmi" ? "ring-2 ring-[#E30030]" : ""}`}
            onClick={() => handleSelectType("pmi")}
            type="button"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-[#E30030] p-3 rounded-lg">
                <Heart className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div>
                <h3 className="text-[#1F1F1F] font-bold">Palang Merah Indonesia</h3>
                <p className="text-[#80808A] text-sm">Daftar Akun PMI</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#80808A]/10 text-[#1F1F1F] rounded-full text-xs">
                Kantong Darah
              </span>
            </div>
          </button>
        </div>

        {selectedType && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <form
              onSubmit={handleInfoSubmit}
              className="bg-white rounded-xl shadow-lg p-6 border border-[#80808A]/10"
            >
              <h2 className="text-xl font-bold mb-4 text-[#1F1F1F]">
                Tambah Faskes (Informasi) {selectedType === "rs" && "RS"}
                {selectedType === "puskesmas" && "Puskesmas"}
                {selectedType === "pmi" && "PMI"}
              </h2>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Nama Faskes</label>
                <input
                  type="text"
                  name="nama"
                  value={infoFaskes.nama}
                  onChange={handleInfoChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={infoFaskes.alamat}
                  onChange={handleInfoChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={infoFaskes.latitude}
                  onChange={handleInfoChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={infoFaskes.longitude}
                  onChange={handleInfoChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#E30030] text-white px-4 py-2 rounded hover:bg-[#b80024] transition"
              >
                Simpan Informasi
              </button>
            </form>

            <form
              onSubmit={handleAkunSubmit}
              className="bg-white rounded-xl shadow-lg p-6 border border-[#80808A]/10"
            >
              <h2 className="text-xl font-bold mb-4 text-[#1F1F1F]">
                Tambah Akun Faskes {selectedType === "rs" && "RS"}
                {selectedType === "puskesmas" && "Puskesmas"}
                {selectedType === "pmi" && "PMI"}
              </h2>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={akunFaskes.email}
                  onChange={handleAkunChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={akunFaskes.username}
                  onChange={handleAkunChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-[#1F1F1F] mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={akunFaskes.password}
                  onChange={handleAkunChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#E30030] text-white px-4 py-2 rounded hover:bg-[#b80024] transition"
              >
                Simpan Akun
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-[#80808A] text-sm">
            © 2025 SADAR - Sistem Akses Darurat
          </p>
        </div>
      </div>
    </div>
  );
}
