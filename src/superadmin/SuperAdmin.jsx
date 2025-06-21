import { Activity, Building2, Heart, Hospital } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    jenis_layanan: "",
    alamat: "",
    about: "",
    latitude: "",
    longitude: "",
    email: "",
    name: "",
    password: "",
    nomor_whatsapp: "",
  });

  const API_BASE = "http://192.168.108.79:8000/api";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // ada 2 post dsni
      // ada post faskes dsni
      const resFaskes = await fetch(`${API_BASE}/faskes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nama: form.nama,
          jenis_layanan: form.jenis_layanan,
          alamat: form.alamat,
          about: form.about,
          latitude: form.latitude,
          longitude: form.longitude,
        }),
      });
      const contentTypeFaskes = resFaskes.headers.get("content-type");
      if (!resFaskes.ok) {
        const errorText =
          contentTypeFaskes && contentTypeFaskes.includes("application/json")
            ? await resFaskes.json()
            : await resFaskes.text();
        throw new Error(
          typeof errorText === "string"
            ? errorText
            : JSON.stringify(errorText)
        );
      }
      const dataFaskes = await resFaskes.json();
      console.log("Response faskes:", dataFaskes);
      const faskesId = dataFaskes.data?.id;
      console.log("Faskes ID:", faskesId);
      if (!faskesId) throw new Error("ID faskes tidak ditemukan!");

      // ada post akun dsni
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("nomor_whatsapp", form.nomor_whatsapp);
      formData.append("faskes_id", faskesId);
      formData.append("role", "admin_faskes");

      const resAkun = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData,
      });
      const contentTypeAkun = resAkun.headers.get("content-type");
      let dataAkun;
      if (contentTypeAkun && contentTypeAkun.includes("application/json")) {
        dataAkun = await resAkun.json();
      } else {
        dataAkun = await resAkun.text();
      }
      if (!resAkun.ok) {
        if (typeof dataAkun === "string" && dataAkun.includes("Duplicate entry")) {
          throw new Error("Nomor WhatsApp sudah terdaftar.");
        }
        throw new Error(typeof dataAkun === "string" ? dataAkun : JSON.stringify(dataAkun));
      }

      alert("Faskes dan akun berhasil ditambahkan!");
      setForm({
        nama: "",
        jenis_layanan: "",
        alamat: "",
        about: "",
        latitude: "",
        longitude: "",
        email: "",
        name: "",
        password: "",
        nomor_whatsapp: "",
      });
      setSelectedType("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F1F1F] mb-4">SADAR</h1>
          <p className="text-[#80808A] text-xl mb-8">Sistem Akses Darurat</p>
          {error && <p className="text-[#E30030] mb-4">{error}</p>}
        </div>

        <div className="flex gap-6 mb-10">
          <button
            className={`bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-left border border-[#80808A]/10 ${
              selectedType === "rs" ? "ring-2 ring-[#E30030]" : ""
            }`}
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
            className={`bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-left border border-[#80808A]/10 ${
              selectedType === "puskesmas" ? "ring-2 ring-[#E30030]" : ""
            }`}
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
            className={`bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-left border border-[#80808A]/10 ${
              selectedType === "pmi" ? "ring-2 ring-[#E30030]" : ""
            }`}
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
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-6 border border-[#80808A]/10"
          >
            <h2 className="text-xl font-bold mb-4 text-[#1F1F1F]">
              Tambah Faskes & Akun {selectedType === "rs" && "RS"}
              {selectedType === "puskesmas" && "Puskesmas"}
              {selectedType === "pmi" && "PMI"}
            </h2>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Nama Faskes</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Jenis Layanan</label>
              <input
                type="text"
                name="jenis_layanan"
                value={form.jenis_layanan}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Alamat</label>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Tentang Faskes</label>
              <input
                type="text"
                name="about"
                value={form.about}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3 mt-6">
              <label className="block text-[#1F1F1F] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Nama Admin</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-[#1F1F1F] mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                name="nomor_whatsapp"
                value={form.nomor_whatsapp}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#E30030] text-white px-4 py-2 rounded hover:bg-[#b80024] transition"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Faskes & Akun"}
            </button>
          </form>
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
