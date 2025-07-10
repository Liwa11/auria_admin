"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gebruikersbeheer", label: "Gebruikersbeheer" },
  { href: "/regios", label: "Regio's" },
  { href: "/campagnes", label: "Campagnes" },
  { href: "/klanten", label: "Klanten" },
  { href: "/verkopers", label: "Verkopers" },
  { href: "/gesprekken", label: "Gesprekken" },
  { href: "/belschema", label: "Belschema" },
  { href: "/call-scripts", label: "Call Scripts" },
  { href: "/instellingen", label: "Instellingen" },
  { href: "/logs", label: "Logs" },
  { href: "/rapporten", label: "Rapporten" },
  { href: "/debug", label: "🔧 Debug" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
      <div className="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Auria Admin</div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-4 py-2 rounded transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
              pathname.startsWith(item.href) && "bg-gray-100 dark:bg-gray-800 font-semibold"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 