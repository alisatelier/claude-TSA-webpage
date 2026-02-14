"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {links.map(({ href, label }) => {
        const isActive =
          href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-slate-700 text-white font-medium"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
