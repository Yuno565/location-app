import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import {
  ChevronLeft, Calendar, Fuel, Gauge, Users,
  Shield, MapPin, Star, Zap, Clock, CheckCircle
} from "lucide-react";
import ReservationModal from "../components/ReservationModal";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicles = await api.getVehicles();
        const found = vehicles.find(v => v.id === id);
        if (found) {
          setVehicle(found);
          setActiveImage(found.image_url);
          const gallery = await api.getVehicleImages(id);
          setImages(gallery.length > 0 ? gallery : [{ url: found.image_url }]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!vehicle) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white text-xl">Véhicule non trouvé.</p>
    </div>
  );

  const specs = [
    { icon: Fuel, label: "Carburant", value: vehicle.fuel_type },
    { icon: Gauge, label: "Boîte", value: vehicle.transmission },
    { icon: Users, label: "Places", value: `${vehicle.seats} places` },
    { icon: Calendar, label: "Année", value: vehicle.year },
  ];

  const included = [
    { icon: Shield, text: "Assurance tous risques incluse" },
    { icon: Zap, text: "Kilométrage illimité" },
    { icon: Clock, text: "Assistance 24h/24, 7j/7" },
    { icon: CheckCircle, text: "Véhicule inspecté & nettoyé" },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero gradient top */}
      <div className="relative h-16 bg-gradient-to-b from-black to-gray-950" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors mb-10 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour au catalogue</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
              <img
                key={activeImage}
                src={activeImage}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img.url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img.url
                        ? "border-orange-500 ring-2 ring-orange-500/30 scale-95"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Agency & availability pill */}
            <div className="flex items-center justify-between bg-gray-900 border border-white/10 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{vehicle.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-400">{vehicle.agency_name}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${vehicle.available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {vehicle.available ? "✓ Disponible" : "✗ Indisponible"}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="space-y-8">

            {/* Title + badge */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-4">
                <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  {vehicle.category}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {vehicle.brand}{" "}
                <span className="text-orange-400">{vehicle.model}</span>
              </h1>
              <p className="text-white/40 mt-2 text-sm">{vehicle.year} · {vehicle.fuel_type} · {vehicle.transmission}</p>
            </div>

            {/* Description */}
            {vehicle.description && (
              <p className="text-white/60 leading-relaxed border-l-2 border-orange-500/50 pl-4 italic">
                {vehicle.description}
              </p>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl p-4 text-center hover:border-orange-500/20 transition-colors">
                  <s.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Inclus dans la location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {included.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                    <item.icon className="w-4 h-4 text-orange-400 shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Tarif par jour</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-orange-400">
                      {vehicle.price_per_day?.toLocaleString()}
                    </span>
                    <span className="text-white/50 font-medium">MAD</span>
                  </div>
                </div>
                <div className="text-right text-xs text-white/30">
                  <p>~{Math.round(vehicle.price_per_day * 7)?.toLocaleString()} MAD / semaine</p>
                  <p>~{Math.round(vehicle.price_per_day * 30)?.toLocaleString()} MAD / mois</p>
                </div>
              </div>

              <button
                onClick={() => vehicle.available && setShowReservation(true)}
                disabled={!vehicle.available}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  vehicle.available
                    ? "bg-orange-500 hover:bg-orange-400 text-white shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95"
                    : "bg-gray-700 text-white/30 cursor-not-allowed"
                }`}
              >
                {vehicle.available ? "Réserver maintenant →" : "Indisponible"}
              </button>

              <p className="text-center text-xs text-white/25">Réservation sans engagement · Annulation gratuite</p>
            </div>

          </div>
        </div>
      </div>

      {showReservation && (
        <ReservationModal vehicle={vehicle} onClose={() => setShowReservation(false)} />
      )}
    </div>
  );
}
