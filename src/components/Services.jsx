
import {
  ArrowUpRight,
  House,
  Building2,
  Warehouse,
  HardHat,
} from "lucide-react";

const services = [
  {
    id: "residential",
    title: "Residential Property Viewing",
    description:
      "Looking to rent or buy a home but can't attend the viewing? We'll visit on your behalf, capture photos and videos, and check the details that matter to you.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    icon: House,
    category: "Homes & Apartments",
  },
  {
    id: "commercial",
    title: "Commercial Property Viewing",
    description:
      "Explore offices, shops, and other commercial spaces without travelling. Get a clearer picture of the property before making your next decision.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    icon: Building2,
    category: "Offices & Business Spaces",
  },
  {
    id: "storage",
    title: "Storage Unit Inspection",
    description:
      "Need someone to visually inspect a storage space? We'll capture its visible condition and provide photos, videos, and observations.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85",
    icon: Warehouse,
    category: "Storage Spaces",
  },
  {
    id: "construction",
    title: "Construction Progress Inspection",
    description:
      "Stay informed about visible progress on your building project. Receive photos, videos, and updates from a scheduled site visit.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85",
    icon: HardHat,
    category: "Building Projects",
  },
];

function Services() {
  return (
    <section
      id="services"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#2A9D8F]">
            What We Do
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#17324D] sm:text-4xl lg:text-5xl">
            Property Viewing Services
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Whether you're exploring a new home, checking a business
            space, or following up on a building project, ViewForMe
            helps you see what matters without being there in person.
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                className="group overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Service image */}
                <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-64">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#17324D] shadow-sm">
                    {service.category}
                  </div>
                </div>

                {/* Service details */}
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-xl font-bold text-[#17324D] sm:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {service.description}
                  </p>

                  <a
                    href={`/book?service=${service.id}`}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-[#2A9D8F] transition hover:gap-3 hover:text-[#238579]"
                  >
                    Book This Service
                    <ArrowUpRight size={19} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-6 text-slate-500">
          ViewForMe provides visual observations and media from
          scheduled visits. Our services do not replace professional
          surveys, valuations, legal checks, or safety inspections.
        </p>
      </div>
    </section>
  );
}

export default Services;
