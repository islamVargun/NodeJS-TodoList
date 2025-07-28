"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Tüm Görevler", icon: Home },
  { href: "/dashboard/weekly", label: "Haftalık", icon: Calendar },
  { href: "/dashboard/completed", label: "Yapılanlar", icon: CheckSquare },
];

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const getAvatarFallback = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-shrink-0 border-r bg-card flex-col justify-between transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        <div
          className={cn(
            "flex items-center h-16 p-4",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <h2
            className={cn(
              "text-2xl font-bold whitespace-nowrap",
              isCollapsed
                ? "opacity-0 scale-0"
                : "opacity-100 scale-100 transition-transform duration-300"
            )}
          >
            TodoApp
          </h2>
          <h2
            className={cn(
              "text-2xl font-bold absolute transition-transform duration-300",
              !isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
            )}
          >
            TA
          </h2>
        </div>
        <nav className="flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className="h-4 w-4" />
                <span className={cn("ml-2", isCollapsed && "hidden")}>
                  {item.label}
                </span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t">
        {user && !isCollapsed && (
          <div className="flex items-center p-2 mb-2">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
                alt={user.name}
              />
              <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Çıkış Yap" : ""}
        >
          <LogOut className="h-4 w-4" />
          <span className={cn("ml-2", isCollapsed && "hidden")}>Çıkış Yap</span>
        </Button>
        <Button
          onClick={toggleSidebar}
          variant="outline"
          className="w-full mt-2"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
