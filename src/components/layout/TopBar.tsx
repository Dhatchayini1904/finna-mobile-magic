import { Bell, Menu, Search, User, LogOut, Sun, Moon, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarCollapsed, onToggleSidebar }: TopBarProps) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-30 transition-all duration-300">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left section: Sidebar Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="shrink-0 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar - Modernized */}
          <div className="relative hidden md:block group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t('searchPlaceholder') || 'Search everything...'}
              className="w-full pl-11 bg-secondary/40 border-transparent focus:border-primary/30 focus:bg-background/50 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all h-10"
            />
          </div>
        </div>

        {/* Right section: Toggles & User Profile */}
        <div className="flex items-center gap-2 md:gap-6">

          {/* Modern Segmented Language Toggle */}
          <div className="hidden sm:flex items-center bg-secondary/50 p-1 rounded-xl border border-border/50">
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                language === 'en'
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                language === 'ta'
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              தமிழ்
            </button>
          </div>

          {/* Theme Toggle Button - Modern Circular */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl border-border/50 bg-secondary/30 hover:bg-primary/10 transition-all hover:scale-110 active:scale-95 shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] text-amber-400 animate-in spin-in-90 duration-500" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-blue-600 animate-in spin-in-90 duration-500" />
            )}
          </Button>

          {/* Notifications - Refined */}
          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 rounded-xl group overflow-hidden">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background shadow-glow" />
          </Button>

          {/* User Profile - Compact & Professional */}
          <div className="flex items-center gap-3 pl-3 border-l border-border/60 h-8">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold tracking-tight leading-tight">{displayName}</p>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase font-black text-primary opacity-80 tracking-widest">
                  {user ? 'Premium' : 'Guest'}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 group overflow-hidden">
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-3 rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl bg-card/95">
                {user ? (
                  <>
                    <div className="flex flex-col p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {displayName[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold truncate">{displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="bg-primary/5 rounded-xl p-2 px-3 border border-primary/10">
                        <p className="text-[10px] font-bold text-primary uppercase">{t('account') || 'Subscription'}</p>
                        <p className="text-xs font-medium">FINNAVA PRO</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="opacity-50" />
                    <div className="p-2">
                      <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl py-2.5 gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Settings className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">{t('settings')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="rounded-xl py-2.5 gap-3 text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-sm">{t('logout') || 'Sign Out'}</span>
                      </DropdownMenuItem>
                    </div>
                  </>
                ) : (
                  <div className="p-2">
                    <DropdownMenuItem onClick={() => navigate('/auth')} className="rounded-xl py-3 justify-center bg-primary text-white hover:bg-primary/90 focus:bg-primary/90">
                      Sign In to FinNava
                    </DropdownMenuItem>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
