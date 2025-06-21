import { Activity, Building2, Heart, Hospital, LogOut } from "lucide-react";
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

  const API_BASE = "https://sadar-be.simogas.online/api";

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
    
    // Validasi data sebelum dikirim
    if (!form.nama || !form.jenis_layanan || !form.alamat || !form.latitude || !form.longitude) {
      setError("Semua field faskes harus diisi!");
      setLoading(false);
      return;
    }
    
    if (!form.email || !form.name || !form.password || !form.nomor_whatsapp) {
      setError("Semua field akun harus diisi!");
      setLoading(false);
      return;
    }
    
    // Validasi format nomor WhatsApp
    const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,12}$/;
    console.log("Validasi nomor WhatsApp:", form.nomor_whatsapp, "Result:", whatsappRegex.test(form.nomor_whatsapp));
    if (!whatsappRegex.test(form.nomor_whatsapp)) {
      setError("Format nomor WhatsApp tidak valid! Gunakan format: 08xxxxxxxxxx (minimal 10 digit, maksimal 15 digit)");
      setLoading(false);
      return;
    }
    
    // Validasi password minimal 6 karakter
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter!");
      setLoading(false);
      return;
    }
    
    try {
      // ada 2 post dsni
      // ada post faskes dsni
      console.log("Mengirim data faskes:", {
        nama: form.nama,
        jenis_layanan: form.jenis_layanan,
        alamat: form.alamat,
        about: form.about,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      
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
      
      console.log("Response status faskes:", resFaskes.status);
      console.log("Response headers faskes:", Object.fromEntries(resFaskes.headers.entries()));
      
      const contentTypeFaskes = resFaskes.headers.get("content-type");
      if (!resFaskes.ok) {
        const errorText =
          contentTypeFaskes && contentTypeFaskes.includes("application/json")
            ? await resFaskes.json()
            : await resFaskes.text();
        console.log("Error response faskes:", errorText);
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

      // Pastikan faskes_id adalah number
      const faskesIdNumber = parseInt(faskesId);
      if (isNaN(faskesIdNumber)) {
        throw new Error("ID faskes tidak valid!");
      }

      // ada post akun dsni
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("nomor_whatsapp", form.nomor_whatsapp);
      formData.append("faskes_id", faskesIdNumber);
      formData.append("role", "admin_faskes");

      console.log("Mengirim data akun:", {
        name: form.name,
        email: form.email,
        password: form.password,
        nomor_whatsapp: form.nomor_whatsapp,
        faskes_id: faskesIdNumber,
        role: "admin_faskes"
      });

      // Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Coba dengan FormData terlebih dahulu
      let resAkun = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData,
      });
      
      // Jika gagal, coba dengan JSON format
      if (!resAkun.ok) {
        console.log("FormData gagal, mencoba dengan JSON format...");
        resAkun = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            nomor_whatsapp: form.nomor_whatsapp,
            faskes_id: faskesIdNumber,
            role: "admin_faskes"
          }),
        });
      }
      
      console.log("Response status akun:", resAkun.status);
      console.log("Response headers akun:", Object.fromEntries(resAkun.headers.entries()));
      
      const contentTypeAkun = resAkun.headers.get("content-type");
      let dataAkun;
      if (contentTypeAkun && contentTypeAkun.includes("application/json")) {
        dataAkun = await resAkun.json();
      } else {
        dataAkun = await resAkun.text();
      }
      
      console.log("Response data akun:", dataAkun);
      
      if (!resAkun.ok) {
        console.log("Error response akun - Status:", resAkun.status);
        console.log("Error response akun - Headers:", Object.fromEntries(resAkun.headers.entries()));
        console.log("Error response akun - Data:", dataAkun);
        
        // Check for unique constraint violation from Laravel
        if (dataAkun && typeof dataAkun.message === 'string' && dataAkun.message.includes('SQLSTATE[23000]')) {
             throw new Error("Email atau Nomor WhatsApp sudah terdaftar. Silakan gunakan yang lain.");
        }
        
        if (typeof dataAkun === "string" && dataAkun.includes("Duplicate entry")) {
          throw new Error("Nomor WhatsApp sudah terdaftar.");
        }
        throw new Error(`Error ${resAkun.status}: ${typeof dataAkun === "string" ? dataAkun : JSON.stringify(dataAkun)}`);
      }

      // Pastikan response menunjukkan success
      if (dataAkun && dataAkun.success === false) {
        console.log("Response menunjukkan success: false");
        throw new Error(dataAkun.message || "Gagal mendaftarkan akun");
      }

      console.log("Akun berhasil didaftarkan:", dataAkun);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center gap-2 bg-[#E30030] text-white px-4 py-2 rounded-lg hover:bg-[#b80024] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
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
