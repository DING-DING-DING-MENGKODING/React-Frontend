import { Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function Profile() {
  const [faskes, setFaskes] = useState(null);
  const [akun, setAkun] = useState(null);
  const [editFaskes, setEditFaskes] = useState(false);
  const [editAkun, setEditAkun] = useState(false);
  const [formFaskes, setFormFaskes] = useState({});
  const [formAkun, setFormAkun] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token)
          throw new Error("Token tidak ditemukan, silakan login ulang.");

        const akunRes = await fetch(
          `https://sadar-be.simogas.online/api/auth/me?token=${token}`,
          {
            method: "POST",
          }
        );
        const akunContentType = akunRes.headers.get("content-type");
        if (!akunRes.ok) throw new Error("Gagal mengambil data akun");
        if (!akunContentType || !akunContentType.includes("application/json")) {
          const text = await akunRes.text();
          throw new Error("Respon akun bukan JSON: " + text.slice(0, 100));
        }
        const akunData = await akunRes.json();
        setAkun(akunData);
        setFormAkun(akunData);

        const faskesId = akunData.faskes_id || akunData.faskes?.id;
        if (faskesId) {
          const faskesRes = await fetch(
            `https://sadar-be.simogas.online/api/faskes/${faskesId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          const faskesContentType = faskesRes.headers.get("content-type");
          if (!faskesRes.ok) throw new Error("Gagal mengambil data faskes");
          if (
            !faskesContentType ||
            !faskesContentType.includes("application/json")
          ) {
            const text = await faskesRes.text();
            throw new Error("Respon faskes bukan JSON: " + text.slice(0, 100));
          }
          const faskesData = await faskesRes.json();
          setFaskes(faskesData.data);
          setFormFaskes(faskesData.data);
        }
      } catch (err) {
        alert(err.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFaskesChange = (e) => {
    setFormFaskes({ ...formFaskes, [e.target.name]: e.target.value });
  };
  const handleEditFaskes = () => setEditFaskes(true);
  const handleSaveFaskes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://sadar-be.simogas.online/api/faskes/${faskes.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formFaskes),
        }
      );
      if (!res.ok) throw new Error("Gagal menyimpan data faskes.");
      const updatedFaskes = await res.json();
      setFaskes(updatedFaskes.data);
      setEditFaskes(false);
      alert("Data faskes berhasil diperbarui!");
    } catch (err) {
      alert(err.message);
    }
  };
  const handleCancelFaskes = () => {
    setFormFaskes(faskes);
    setEditFaskes(false);
  };

  const handleAkunChange = (e) => {
    setFormAkun({ ...formAkun, [e.target.name]: e.target.value });
  };
  const handleEditAkun = () => setEditAkun(true);
  const handleSaveAkun = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(formAkun).forEach((key) => {
        formData.append(key, formAkun[key]);
      });
      // Jika ada field password kosong, hapus dari data yang dikirim
      if (!formAkun.password) {
        formData.delete("password");
      }

      const res = await fetch(
        `https://sadar-be.simogas.online/api/auth/update`,
        {
          method: "POST", // Menggunakan POST untuk mengakomodasi file upload
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan data akun.");
      }
      
      const updatedAkun = await res.json();
      setAkun(updatedAkun.data);
      setEditAkun(false);
      alert("Data akun berhasil diperbarui!");
    } catch (err) {
      alert(err.message);
    }
  };
  const handleCancelAkun = () => {
    setFormAkun(akun);
    setEditAkun(false);
  };

  const akunFields = [
    { name: "name", label: "Nama Admin", type: "text" },
    { name: "role", label: "Role", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "nomor_whatsapp", label: "No. Telepon", type: "text" },
  ];

  if (loading || !akun) {
    return <div className="text-center py-10">Memuat data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-2xl rounded-2xl p-8 space-y-10">
      <div>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-red-600 shadow">
            <img
              src={akun.logo}
              alt="Logo Faskes"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Data Faskes</h2>
            <span className="text-sm text-gray-500">
              Informasi fasilitas kesehatan
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Nama Faskes
            </label>
            {editFaskes ? (
              <input
                type="text"
                name="name"
                value={formFaskes.name || ""}
                onChange={handleFaskesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : faskes ? (
              <div className="text-gray-800">{faskes.name}</div>
            ) : (
              <div className="text-gray-500 italic">Tidak ada data faskes</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Tipe Faskes
            </label>
            {editFaskes ? (
              <input
                type="text"
                name="type"
                value={formFaskes.type || ""}
                onChange={handleFaskesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : faskes ? (
              <div className="text-gray-800">{faskes.type}</div>
            ) : (
              <div className="text-gray-500 italic">Tidak ada data faskes</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Alamat
            </label>
            {editFaskes ? (
              <input
                type="text"
                name="address"
                value={formFaskes.address || ""}
                onChange={handleFaskesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : faskes ? (
              <div className="text-gray-800">{faskes.address}</div>
            ) : (
              <div className="text-gray-500 italic">Tidak ada data faskes</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Kota
            </label>
            {editFaskes ? (
              <input
                type="text"
                name="city"
                value={formFaskes.city || ""}
                onChange={handleFaskesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : faskes ? (
              <div className="text-gray-800">{faskes.city}</div>
            ) : (
              <div className="text-gray-500 italic">Tidak ada data faskes</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Provinsi
            </label>
            {editFaskes ? (
              <input
                type="text"
                name="province"
                value={formFaskes.province || ""}
                onChange={handleFaskesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : faskes ? (
              <div className="text-gray-800">{faskes.province}</div>
            ) : (
              <div className="text-gray-500 italic">Tidak ada data faskes</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Kontak
            </label>
            {editFaskes ? (
              <input
                type="text"
                name="contact"
                value={formFaskes.contact || ""}
                onChange={handleFaskesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : faskes ? (
              <div className="text-gray-800">{faskes.contact}</div>
            ) : (
              <div className="text-gray-500 italic">Tidak ada data faskes</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {editFaskes ? (
            <>
              <button
                onClick={handleSaveFaskes}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Simpan
              </button>
              <button
                onClick={handleCancelFaskes}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              onClick={handleEditFaskes}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Edit Data Faskes
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-red-600 shadow">
            <img
              src={akun.image}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Akun Faskes</h2>
            <span className="text-sm text-gray-500">
              Data akun admin fasilitas kesehatan
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {akunFields.map((field) => (
            <div key={field.name}>
              <label className="block text-gray-600 font-semibold mb-1">
                {field.label}
              </label>
              {editAkun ? (
                <input
                  type={field.type}
                  name={field.name}
                  value={formAkun[field.name] || ""}
                  onChange={handleAkunChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              ) : (
                <div className="text-gray-800">{akun[field.name]}</div>
              )}
            </div>
          ))}
          {editAkun && (
            <div className="md:col-span-2">
              <label className="block text-gray-600 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formAkun.password || ""}
                  onChange={handleAkunChange}
                  className="w-full border rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-red-400"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <span className="text-xs text-gray-400">Minimal 6 karakter</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {editAkun ? (
            <>
              <button
                onClick={handleSaveAkun}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Simpan
              </button>
              <button
                onClick={handleCancelAkun}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              onClick={handleEditAkun}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Edit Akun
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
