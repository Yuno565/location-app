import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, CalendarDays, CreditCard, MapPin, Car, CheckCircle, Users, Settings2, Fuel } from "lucide-react";

// Calcule le nombre de jours entre deux dates
function calcDays(from, to) {
  if (!from || !to) return 0;
  const d1 = new Date(from);
  const d2 = new Date(to);
  const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// Date min = aujourd'hui
const today = new Date().toISOString().split("T")[0];

export default function ReservationModal({ vehicle, onClose, onConfirm }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    customer_phone: "",
    pickup_city: vehicle.city,
    pickup_date: "",
    return_date: "",
    payment_method: "Carte bancaire",
  });
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [errors, setErrors] = useState({});

  const totalDays = calcDays(form.pickup_date, form.return_date);
  const totalPrice = totalDays * vehicle.price_per_day;

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim())  e.customer_name  = "Nom requis";
    if (!form.customer_email.trim()) e.customer_email = "Email requis";
    if (!form.pickup_date)           e.pickup_date    = "Date de retrait requise";
    if (!form.return_date)           e.return_date    = "Date de retour requise";
    if (totalDays <= 0)              e.return_date    = "La date de retour doit être après la date de retrait";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const reservation = {
      id: `r${Date.now()}`,
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.brand} ${vehicle.model}`,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      pickup_city: form.pickup_city,
      pickup_date: form.pickup_date,
      return_date: form.return_date,
      total_days: totalDays,
      total_price: totalPrice,
      payment_method: form.payment_method,
      status: "En attente",
    };

    onConfirm(reservation);
    setStep(2);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {step === 2 ? (
          // ─── SUCCESS ───
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
            <p className="text-gray-500 mb-6">
              Votre réservation pour le <strong>{vehicle.brand} {vehicle.model}</strong> a été enregistrée avec succès.
            </p>
            <div className="bg-gray-50 rounded-xl p-5 text-left mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Durée</span>
                <span className="font-semibold">{totalDays} jour{totalDays > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Du</span>
                <span className="font-semibold">{form.pickup_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Au</span>
                <span className="font-semibold">{form.return_date}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} MAD</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          // ─── FORM ───
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{vehicle.brand} {vehicle.model}</h2>
                    <p className="text-white/50 text-xs">{vehicle.year} · {vehicle.city} · {vehicle.category}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Vehicle quick info */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { icon: Users, val: `${vehicle.seats} places` },
                  { icon: Settings2, val: vehicle.transmission },
                  { icon: Fuel, val: vehicle.fuel_type },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-white/70">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* ── Client info ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
                  Informations client
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Nom complet *" error={errors.customer_name}>
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={e => update("customer_name", e.target.value)}
                      placeholder="Votre nom"
                      className={inputCls(errors.customer_name)}
                    />
                  </Field>
                  <Field label="Email *" error={errors.customer_email}>
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={e => update("customer_email", e.target.value)}
                      placeholder="email@exemple.com"
                      className={inputCls(errors.customer_email)}
                    />
                  </Field>
                  <Field label="Téléphone">
                    <input
                      type="tel"
                      value={form.customer_phone}
                      onChange={e => update("customer_phone", e.target.value)}
                      placeholder="+212 6 XX XX XX XX"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Ville de retrait">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={form.pickup_city}
                        readOnly
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm bg-gray-50 text-gray-500"
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── Dates ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">2</span>
                  Période de location
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date de retrait *" error={errors.pickup_date}>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        min={today}
                        value={form.pickup_date}
                        onChange={e => update("pickup_date", e.target.value)}
                        className={`${inputCls(errors.pickup_date)} pl-9`}
                      />
                    </div>
                  </Field>
                  <Field label="Date de retour *" error={errors.return_date}>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        min={form.pickup_date || today}
                        value={form.return_date}
                        onChange={e => update("return_date", e.target.value)}
                        className={`${inputCls(errors.return_date)} pl-9`}
                      />
                    </div>
                  </Field>
                </div>

                {/* Price preview */}
                {totalDays > 0 && (
                  <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">{totalDays} jour{totalDays > 1 ? "s" : ""}</span>
                      {" "}× {vehicle.price_per_day.toLocaleString()} MAD/jour
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">{totalPrice.toLocaleString()} MAD</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Payment ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">3</span>
                  Mode de paiement
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["Carte bancaire", "PayPal", "Paiement sur place"].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => update("payment_method", method)}
                      className={`p-3 rounded-xl border-2 text-xs font-medium text-center transition-all ${
                        form.payment_method === method
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className={`w-5 h-5 mx-auto mb-1 ${form.payment_method === method ? "text-primary" : "text-gray-400"}`} />
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                Confirmer la réservation
                {totalDays > 0 && <span className="ml-1 opacity-80">· {totalPrice.toLocaleString()} MAD</span>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// helpers
const inputCls = (err) =>
  `w-full border ${err ? "border-red-300 bg-red-50" : "border-gray-200"} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all`;

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
