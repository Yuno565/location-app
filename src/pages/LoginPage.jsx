import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, User, Shield, Eye, EyeOff, ChevronRight, CheckCircle, Building2 } from "lucide-react";

// Comptes de démonstration (pour information)
const ACCOUNTS = {
  admin: [
    { email: "admin@marocauto.ma", password: "pass123", name: "Mohammed El Idrissi" },
  ],
  client: [
    { email: "client@email.ma", password: "pass123", name: "Youssef El Amrani" },
  ],
  agency: [
    { email: "agence@autolux.ma", password: "pass123", name: "Responsable AutoLux" },
  ],
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // "client" | "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r) => {
    setRole(r);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 800)); // simulate network

    const res = await login(email, password);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message || "Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-950 overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=900&fit=crop&q=80"
            alt="Maroc"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/80 to-orange-950/40" />
        </div>

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <span className="text-3xl font-heading font-bold text-white block">MarocAuto</span>
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Premium</span>
            </div>
          </div>

          <h2 className="text-4xl font-heading font-bold text-white mb-4 leading-tight">
            Bienvenue sur<br />
            <span className="text-primary">votre espace</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            La plateforme de location de véhicules premium au Maroc. Réservez votre voiture en quelques clics.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[["500+", "Véhicules"], ["10", "Villes"], ["4.8★", "Note"]].map(([v, l]) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold text-primary">{v}</p>
                <p className="text-xs text-white/50 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-white">MarocAuto <span className="text-primary text-sm">Premium</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-white/50">Choisissez votre profil et connectez-vous</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <RoleCard
              id="role-client"
              icon={User}
              title="Client"
              desc="Réservez vos voitures"
              active={role === "client"}
              onClick={() => handleRoleSelect("client")}
            />
            <RoleCard
              id="role-agency"
              icon={Building2}
              title="Entreprise"
              desc="Gérez vos locations"
              active={role === "agency"}
              onClick={() => handleRoleSelect("agency")}
            />
            <RoleCard
              id="role-admin"
              icon={Shield}
              title="Admin"
              desc="Vue globale"
              active={role === "admin"}
              onClick={() => handleRoleSelect("admin")}
            />
          </div>

          {/* Login Form */}
          {role && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-2 text-center">
                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Compte de test</p>
                <p className="text-xs text-primary font-mono">
                  {role === "admin" && "admin@marocauto.ma"}
                  {role === "agency" && "agence@autolux.ma"}
                  {role === "client" && "client@email.ma"}
                  <span className="text-white/40 ml-2">/ pass123</span>
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={role === "admin" ? "admin@marocauto.ma" : "client@email.ma"}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Mot de passe</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-base hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  <>
                    Se connecter
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {!role && (
            <div className="text-center text-white/30 text-sm mt-4">
              ↑ Sélectionnez votre profil pour continuer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ id, icon: Icon, title, desc, active, onClick }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
        active
          ? "border-primary bg-primary/10 shadow-lg shadow-orange-500/20"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      {active && (
        <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-primary" />
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
        active ? "bg-primary/20" : "bg-white/5 group-hover:bg-white/10"
      }`}>
        <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-white/50"}`} />
      </div>
      <p className={`font-semibold text-sm mb-1 ${active ? "text-white" : "text-white/60"}`}>{title}</p>
      <p className={`text-xs leading-snug ${active ? "text-white/60" : "text-white/30"}`}>{desc}</p>
    </button>
  );
}
