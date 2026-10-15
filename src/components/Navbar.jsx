import React from "react";
import { useState } from "react";
import { Menu, X, Eye } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17324D] text-white">
            <Eye size={25} strokeWidth={2} />
          </span>

          <span>
            <span className="block text-xl font-extrabold tracking-tight text-[#17324D]">
              ViewForMe
            </span>
            <span className="block text-[10px] font-medium tracking-wider text-slate-500">
              YOUR EYES ON THE PROPERTY
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#2A9D8F]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="/book"
          className="hidden rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579] lg:inline-flex"
        >
          Book a Viewing
        </a>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#17324D] lg:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#2A9D8F]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/book"
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-xl bg-[#2A9D8F] px-5 py-3.5 text-center text-sm font-semibold text-white"
            >
              Book a Viewing
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
