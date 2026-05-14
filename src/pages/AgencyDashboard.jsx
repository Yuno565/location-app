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
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reservations");
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchReservations = async () => {
    try {
      const data = await api.getReservations(user.agency_name);
      setReservations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyVehicles = async () => {
    try {
      const allVehicles = await api.getVehicles();
      const mine = allVehicles.filter(v => v.agency_name === user.agency_name);
      setMyVehicles(mine);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReservations(), fetchMyVehicles()]);
      setLoading(false);
    };
    loadData();
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

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("reservations")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "reservations" 
                ? "bg-primary/10 text-primary" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Mes Réservations
          </button>
          <button 
            onClick={() => setActiveTab("my_vehicles")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "my_vehicles" 
                ? "bg-primary/10 text-primary" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Car className="w-4 h-4" />
            Mes Véhicules
          </button>
          <button 
            onClick={() => {
              setEditingVehicle(null);
              setActiveTab("add_vehicle");
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "add_vehicle" 
                ? "bg-primary/10 text-primary" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Car className="w-4 h-4" />
            Ajouter un véhicule
          </button>
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
        {activeTab === "reservations" ? (
          <>
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
          </>
        ) : activeTab === "my_vehicles" ? (
          <>
            <header className="mb-10">
              <h1 className="text-2xl font-bold text-white">Mes Véhicules</h1>
              <p className="text-white/40 text-sm mt-1">Gérez votre flotte</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVehicles.length === 0 ? (
                <p className="text-white/40">Vous n'avez pas encore ajouté de véhicules.</p>
              ) : (
                myVehicles.map(v => (
                  <div key={v.id} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <img src={v.image_url} alt={v.model} className="w-full h-48 object-cover" />
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white">{v.brand} {v.model}</h3>
                      <p className="text-primary font-bold">{v.price_per_day} MAD / jour</p>
                      <button 
                        onClick={() => {
                          setEditingVehicle(v);
                          setActiveTab("add_vehicle");
                        }}
                        className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-sm transition-all border border-white/10"
                      >
                        Modifier les infos ou photos
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <AddVehicleForm 
            agencyName={user?.agency_name} 
            initialData={editingVehicle}
            onAdded={() => {
              fetchMyVehicles();
              setActiveTab("my_vehicles");
            }} 
          />
        )}
      </main>
    </div>
  );
}

function AddVehicleForm({ agencyName, initialData, onAdded }) {
  const [formData, setFormData] = useState({
    brand: "", model: "", year: new Date().getFullYear(), price_per_day: "",
    city: "Casablanca", category: "Économique", transmission: "Automatique",
    fuel_type: "Essence", seats: 5, description: ""
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || "",
        model: initialData.model || "",
        year: initialData.year || new Date().getFullYear(),
        price_per_day: initialData.price_per_day || "",
        city: initialData.city || "Casablanca",
        category: initialData.category || "Économique",
        transmission: initialData.transmission || "Automatique",
        fuel_type: initialData.fuel_type || "Essence",
        seats: initialData.seats || 5,
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Max 5 photos
    setPhotos(files);
    
    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append("agency_name", agencyName);
    photos.forEach(photo => data.append("photos", photo));

    try {
      if (initialData && initialData.id) {
        await api.updateVehicle(initialData.id, data);
        alert("Véhicule modifié avec succès !");
      } else {
        await api.createVehicle(data);
        alert("Véhicule ajouté avec succès !");
      }
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-white">{initialData ? "Modifier le véhicule" : "Ajouter un véhicule"}</h1>
        <p className="text-white/40 text-sm mt-1">{initialData ? "Mettez à jour les infos ou les photos de ce véhicule." : `Publiez une nouvelle annonce pour ${agencyName}`}</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/5 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Marque</label>
            <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="ex: Mercedes-Benz" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Modèle</label>
            <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="ex: Classe C 220d" />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Année</label>
            <input required type="number" min="2000" max="2025" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Prix par jour (MAD)</label>
            <input required type="number" min="100" value={formData.price_per_day} onChange={e => setFormData({...formData, price_per_day: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="ex: 850" />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Ville</label>
            <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
              <option>Casablanca</option><option>Marrakech</option><option>Rabat</option><option>Tanger</option><option>Agadir</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Catégorie</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
              <option>Économique</option><option>Compacte</option><option>Berline</option><option>SUV</option><option>Luxe</option><option>4x4</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Transmission</label>
            <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
              <option>Manuelle</option><option>Automatique</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase mb-2">Carburant</label>
            <select value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
              <option>Essence</option><option>Diesel</option><option>Hybride</option><option>Electrique</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 uppercase mb-2">Description</label>
          <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Décrivez les atouts du véhicule..."></textarea>
        </div>

        {/* Upload de photos */}
        <div className="border border-white/10 bg-black/20 rounded-2xl p-6">
          <label className="block text-sm font-medium text-white mb-2">Photos du véhicule (Max 5)</label>
          {initialData && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-400">
              Note : Si vous uploadez de nouvelles photos, elles remplaceront les anciennes. Si vous ne sélectionnez rien, les anciennes photos seront conservées.
            </div>
          )}
          <p className="text-xs text-white/40 mb-4">La première photo sera utilisée comme couverture. Formats: JPG, PNG.</p>
          
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
          />

          {photoPreviews.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {photoPreviews.map((src, i) => (
                <div key={i} className={`relative shrink-0 rounded-xl overflow-hidden border-2 ${i === 0 ? "border-primary" : "border-white/10"} w-24 h-24`}>
                  <img src={src} className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute bottom-0 inset-x-0 bg-primary text-white text-[9px] text-center font-bold py-0.5">COVER</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            {loading ? "Enregistrement..." : (initialData ? "Sauvegarder les modifications" : "Publier le véhicule")}
          </button>
        </div>
      </form>
    </div>
  );
}
