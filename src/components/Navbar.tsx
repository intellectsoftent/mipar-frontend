import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import miparLogo from "@/assets/mipar-logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/idols", label: "Idols" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { user: currentCustomer, logout: logoutCustomer } = useAuth();

  const cartCount = cartItems?.reduce((sum, c) => sum + c.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <img src={miparLogo} alt="Mipar" className="h-11 w-auto rounded-lg" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+918309326395"
            className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 8309 326 395
          </a>

          {currentCustomer ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/my-orders"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/my-orders"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Package className="w-4 h-4" /> My Orders
              </Link>
              <span className="text-border">|</span>
              <span className="text-sm text-muted-foreground">
                {currentCustomer.name.split(" ")[0]}
              </span>
              <button
                onClick={logoutCustomer}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}

          <Link
            to="/cart"
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 space-y-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {currentCustomer ? (
            <>
              <Link
                to="/my-orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                <Package className="w-4 h-4" /> My Orders
              </Link>
              <button
                onClick={() => {
                  logoutCustomer();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground"
              >
                <LogOut className="w-4 h-4" /> Logout (
                {currentCustomer.name.split(" ")[0]})
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 py-2 text-sm font-medium text-primary"
            >
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}
          <a
            href="tel:+918309326395"
            className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground"
          >
            <Phone className="w-4 h-4" /> +91 8309 326 395
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
