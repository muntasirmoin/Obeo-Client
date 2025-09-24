// components/Footer.tsx
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className={cn("w-full bg-gray-100 border-t")}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-6 text-sm text-gray-600">
        {/* Left side - Logo or Name */}
        <div className="font-semibold text-gray-800">Obeo</div>

        {/* Middle - Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/privacy" className="hover:text-primary">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-primary">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-primary">
            Contact
          </a>
        </div>

        {/* Right side - Copyright */}
        <div className="mt-4 md:mt-0">
          © {new Date().getFullYear()} Obeo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
