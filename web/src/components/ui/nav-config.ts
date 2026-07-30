import {
  LayoutDashboard,
  Ruler,
  Phone,
  Users,
  BarChart3,
  Wallet,
  KeyRound,
  Code2,
  UserCircle,
  LogOut,
  Settings,
  Image as ImageIcon,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles: Role[];
  group?: string;
}

/** Full navigation tree. Roles filter which items appear per user. */
export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["manager", "agent", "client"] },

  // SMS Module
  { label: "SMS Ranges", to: "/ranges", icon: Ruler, roles: ["manager", "agent", "client"], group: "SMS Module" },
  { label: "My Numbers", to: "/my-numbers", icon: Phone, roles: ["manager", "agent", "client"], group: "SMS Module" },
  { label: "SMS Report", to: "/sms-report", icon: BarChart3, roles: ["manager", "agent", "client"], group: "SMS Module" },

  // Clients / Agents
  { label: "My Clients", to: "/clients", icon: Users, roles: ["manager", "agent"], group: "Management" },
  { label: "Agents", to: "/agents", icon: UserPlus, roles: ["manager"], group: "Management" },

  // Manager range/number admin
  { label: "Manage Ranges", to: "/manage-ranges", icon: Settings, roles: ["manager"], group: "Manager Admin" },
  { label: "Manage Numbers", to: "/manage-numbers", icon: Phone, roles: ["manager"], group: "Manager Admin" },

  // Payments
  { label: "Payment", to: "/payment", icon: Wallet, roles: ["manager", "agent", "client"], group: "Billing" },
  { label: "Payment Token", to: "/payment-token", icon: Wallet, roles: ["manager", "agent", "client"], group: "Billing" },
  { label: "Token Search", to: "/token-search", icon: KeyRound, roles: ["manager"], group: "Billing" },

  // API
  { label: "API", to: "/api", icon: Code2, roles: ["manager", "agent", "client"], group: "Developer" },
  { label: "Manage API", to: "/manage-api", icon: KeyRound, roles: ["manager"], group: "Developer" },

  // Branding
  { label: "Logo", to: "/logo", icon: ImageIcon, roles: ["manager"], group: "Branding" },

  // Profile
  { label: "My Profile", to: "/profile", icon: UserCircle, roles: ["manager", "agent", "client"], group: "Account" },
  { label: "Logout", to: "/logout", icon: LogOut, roles: ["manager", "agent", "client"], group: "Account" },
];

export function navItemsForRole(role: Role): NavItem[] {
  return navItems.filter((item) => item.roles.includes(role));
                                                                     }
  
