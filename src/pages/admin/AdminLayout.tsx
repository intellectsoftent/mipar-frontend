import {
  Link,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Package,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrders } from "@/hooks/useOrders";
import { useIdols } from "@/hooks/useIdols";
import miparLogo from "@/assets/mipar-logo.png";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Guard: only allow access if admin_token exists
  const adminToken = localStorage.getItem("admin_token");
  if (!adminToken) return <Navigate to="/admin" replace />;

  // Live counts from API
  const { data: orders = [] } = useAdminOrders();
  const { data: idols = [] } = useIdols();
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    queryClient.removeQueries({ queryKey: ["admin-orders"] });
    queryClient.removeQueries({ queryKey: ["dashboard-stats"] });
    queryClient.removeQueries({ queryKey: ["idols"] });
    navigate("/admin");
  };

  const links = [
    {
      to: "/admin/idols",
      label: "Manage Idols",
      icon: Package,
      count: idols.length,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
      count: orders.length,
      badge: pendingCount,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary text-secondary-foreground flex flex-col sticky top-0 h-screen">
        {/* Brand */}
        <div className="p-6 border-b border-secondary-foreground/10">
          <Link to="/" className="flex flex-col gap-2 group">
            <img
              src={miparLogo}
              alt="Mipar"
              className="h-11 w-auto rounded-lg"
            />
            <span className="text-[11px] text-secondary-foreground/60 uppercase tracking-[0.2em]">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-secondary-foreground/40 font-medium px-4 mb-3">
            Management
          </p>
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary text-secondary shadow-lg shadow-primary/20"
                    : "text-secondary-foreground/70 hover:bg-secondary-foreground/5 hover:text-secondary-foreground"
                }`}
              >
                <l.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{l.label}</span>
                <div className="flex items-center gap-1.5">
                  {/* Pending badge (orange dot) for orders */}
                  {l.badge != null && l.badge > 0 && (
                    <span className="bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {l.badge}
                    </span>
                  )}
                  {/* Total count */}
                  {l.count > 0 && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        active
                          ? "bg-secondary/20 text-secondary"
                          : "bg-secondary-foreground/10 text-secondary-foreground/60"
                      }`}
                    >
                      {l.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-secondary-foreground/10">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-foreground/60 hover:text-secondary-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-muted/30 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
