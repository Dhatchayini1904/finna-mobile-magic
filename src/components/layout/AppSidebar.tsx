import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  Target, 
  Receipt, 
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Wallet,
  PieChart,
  BookOpen
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Budget", url: "/budget", icon: PieChart },
  { title: "Investments", url: "/investments", icon: TrendingUp },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Bills", url: "/bills", icon: Receipt },
];

const secondaryNavItems = [
  { title: "AI Chat", url: "/ai-chat", icon: MessageSquare },
  { title: "Learn", url: "/learn", icon: BookOpen },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
];

interface NavItemProps {
  item: { title: string; url: string; icon: React.ElementType };
  collapsed: boolean;
}

function NavItem({ item, collapsed }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.url;
  const Icon = item.icon;

  return (
    <NavLink
      to={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 shrink-0 transition-colors",
        isActive ? "text-primary" : "group-hover:text-foreground"
      )} />
      {!collapsed && (
        <span className={cn(
          "font-medium text-sm transition-opacity",
          isActive && "text-primary"
        )}>
          {item.title}
        </span>
      )}
      {isActive && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
      )}
    </NavLink>
  );
}

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              FINNAVA
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </span>
          )}
          <div className="space-y-0.5 mt-2">
            {mainNavItems.map((item) => (
              <NavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>

        <div className="pt-6 space-y-1">
          {!collapsed && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </span>
          )}
          <div className="space-y-0.5 mt-2">
            {secondaryNavItems.map((item) => (
              <NavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
