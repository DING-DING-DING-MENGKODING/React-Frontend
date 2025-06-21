import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { dummyData } from "../dummy/data";

export default function Ambulance() {
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);
  const [selectedAmbulanceOrder, setSelectedAmbulanceOrder] = useState(null);

  const [ambulanceOrders, setAmbulanceOrders] = useState(dummyData.ambulanceOrders);
  const ambulances = dummyData.ambulance;

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
    alert(
      `WhatsApp terkirim ke ${ambulance.driver} (${ambulance.plate})\n\nDetail Pasien:\n- Nama: ${order.patientName}\n- Telepon: ${order.phone}\n- Alamat: ${order.address}\n- Kondisi: ${order.condition}\n- Waktu: ${order.time}`
    );
  };

  const handleCompleteOrder = (orderId) => {
    setAmbulanceOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "completed" } : o))
    );
    alert("Foto bukti diterima dari sopir. Pesanan selesai!");
  };
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Ambulance</h1>
      <>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            {ambulanceOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "pending"
                        ? "bg-[#80808A] text-[#FFFFFF]"
                        : order.status === "assigned"
                        ? "bg-[#E30030] text-[#FFFFFF]"
                        : "bg-[#1F1F1F] text-[#FFFFFF]"
                    }`}
                  >
                    {order.status === "pending"
                      ? "Menunggu"
                      : order.status === "assigned"
                      ? "Ditugaskan"
                      : "Selesai"}
                  </span>
                </div>

                <div className="bg-red-50 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium text-red-800">
                    Kondisi: {order.condition}
                  </p>
                </div>

                {order.status === "pending" && (
                  <button
                    onClick={() => {
                      setSelectedAmbulanceOrder(order);
                      setShowAmbulanceModal(true);
                    }}
                    className="w-full bg-[#E30030] hover:bg-opacity-90 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Tugaskan Ambulance
                  </button>
                )}

                {order.status === "assigned" && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Ditugaskan ke:{" "}
                        <span className="font-medium">
                          {order.assignedAmbulance?.driver}
                        </span>{" "}
                        ({order.assignedAmbulance?.plate})
                      </p>
                    </div>
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tandai Selesai
                    </button>
                  </div>
                )}
              </div>
            ))}
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
      </>
    </>
  );
}
