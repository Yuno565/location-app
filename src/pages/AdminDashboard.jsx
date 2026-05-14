import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  Car, CalendarDays, CreditCard, TrendingUp,
  Users, CheckCircle, Clock, XCircle, BarChart2,
  LogOut, User, MapPin
} from "lucide-react";

const STATUS_STYLES = {
  "En attente":  { bg: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" },
  "Confirmée":   { bg: "bg-green-100 text-green-800",   dot: "bg-green-400" },
  "En cours":    { bg: "bg-blue-100 text-blue-800",     dot: "bg-blue-400" },
  "Terminée":    { bg: "bg-gray-100 text-gray-600",     dot: "bg-gray-400" },
  "Annulée":     { bg: "bg-red-100 text-red-700",       dot: "bg-red-400" },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ vehicles: [], reservations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getVehicles(), api.getReservations()]).then(([v, r]) => {
      setData({ vehicles: v, reservations: r });
      setLoading(false);
    });
  }, []);

  const reservations = data.reservations;
  const vehicles = data.vehicles;

  const totalRevenue = reservations.filter(r => r.status !== "Annulée").reduce((s, r) => s + r.total_price, 0);
  const availableVehiclesCount = vehicles.filter(v => v.available).length;

  const STATS = [
    { label: "Réservations",    value: reservations.length, icon: CalendarDays, color: "text-blue-400",   bg: "bg-blue-500/10" },
    { label: "Véhicules dispo", value: availableVehiclesCount,   icon: Car,          color: "text-green-400",  bg: "bg-green-500/10" },
    { label: "En attente",      value: reservations.filter(r => r.status === "En attente").length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Chiffre d'aff.",  value: `${totalRevenue.toLocaleString()} MAD`, icon: CreditCard, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  const TABS = [
    { id: "dashboard",    label: "Tableau de bord", icon: BarChart2 },
    { id: "reservations", label: "Réservations",     icon: CalendarDays },
    { id: "vehicles",     label: "Véhicules",        icon: Car },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-heading font-bold">MarocAuto</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-primary font-semibold">Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-primary/20 text-primary"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40">Administrateur</p>
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

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {tab === "dashboard" && "Tableau de bord"}
              {tab === "reservations" && "Toutes les réservations"}
              {tab === "vehicles" && "Catalogue des véhicules"}
            </h1>
            <p className="text-white/40 text-sm mt-1">Bienvenue, {user?.name}</p>
          </div>

          {/* DASHBOARD TAB */}
          {tab === "dashboard" && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {STATS.map((s, i) => (
                  <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent reservations */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Réservations récentes</h3>
                  <button onClick={() => setTab("reservations")} className="text-xs text-primary hover:underline">Voir tout</button>
                </div>
                <div className="divide-y divide-white/5">
                  {reservations.slice(0, 5).map(r => {
                    const s = STATUS_STYLES[r.status] || STATUS_STYLES["En attente"];
                    return (
                      <div key={r.id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{r.customer_name}</p>
                          <p className="text-xs text-white/40">{r.vehicle_name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-primary">{r.total_price.toLocaleString()} MAD</span>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.bg}`}>{r.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status breakdown */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-5">Répartition des statuts</h3>
                <div className="space-y-3">
                  {Object.keys(STATUS_STYLES).map(status => {
                    const count = reservations.filter(r => r.status === status).length;
                    const pct = reservations.length > 0 ? Math.round((count / reservations.length) * 100) : 0;
                    const s = STATUS_STYLES[status];
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                            <span className="text-white/70">{status}</span>
                          </span>
                          <span className="text-white/40">{count} · {pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.dot}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {tab === "reservations" && (
            <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5">
                  <tr>
                    {["Client", "Véhicule", "Ville", "Dates", "Total", "Paiement", "Statut"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map(r => {
                    const s = STATUS_STYLES[r.status] || STATUS_STYLES["En attente"];
                    return (
                      <tr key={r.id} className="hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">{r.customer_name}</p>
                          <p className="text-xs text-white/30">{r.customer_email}</p>
                        </td>
                        <td className="px-5 py-4 text-white/70">{r.vehicle_name}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-white/50 text-xs">
                            <MapPin className="w-3 h-3" />{r.pickup_city}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-white/40">
                          <p>{new Date(r.pickup_date).toLocaleDateString()}</p>
                          <p>{new Date(r.return_date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-5 py-4 font-bold text-primary">{r.total_price.toLocaleString()} MAD</td>
                        <td className="px-5 py-4 text-xs text-white/40">{r.payment_method}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VEHICLES TAB */}
          {tab === "vehicles" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {vehicles.map(v => (
                <div key={v.id} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={v.image_url} alt={v.brand} className="w-full h-full object-cover" />
                    <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${v.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {v.available ? "✓ Disponible" : "✗ Réservé"}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-white">{v.brand} <span className="font-normal text-white/50">{v.model}</span></p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-white/30">{v.city} · {v.category}</p>
                      <p className="font-bold text-primary text-sm">{v.price_per_day.toLocaleString()} MAD/j</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail modal for reservations */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-primary to-orange-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.vehicle_name}</h2>
                  <p className="text-white/60 text-sm">#{selected.id}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 text-white`}>{selected.status}</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-white">{selected.total_price.toLocaleString()} MAD</div>
              <div className="text-white/60 text-sm">{selected.total_days} jours · {selected.payment_method}</div>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ["Client", selected.customer_name],
                ["Email", selected.customer_email],
                ["Téléphone", selected.customer_phone || "—"],
                ["Ville", selected.pickup_city],
                ["Du", new Date(selected.pickup_date).toLocaleDateString()],
                ["Au", new Date(selected.return_date).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setSelected(null)} className="w-full bg-white/5 text-white/60 hover:text-white py-2.5 rounded-xl text-sm transition-colors">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
