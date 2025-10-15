// components/Navbar.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { href: "/", label: "Service Bill" },
    // { href: "/night-audit", label: "Night-Audit" },
    { href: "/night-audit-page", label: "Night-Audit-page" },
    { href: "/guest-bill-payment", label: "Guest-Bill-Payment" },
    // Add more links here
    // { href: "/about", label: "About" },
    // { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className={cn("w-full bg-white shadow-sm")}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="text-xl font-bold">Obeo</div>

        {/* Links */}
        <div className=" hidden md:flex space-x-6">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium hover:text-primary transition-colors",
                  isActive ? "text-primary border-b-2 border-primary" : ""
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Action Button */}
        <Button>Login</Button>
      </div>
    </nav>
  );
}
