import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Star, Clock, Car, MapPin, ChevronRight } from "lucide-react";
import { api } from "../lib/api";

const STATS = [
  { value: "500+", label: "Véhicules disponibles" },
  { value: "10", label: "Villes au Maroc" },
  { value: "4.8★", label: "Note moyenne" },
  { value: "24/7", label: "Support client" },
];

const CITIES = [
  { name: "Marrakech", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Koutoubia_Mosque_Marrakech.jpg/1200px-Koutoubia_Mosque_Marrakech.jpg", desc: "La Koutoubia" },
  { name: "Casablanca", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hassan_II_Mosque_Casablanca_Morocco.jpg/1200px-Hassan_II_Mosque_Casablanca_Morocco.jpg", desc: "Mosquée Hassan II" },
  { name: "Tanger", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Tanger_Port_View.jpg/1200px-Tanger_Port_View.jpg", desc: "La Corniche" },
  { name: "Agadir", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Agadir_Bay_Morocco.jpg/1200px-Agadir_Bay_Morocco.jpg", desc: "La Baie d'Agadir" },
];

const FEATURES = [
  { icon: Shield, title: "Assurance complète", desc: "Tous nos véhicules sont assurés tous risques pour votre tranquillité." },
  { icon: Star, title: "Qualité certifiée", desc: "Véhicules récents, entretenus et inspectés régulièrement." },
  { icon: Clock, title: "Réservation instantanée", desc: "Confirmez votre véhicule en quelques clics, sans attente." },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getVehicles().then(data => {
      setFeatured(data.filter(v => v.available).slice(0, 4));
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1539129790489-e82aa9d3fc5f?w=1920&q=80"
            alt="Désert du Sahara Maroc"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Plateforme N°1 au Maroc</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
              Louez la voiture
              <span className="block text-primary mt-2">de vos rêves</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              Découvrez le Maroc à votre rythme. Des véhicules premium dans toutes les grandes villes du Royaume.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Car className="w-5 h-5" />
                Voir les véhicules
              </Link>
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Mes réservations
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10">
              {[
                { icon: Shield, text: "Assurance incluse" },
                { icon: Clock, text: "Annulation gratuite 24h" },
                { icon: Star, text: "Avis 4.8/5" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Sélection</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mt-2">
                Véhicules en vedette
              </h2>
            </div>
            <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Destinations</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mt-3">
              Explorez le Maroc
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Récupérez votre véhicule dans les plus grandes villes du Royaume
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CITIES.map(city => (
              <Link
                key={city.name}
                to={`/catalogue?city=${city.name}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{city.desc}</p>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">{city.name}</h3>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Voir les voitures <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pourquoi nous</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mt-3">
              Un service d'exception
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function VehicleCard({ vehicle }) {
  const categoryColors = {
    "Luxe": "bg-amber-100 text-amber-800",
    "SUV": "bg-blue-100 text-blue-800",
    "Berline": "bg-purple-100 text-purple-800",
    "Économique": "bg-green-100 text-green-800",
    "Sportive": "bg-red-100 text-red-800",
    "Minivan": "bg-cyan-100 text-cyan-800",
    "Utilitaire": "bg-gray-100 text-gray-800",
  };

  return (
    <Link to={`/vehicule/${vehicle.id}`} className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
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
            {vehicle.available ? "Disponible" : "Réservé"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{vehicle.brand}</h3>
        <p className="text-sm text-muted-foreground">{vehicle.model} · {vehicle.year}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {vehicle.city}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <span className="text-xl font-bold text-primary">{vehicle.price_per_day.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground"> MAD/jour</span>
          </div>
          <span className="text-xs text-muted-foreground">{vehicle.seats} places</span>
        </div>
      </div>
    </Link>
  );
}
