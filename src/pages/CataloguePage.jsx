import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Users, Fuel, Settings2, Filter, X } from "lucide-react";
import ReservationModal from "../components/ReservationModal";
import { api } from "../lib/api";

const CITIES = ["Casablanca", "Marrakech", "Rabat", "Tanger", "Fès", "Agadir", "Essaouira", "Ouarzazate", "Meknès", "Nador"];
const CATEGORIES = ["Économique", "Berline", "SUV", "Luxe", "Minivan", "Sportive", "Utilitaire"];
const TRANSMISSIONS = ["Manuelle", "Automatique"];
const FUELS = ["Essence", "Diesel", "Hybride", "Électrique"];

const categoryColors = {
  "Luxe": "bg-amber-100 text-amber-800",
  "SUV": "bg-blue-100 text-blue-800",
  "Berline": "bg-purple-100 text-purple-800",
  "Économique": "bg-green-100 text-green-800",
  "Sportive": "bg-red-100 text-red-800",
  "Minivan": "bg-cyan-100 text-cyan-800",
  "Utilitaire": "bg-gray-100 text-gray-800",
};

export default function CataloguePage() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    category: "",
    transmission: "",
    fuel_type: "",
    maxPrice: 5000,
    available: false,
  });
  const [reservationVehicle, setReservationVehicle] = useState(null);
  const [detailVehicle, setDetailVehicle]           = useState(null);

  useEffect(() => {
    api.getVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      if (search && !`${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.city && v.city !== filters.city) return false;
      if (filters.category && v.category !== filters.category) return false;
      if (filters.transmission && v.transmission !== filters.transmission) return false;
      if (filters.fuel_type && v.fuel_type !== filters.fuel_type) return false;
      if (v.price_per_day > filters.maxPrice) return false;
      if (filters.available && !v.available) return false;
      return true;
    });
  }, [search, filters, vehicles]);

  const resetFilters = () => {
    setFilters({ city: "", category: "", transmission: "", fuel_type: "", maxPrice: 5000, available: false });
    setSearch("");
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 5000 && v !== false).length;

  const handleConfirmReservation = async (reservation) => {
    const res = await api.createReservation(reservation);
    if (res.success) {
      console.log("Réservation enregistrée !");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Catalogue des véhicules</h1>
          <p className="text-white/60">{filtered.length} véhicule{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>

          {/* Search bar */}
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher un véhicule..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} activeCount={activeFiltersCount} />
          </aside>

          {/* Mobile filter button */}
          <div className="lg:hidden mb-4 w-full">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtres {activeFiltersCount > 0 && <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
            </button>
            {showFilters && (
              <div className="mt-4">
                <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} activeCount={activeFiltersCount} />
              </div>
            )}
          </div>

          {/* Vehicles Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Aucun véhicule trouvé</h3>
                <p className="text-muted-foreground text-sm mb-4">Essayez de modifier vos critères de recherche.</p>
                <button onClick={resetFilters} className="text-sm text-primary font-medium hover:underline">Réinitialiser les filtres</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onDetail={() => setDetailVehicle(vehicle)}
                    onReserve={() => vehicle.available && setReservationVehicle(vehicle)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Detail Modal */}
      {detailVehicle && (
        <VehicleDetailModal
          vehicle={detailVehicle}
          onClose={() => setDetailVehicle(null)}
          onReserve={() => { setDetailVehicle(null); setReservationVehicle(detailVehicle); }}
        />
      )}

      {/* Reservation Form Modal */}
      {reservationVehicle && (
        <ReservationModal
          vehicle={reservationVehicle}
          onClose={() => setReservationVehicle(null)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </div>
  );
}

function FilterPanel({ filters, setFilters, onReset, activeCount }) {
  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filtres</h3>
          {activeCount > 0 && (
            <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="w-3 h-3" /> Effacer
          </button>
        )}
      </div>

      <div className="space-y-5">
        <FilterSelect label="Ville" value={filters.city} onChange={v => update("city", v)} options={CITIES} allLabel="Toutes les villes" />
        <FilterSelect label="Catégorie" value={filters.category} onChange={v => update("category", v)} options={CATEGORIES} allLabel="Toutes" />
        <FilterSelect label="Transmission" value={filters.transmission} onChange={v => update("transmission", v)} options={TRANSMISSIONS} allLabel="Toutes" />
        <FilterSelect label="Carburant" value={filters.fuel_type} onChange={v => update("fuel_type", v)} options={FUELS} allLabel="Tous" />

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Prix max : {filters.maxPrice.toLocaleString()} MAD/jour
          </label>
          <input
            type="range"
            min={100}
            max={5000}
            step={50}
            value={filters.maxPrice}
            onChange={e => update("maxPrice", Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>100</span>
            <span>5 000 MAD</span>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.available}
            onChange={e => update("available", e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-sm text-foreground">Disponibles uniquement</span>
        </label>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, allLabel }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">{allLabel}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function VehicleCard({ vehicle, onDetail, onReserve }) {
  const navigate = useNavigate();
  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image — click to see details */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => navigate(`/vehicule/${vehicle.id}`)}>
        <img
          src={vehicle.image_url}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[vehicle.category] || "bg-gray-100 text-gray-700"}`}>
            {vehicle.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${vehicle.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {vehicle.available ? "✓ Disponible" : "✗ Réservé"}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">Voir détails</span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-foreground text-lg">{vehicle.brand} <span className="font-normal text-muted-foreground">{vehicle.model}</span></h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            {vehicle.city} · {vehicle.year}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Users, val: `${vehicle.seats} places` },
            { icon: Settings2, val: vehicle.transmission },
            { icon: Fuel, val: vehicle.fuel_type },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 bg-muted/50 rounded-lg py-2">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center leading-tight">{item.val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">{vehicle.price_per_day.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground"> MAD/jour</span>
          </div>
          <button
            onClick={onReserve}
            disabled={!vehicle.available}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              vehicle.available
                ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {vehicle.available ? "Réserver" : "Indisponible"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VehicleDetailModal({ vehicle, onClose, onReserve }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-video">
          <img src={vehicle.image_url} alt={vehicle.brand} className="w-full h-full object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{vehicle.brand} {vehicle.model}</h2>
              <p className="text-muted-foreground">{vehicle.year} · {vehicle.city}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{vehicle.price_per_day.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground"> MAD/jour</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-5">{vehicle.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              ["Catégorie", vehicle.category],
              ["Transmission", vehicle.transmission],
              ["Carburant", vehicle.fuel_type],
              ["Places", vehicle.seats],
              ["Agence", vehicle.agency_name],
            ].map(([k, v]) => (
              <div key={k} className="bg-muted/50 rounded-lg px-3 py-2">
                <span className="text-xs text-muted-foreground block">{k}</span>
                <span className="text-sm font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>

          {vehicle.features?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Équipements</h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map(f => (
                  <span key={f} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">✓ {f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-border text-muted-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              Fermer
            </button>
            <button
              onClick={onReserve}
              disabled={!vehicle.available}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                vehicle.available
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {vehicle.available ? "🚗 Réserver ce véhicule" : "Indisponible"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
