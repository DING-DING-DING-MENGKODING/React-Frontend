import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Droplet,
  Wind,
  Ambulance,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { dummyData } from "../dummy/data";

const HomeScreen = () => {
  const navigate = useNavigate();
  const ambulanceCount = dummyData.ambulance.length;
  
  const [ambulanceOrders, setAmbulanceOrders] = useState(dummyData.ambulanceOrders);
  const [ambulances] = useState(dummyData.ambulance);
  const [stockData, setStockData] = useState({ darah: 0, oksigen: 0 });
  const [loading, setLoading] = useState(true);

  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);
  const [selectedAmbulanceOrder, setSelectedAmbulanceOrder] = useState(null);

  const API_BASE = "https://sadar-be.simogas.online/api";

  const fetchStockData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const res = await fetch(`${API_BASE}/infostok`, { headers });
      if (!res.ok) {
        throw new Error("Gagal mengambil data stok.");
      }
      
      const data = await res.json();
      const darahTotal = (data.stok_darah || []).reduce((sum, item) => sum + parseInt(item.total, 10), 0);
      const oksigenTotal = (data.stok_oksigen || []).reduce((sum, item) => sum + parseInt(item.total, 10), 0);
      
      setStockData({ darah: darahTotal, oksigen: oksigenTotal });
    } catch (error) {
      console.error("Gagal mengambil data stok:", error);
      // Fallback ke data dummy jika API gagal
      setStockData({ darah: dummyData.kantongDarah.total, oksigen: dummyData.tabungOksigen.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const stats = [
    {
      title: "Ambulance Terpanggil",
      value: ambulanceCount,
      icon: Car,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Kantung Darah Tersalurkan",
      value: loading ? <Loader2 className="animate-spin w-6 h-6" /> : stockData.darah,
      icon: Droplet,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Tabung Oksigen Tersalurkan",
      value: loading ? <Loader2 className="animate-spin w-6 h-6" /> : stockData.oksigen,
      icon: Wind,
      color: "from-green-500 to-green-600",
    },
  ];

  const handleAssignAmbulance = (order, ambulanceId) => {
    const ambulance = ambulances.find((a) => a.id === ambulanceId);
    setAmbulanceOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, status: "assigned", assignedAmbulance: ambulance }
          : o
      )
    );
    setShowAmbulanceModal(false);
    
    const message = `
*Penugasan Ambulance Baru*

Mohon segera menuju lokasi untuk penjemputan pasien.

*Detail Pasien:*
- *Nama:* ${order.patientName}
- *Telepon:* ${order.phone}
- *Alamat:* ${order.address}
- *Kondisi:* ${order.condition}
- *Waktu Laporan:* ${order.time}

Terima kasih.
`.trim();

    const whatsappUrl = `https://wa.me/${ambulance.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    alert(
      `Pesan penugasan telah dikirim ke WhatsApp driver ${ambulance.driver} (${ambulance.plate}).`
    );
  };

  const pendingAmbulanceOrders = ambulanceOrders.filter(
    (order) => order.status === "pending"
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}
            ></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Ambulance className="w-6 h-6 mr-2 text-blue-600" />
            Pesanan Ambulance Menunggu
          </h2>
        </div>

        <div className="space-y-4">
          {pendingAmbulanceOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-4 transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {order.patientName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    {order.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {order.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {order.time}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#80808A] text-white">
                  Menunggu
                </span>
              </div>

              <div className="bg-red-50 p-3 rounded-lg mb-3">
                <p className="text-sm font-medium text-red-800">
                  Kondisi: {order.condition}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedAmbulanceOrder(order);
                  setShowAmbulanceModal(true);
                }}
                className="w-full bg-[#E30030] text-white py-2 px-4 rounded-lg transition-colors hover:bg-[#b80025] focus:ring-2 focus:ring-red-400 focus:outline-none"
              >
                Tugaskan Ambulance
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAmbulanceModal && selectedAmbulanceOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Pilih Ambulance
            </h3>
            <p className="text-gray-600 mb-4">
              Untuk pasien: {selectedAmbulanceOrder.patientName}
            </p>

            <div className="space-y-3 mb-6">
              {ambulances
                .filter((a) => a.status === "available")
                .map((ambulance) => (
                  <button
                    key={ambulance.id}
                    onClick={() =>
                      handleAssignAmbulance(
                        selectedAmbulanceOrder,
                        ambulance.id
                      )
                    }
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {ambulance.plate}
                        </p>
                        <p className="text-sm text-gray-600">
                          Sopir: {ambulance.driver}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Tersedia
                      </span>
                    </div>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setShowAmbulanceModal(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
