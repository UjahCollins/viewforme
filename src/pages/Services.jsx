
import { Link } from "react-router-dom";

import {
  House,
  Building2,
  Warehouse,
  HardHat,
  ArrowRight,
  CheckCircle2,
  Camera,
  MapPin,
  ClipboardCheck,
  Info,
} from "lucide-react";

const services = [
  {
    id: "residential",
    number: "01",
    title: "Residential Property Viewing",
    subtitle: "Explore a potential home without being there.",
    description:
      "Whether you're relocating, house hunting from another city, or unable to attend a scheduled viewing, ViewForMe can arrange a local visit to help you see more of a residential property.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Modern residential property exterior",
    icon: House,
    suitableFor: [
      "People relocating to Northern Ireland",
      "House and apartment seekers",
      "Buyers and renters living abroad",
      "Anyone unable to attend a viewing",
    ],
    checklist: [
      "General visible property condition",
      "Living spaces, bedrooms, and bathrooms",
      "Kitchen and visible fixtures",
      "Windows, doors, and floors",
      "Visible signs of damp or damage",
      "Outdoor areas where accessible",
    ],
  },
  {
    id: "commercial",
    number: "02",
    title: "Commercial Property Viewing",
    subtitle: "Get a closer look at your next business space.",
    description:
      "Considering an office, retail unit, or other commercial property? Request a visual viewing to better understand the space, its layout, and observable features before making further arrangements.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Modern commercial office interior",
    icon: Building2,
    suitableFor: [
      "Business owners seeking new premises",
      "Commercial tenants",
      "Remote property investors",
      "Companies exploring office or retail spaces",
    ],
    checklist: [
      "Visible condition of the premises",
      "Internal layout and usable spaces",
      "Entrances and accessibility features",
      "Visible fittings and facilities",
      "Parking and loading access",
      "Visible damage or maintenance concerns",
    ],
  },
  {
    id: "storage",
    number: "03",
    title: "Storage Unit Inspection",
    subtitle: "A visual look at your storage space.",
    description:
      "When you cannot visit a storage unit yourself, ViewForMe can help arrange a visual visit to document the accessible space, its visible condition, and any particular areas you want checked.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Storage and warehouse interior",
    icon: Warehouse,
    suitableFor: [
      "Individuals using remote storage facilities",
      "Businesses managing stored items",
      "People relocating or moving belongings",
      "Storage space renters",
    ],
    checklist: [
      "Overall visible unit condition",
      "Doors and visible locking features",
      "Floor, walls, and accessible surfaces",
      "Visible signs of moisture or damage",
      "Access routes and lighting",
      "Requested photographs of accessible areas",
    ],
  },
  {
    id: "construction",
    number: "04",
    title: "Construction Progress Inspection",
    subtitle: "Stay informed about visible site progress.",
    description:
      "If you're managing a building project remotely, ViewForMe can arrange a site visit to document visible construction progress through photographs, videos, and factual observations.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Construction work in progress",
    icon: HardHat,
    suitableFor: [
      "Property owners managing projects remotely",
      "Overseas property investors",
      "Clients seeking visual project updates",
      "Businesses overseeing property development",
    ],
    checklist: [
      "Visible overall construction progress",
      "Accessible interior and exterior areas",
      "Visible installation and finishing work",
      "Materials and activity observable on site",
      "Photographic progress documentation",
      "Visible concerns identified during the visit",
    ],
  },
];

function ServiceSection({ service, index }) {
  const Icon = service.icon;
  const isReversed = index % 2 === 1;

  return (
    <section
      id={service.id}
      className={`scroll-mt-24 px-5 py-20 lg:px-8 lg:py-28 ${
        isReversed ? "bg-[#F6F9FA]" : "bg-white"
      }`}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div
          className={`relative ${
            isReversed ? "lg:order-2" : ""
          }`}
        >
          <img
            src={service.image}
            alt={service.imageAlt}
            loading="lazy"
            className="h-[330px] w-full rounded-[2rem] object-cover shadow-sm sm:h-[460px]"
          />

          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg sm:left-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
              <Icon size={25} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Service {service.number}
              </p>

              <p className="text-sm font-bold text-[#17324D]">
                ViewForMe
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={isReversed ? "lg:order-1" : ""}>
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
            Service {service.number}
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#17324D] sm:text-4xl">
            {service.title}
          </h2>

          <p className="mt-4 text-lg font-semibold text-[#2A9D8F]">
            {service.subtitle}
          </p>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {service.description}
          </p>

          {/* Suitable for */}
          <div className="mt-8">
            <h3 className="text-base font-bold text-[#17324D]">
              Who Is This Service For?
            </h3>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.suitableFor.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#2A9D8F]"
                  />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example checklist */}
          <div className="mt-8 rounded-2xl border border-teal-100 bg-[#F0FAF8] p-6">
            <div className="flex items-center gap-2">
              <ClipboardCheck
                size={21}
                className="text-[#2A9D8F]"
              />

              <h3 className="font-bold text-[#17324D]">
                What Can Be Observed?
              </h3>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A9D8F]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            to={`/book?service=${service.id}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-7 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Book This Service
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#78D6C9]">
            Our Services
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Property Viewing Services,
            <span className="block text-[#78D6C9]">
              Wherever You Are.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            From residential and commercial properties to
            storage spaces and construction sites, explore
            how ViewForMe can help you see more without
            needing to attend in person.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#78D6C9] hover:bg-white/20"
              >
                {service.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-b border-slate-100 bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Local Property Visits",
              description:
                "Request a viewing of an eligible property in Northern Ireland.",
            },
            {
              icon: Camera,
              title: "Photos & Videos",
              description:
                "Receive visual documentation of accessible areas based on your agreed requirements.",
            },
            {
              icon: ClipboardCheck,
              title: "Your Requirements",
              description:
                "Choose what you'd like the viewer to focus on during the visit.",
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#17324D]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Service sections */}
      {services.map((service, index) => (
        <ServiceSection
          key={service.id}
          service={service}
          index={index}
        />
      ))}

      {/* Scope notice */}
      <section className="bg-[#F6F9FA] px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 sm:flex-row sm:p-9">
          <Info
            size={25}
            className="shrink-0 text-[#2A9D8F]"
          />

          <div>
            <h2 className="text-xl font-bold text-[#17324D]">
              Important Information About Our Services
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              ViewForMe provides visual observations and
              documentation only. Our visits do not constitute
              a professional survey, valuation, structural
              assessment, certified safety inspection,
              legal assessment, or technical test.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              All visits are subject to property access,
              viewer availability, and confirmation of
              the requested scope of work.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#78D6C9]">
            Ready to Get Started?
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Let Us Be Your Eyes
            <span className="block text-[#78D6C9]">
              on the Property.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200">
            Tell us about the property you'd like viewed,
            choose your requirements, and request a visit.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579]"
            >
              Book a Viewing
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
