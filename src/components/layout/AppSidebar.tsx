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
  PieChart,
  BookOpen,
  Newspaper
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { t } = useLanguage();
  const { signOut } = useAuth();

  const mainNavItems = [
    { title: t('dashboard'), url: "/dashboard", icon: LayoutDashboard },
    { title: t('transactions'), url: "/transactions", icon: ArrowLeftRight },
    { title: t('budget'), url: "/budget", icon: PieChart },
    { title: t('investments'), url: "/investments", icon: TrendingUp },
    { title: t('goals'), url: "/goals", icon: Target },
  ];

  const secondaryNavItems = [
    { title: t('news'), url: "/news", icon: Newspaper },
    { title: t('aiChat'), url: "/ai-chat", icon: MessageSquare },
    { title: t('learn'), url: "/learn", icon: BookOpen },
    { title: t('settings'), url: "/settings", icon: Settings },
    { title: t('help'), url: "/help", icon: HelpCircle },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border transition-all duration-300 flex flex-col shadow-xl",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border bg-background/20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow shrink-0 bg-primary/20 border border-primary/20">
            <img src="/icon.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <span className="font-display font-black text-xl text-primary tracking-tighter animate-fade-in">
              FINNAVA
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-4 text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">
              {t('main')}
            </span>
          )}
          <div className="space-y-1 mt-3">
            {mainNavItems.map((item) => (
              <NavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>

        <div className="pt-8 space-y-1">
          {!collapsed && (
            <span className="px-4 text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">
              {t('tools')}
            </span>
          )}
          <div className="space-y-1 mt-3">
            {secondaryNavItems.map((item) => (
              <NavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border bg-background/10">
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl w-full transition-all duration-300 font-bold text-sm",
            "text-muted-foreground hover:text-white hover:bg-destructive shadow-sm hover:shadow-destructive/40"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="animate-fade-in">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ item, collapsed }: { item: any; collapsed: boolean }) {
  const location = useLocation();
  const isActive = location.pathname === item.url;
  const Icon = item.icon;

  return (
    <NavLink
      to={item.url}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative",
        isActive
          ? "bg-primary text-white shadow-lg shadow-primary/30"
          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 shrink-0 transition-transform duration-300",
        isActive ? "scale-110" : "group-hover:scale-110"
      )} />
      {!collapsed && (
        <span className="font-bold text-sm transition-opacity truncate animate-fade-in">
          {item.title}
        </span>
      )}
      {isActive && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
      )}
    </NavLink>
  );
}
