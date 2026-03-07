"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };
type NavGroup = { heading?: string; links: NavLink[] };

const navGroups: NavGroup[] = [
  {
    links: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    heading: "Products",
    links: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/inventory", label: "Inventory" },
    ],
  },
  {
    heading: "Services",
    links: [
      { href: "/admin/bookings", label: "Bookings" },
      { href: "/admin/schedule", label: "Schedule" },
    ],
  },
  {
    heading: "Customers",
    links: [
      { href: "/admin/users", label: "Users" },
      { href: "/admin/reviews", label: "Reviews" },
      { href: "/admin/discounts", label: "Discounts" },
    ],
  },
  {
    heading: "Content",
    links: [
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/emails", label: "Emails" },
    ],
  },
  {
    links: [{ href: "/admin/settings", label: "Settings" }],
  },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      {navGroups.map((group, groupIndex) => (
        <div key={group.heading ?? groupIndex}>
          {group.heading && (
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold px-3 pt-4 pb-1">
              {group.heading}
            </h3>
          )}
          <ul className="space-y-1">
            {group.links.map(({ href, label }) => {
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
        </div>
      ))}
    </nav>
  );
}
