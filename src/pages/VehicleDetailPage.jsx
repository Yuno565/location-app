import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { ChevronLeft, Calendar, Fuel, Gauge, Users, Shield, MapPin, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="pt-32 text-center text-white">Chargement...</div>;
  if (!vehicle) return <div className="pt-32 text-center text-white">Véhicule non trouvé.</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Retour */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Retour au catalogue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galerie */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`img-${id}`}
            className="aspect-[16/10] rounded-3xl overflow-hidden bg-muted border border-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img.url)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img.url ? "border-primary scale-95" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Détails */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs font-semibold text-primary uppercase">Véhicule Premium</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2">
              {vehicle.brand} <span className="text-primary">{vehicle.model}</span>
            </h1>
            <div className="flex items-center gap-2 text-white/50">
              <MapPin className="w-4 h-4" />
              <span>Disponible à {vehicle.city}</span>
              <span className="mx-2">•</span>
              <span className="text-primary font-semibold">{vehicle.agency_name}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Fuel, label: "Carburant", value: vehicle.fuel_type },
              { icon: Gauge, label: "Boîte", value: vehicle.transmission },
              { icon: Users, label: "Places", value: `${vehicle.seats} places` },
              { icon: Calendar, label: "Année", value: vehicle.year },
            ].map((spec, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                <spec.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{spec.label}</p>
                <p className="text-sm font-semibold text-white">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
            <div className="flex items-end justify-between pb-6 border-b border-white/10">
              <div>
                <p className="text-sm text-white/50 mb-1">Tarif journalier</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary">{vehicle.price_per_day}</span>
                  <span className="text-white/60 font-medium">MAD/jour</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-500 font-medium mb-1 flex items-center justify-end gap-1">
                  <Shield className="w-4 h-4" /> Assurance incluse
                </p>
                <p className="text-xs text-white/40">Kilométrage illimité</p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed italic">
              "{vehicle.description}"
            </p>

            <button 
              onClick={() => navigate('/catalogue')}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95"
            >
              Réserver maintenant
            </button>
          </div>

          <div className="flex items-center gap-8 text-white/40 pt-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest">Garantie Qualité</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
