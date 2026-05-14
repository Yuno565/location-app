import { Link } from "react-router-dom";
import { Car, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-heading font-bold">MarocAuto</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-semibold -mt-0.5">Premium</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              La plateforme de location de voitures au Maroc. Service premium, qualité certifiée.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-primary">Navigation</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-white/60 hover:text-primary transition-colors">Accueil</Link>
              <Link to="/catalogue" className="block text-sm text-white/60 hover:text-primary transition-colors">Catalogue</Link>
              <Link to="/reservations" className="block text-sm text-white/60 hover:text-primary transition-colors">Réservations</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-primary">Villes</h4>
            <div className="space-y-3">
              {["Casablanca", "Marrakech", "Rabat", "Tanger", "Agadir"].map(city => (
                <Link key={city} to={`/catalogue?city=${city}`} className="block text-sm text-white/60 hover:text-primary transition-colors">{city}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-primary">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-primary" />
                +212 5XX-XXXXXX
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-primary" />
                contact@marocauto.ma
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-primary" />
                Casablanca, Maroc
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">© 2026 MarocAuto Premium. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
