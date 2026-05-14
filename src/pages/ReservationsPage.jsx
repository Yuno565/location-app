import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { CalendarDays, Car, MapPin, CreditCard, User, Mail, Phone, Search } from "lucide-react";

const STATUS_STYLES = {
  "En attente":  { bg: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" },
  "Confirmée":   { bg: "bg-green-100 text-green-800",  dot: "bg-green-400" },
  "En cours":    { bg: "bg-blue-100 text-blue-800",    dot: "bg-blue-400" },
  "Terminée":    { bg: "bg-gray-100 text-gray-700",    dot: "bg-gray-400" },
  "Annulée":     { bg: "bg-red-100 text-red-700",      dot: "bg-red-400" },
};

const STATS_FILTERS = [
  { label: "Total", filter: null },
  { label: "En attente", filter: "En attente" },
  { label: "En cours", filter: "En cours" },
  { label: "Confirmées", filter: "Confirmée" },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getReservations().then(data => {
      setReservations(data);
      setLoading(false);
    });
  }, []);

  const filtered = reservations.filter(r => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (search && ![r.customer_name, r.vehicle_name, r.pickup_city].some(v => v?.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const totalRevenue = reservations.filter(r => r.status !== "Annulée").reduce((s, r) => s + r.total_price, 0);

  if (loading) return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Réservations</h1>
          <p className="text-white/60">{reservations.length} réservation{reservations.length > 1 ? "s" : ""} au total</p>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total réservations", value: reservations.length, icon: CalendarDays, color: "text-blue-400" },
              { label: "En cours", value: reservations.filter(r => r.status === "En cours").length, icon: Car, color: "text-green-400" },
              { label: "En attente", value: reservations.filter(r => r.status === "En attente").length, icon: CalendarDays, color: "text-yellow-400" },
              { label: "Chiffre d'affaires", value: `${totalRevenue.toLocaleString()} MAD`, icon: CreditCard, color: "text-orange-400" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-white/60">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par client, véhicule, ville..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATS_FILTERS.map(s => (
              <button
                key={s.label}
                onClick={() => setStatusFilter(s.filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  statusFilter === s.filter
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reservations Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Aucune réservation trouvée</h3>
            <p className="text-muted-foreground text-sm">Essayez de modifier vos critères de filtrage.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {["Véhicule", "Client", "Trajet", "Dates", "Total", "Paiement", "Statut", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(r => {
                    const s = STATUS_STYLES[r.status] || STATUS_STYLES["En attente"];
                    return (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Car className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{r.vehicle_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{r.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{r.customer_email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {r.pickup_city}
                          </div>
                          <p className="text-xs text-muted-foreground">{r.total_days} jours</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <p>{new Date(r.pickup_date).toLocaleDateString()}</p>
                          <p>{new Date(r.return_date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-primary">{r.total_price.toLocaleString()} MAD</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.payment_method}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelected(r)}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {filtered.map(r => {
                const s = STATUS_STYLES[r.status] || STATUS_STYLES["En attente"];
                return (
                  <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-foreground">{r.vehicle_name}</p>
                        <p className="text-sm text-muted-foreground">{r.customer_name}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {r.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                      <span>📅 {new Date(r.pickup_date).toLocaleDateString()} → {new Date(r.return_date).toLocaleDateString()}</span>
                      <span>📍 {r.pickup_city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-lg">{r.total_price.toLocaleString()} MAD</span>
                      <button onClick={() => setSelected(r)} className="text-xs text-primary font-medium hover:underline">Voir détails</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-primary to-orange-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selected.vehicle_name}</h2>
                  <p className="text-white/70 text-sm mt-1">Réservation #{selected.id}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 text-white`}>{selected.status}</span>
              </div>
              <div className="mt-4 text-3xl font-bold">{selected.total_price.toLocaleString()} MAD</div>
              <div className="text-white/70 text-sm">{selected.total_days} jours · {selected.payment_method}</div>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow icon={User} label="Client" value={selected.customer_name} />
              <DetailRow icon={Mail} label="Email" value={selected.customer_email} />
              <DetailRow icon={Phone} label="Téléphone" value={selected.customer_phone || "—"} />
              <DetailRow icon={MapPin} label="Ville de retrait" value={selected.pickup_city || "—"} />
              <DetailRow icon={CalendarDays} label="Période" value={`${new Date(selected.pickup_date).toLocaleDateString()} → ${new Date(selected.return_date).toLocaleDateString()}`} />
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setSelected(null)} className="w-full bg-muted text-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-muted/70 transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
