import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { 
  Car, CalendarDays, Clock, CheckCircle, XCircle, 
  LogOut, User, MapPin, Building2, TrendingUp 
} from "lucide-react";

const STATUS_STYLES = {
  "En attente":  { bg: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" },
  "Confirmée":   { bg: "bg-green-100 text-green-800",   dot: "bg-green-400" },
  "En cours":    { bg: "bg-blue-100 text-blue-800",     dot: "bg-blue-400" },
  "Terminée":    { bg: "bg-gray-100 text-gray-600",     dot: "bg-gray-400" },
  "Annulée":     { bg: "bg-red-100 text-red-700",       dot: "bg-red-400" },
};

export default function AgencyDashboard() {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const data = await api.getReservations(user.agency_name);
      setReservations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user.agency_name]);

  const handleUpdateStatus = async (id, newStatus) => {
    const res = await api.updateReservationStatus(id, newStatus);
    if (res.success) {
      fetchReservations(); // Refresh list
    }
  };

  const pendingCount = reservations.filter(r => r.status === "En attente").length;
  const confirmedCount = reservations.filter(r => r.status === "Confirmée").length;
  const totalRevenue = reservations
    .filter(r => r.status === "Confirmée" || r.status === "Terminée" || r.status === "En cours")
    .reduce((sum, r) => sum + r.total_price, 0);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-heading font-bold">MarocAuto</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-orange-500 font-semibold">Entreprise</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="bg-primary/10 text-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3">
            <CalendarDays className="w-4 h-4" />
            Mes Réservations
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40">{user?.agency_name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-white">Gestion des locations</h1>
          <p className="text-white/40 text-sm mt-1">Espace réservé à {user?.agency_name}</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "En attente", value: pendingCount, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Confirmées", value: confirmedCount, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Chiffre d'affaires", value: `${totalRevenue.toLocaleString()} MAD`, icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reservations List */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Demandes de réservation</h3>
          </div>
          
          <div className="divide-y divide-white/5">
            {reservations.length === 0 ? (
              <div className="p-10 text-center text-white/20">
                Aucune réservation pour le moment.
              </div>
            ) : (
              reservations.map(r => (
                <div key={r.id} className="p-6 hover:bg-white/5 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Car className="w-6 h-6 text-white/40" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{r.vehicle_name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-white/60 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> {r.customer_name}
                          </p>
                          <p className="text-sm text-white/40 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {r.pickup_city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Période</p>
                        <p className="text-sm text-white/70">
                          {new Date(r.pickup_date).toLocaleDateString()} → {new Date(r.return_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Prix Total</p>
                        <p className="text-lg font-bold text-primary">{r.total_price.toLocaleString()} MAD</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[r.status].bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[r.status].dot}`} />
                          {r.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {r.status === "En attente" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(r.id, "Confirmée")}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Accepter
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r.id, "Annulée")}
                            className="bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" /> Refuser
                          </button>
                        </>
                      )}
                      {r.status !== "En attente" && (
                        <button className="text-white/20 text-xs cursor-default">
                          Demande traitée
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
