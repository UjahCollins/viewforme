
import {
  Eye,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  {
    label: "Residential Viewing",
    href: "/book?service=residential",
  },
  {
    label: "Commercial Viewing",
    href: "/book?service=commercial",
  },
  {
    label: "Storage Inspection",
    href: "/book?service=storage",
  },
  {
    label: "Construction Progress",
    href: "/book?service=construction",
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cancellation & Refunds", href: "/refund-policy" },
  { label: "Cookies", href: "/cookies" },
];

const phone = "+447760981224";

function Footer() {
  return (
    <footer className="bg-[#10283F] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2A9D8F]">
                <Eye size={25} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                ViewForMe
              </span>
            </a>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
              Your Eyes on the Property. We help you see
              properties remotely through local viewing
              visits, photos, videos, and visual updates.
            </p>

            <a
              href="/become-a-viewer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:border-[#2A9D8F] hover:bg-white/5"
            >
              Become a Viewer
              <ArrowUpRight size={17} />
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-base font-bold">Quick Links</h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 transition hover:text-[#78D6C9]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold">Our Services</h3>

            <ul className="mt-6 space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 transition hover:text-[#78D6C9]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold">Get in Touch</h3>

            <div className="mt-6 space-y-5">
              <a
                href="mailto:viewforme@property.co.uk"
                className="flex items-start gap-3 text-sm text-slate-300 transition hover:text-[#78D6C9]"
              >
                <Mail size={19} className="shrink-0 text-[#78D6C9]" />
                <span className="break-all">
                  viewforme@property.co.uk
                </span>
              </a>

              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-[#78D6C9]"
              >
                <Phone size={19} className="shrink-0 text-[#78D6C9]" />
                +44 7760 981224
              </a>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin size={19} className="shrink-0 text-[#78D6C9]" />
                Northern Ireland, United Kingdom
              </div>

              <a
                href={`https://wa.me/${phone.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579]"
              >
                <MessageCircle size={19} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} ViewForMe.
              All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-slate-400 transition hover:text-[#78D6C9]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <p className="mt-6 max-w-4xl text-xs leading-6 text-slate-400">
            ViewForMe provides visual property-viewing services.
            Our visits do not constitute professional surveys,
            valuations, legal checks, or safety inspections.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
