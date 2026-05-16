import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Car, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Accueil" },
    { to: "/catalogue", label: "Véhicules" },
    { to: "/reservations", label: "Réservations" },
  ];

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-xl border-b border-border shadow-sm";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`text-xl font-heading font-bold tracking-tight ${isHome && !scrolled ? "text-white" : "text-foreground"}`}>
                MarocAuto
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-semibold -mt-0.5">Premium</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : isHome && !scrolled ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${isHome && !scrolled ? "text-white/60" : "text-muted-foreground"}`}>
              <User className="w-4 h-4" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                isHome && !scrolled
                  ? "text-white/70 hover:bg-white/10"
                  : "text-muted-foreground hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <LogOut className="w-4 h-4" />
              Déconnecter
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg ${isHome && !scrolled ? "text-white" : "text-foreground"}`}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border px-4 py-4 space-y-2">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === link.to ? "text-primary bg-primary/10" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
