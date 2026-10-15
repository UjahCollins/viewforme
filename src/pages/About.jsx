
import {
  Eye,
  Target,
  MapPin,
  Camera,
  ArrowRight,
  CheckCircle2,
  Plane,
  BriefcaseBusiness,
  Building2,
  House,
} from "lucide-react";

const audiences = [
  {
    icon: Plane,
    title: "People Relocating",
    description:
      "Moving to a new area? Get a closer look at a property before travelling to view it yourself.",
  },
  {
    icon: House,
    title: "Property Seekers",
    description:
      "Can't attend a scheduled viewing? Request someone to visit and share visual observations on your behalf.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Property Investors",
    description:
      "Request visual updates on properties you're considering without needing to be physically present.",
  },
  {
    icon: Building2,
    title: "Businesses & Property Owners",
    description:
      "Arrange commercial viewings, storage inspections, or construction progress visits remotely.",
  },
];

const values = [
  {
    title: "Convenience",
    description:
      "Request property viewings without unnecessary travel.",
  },
  {
    title: "Clear Communication",
    description:
      "Share your requirements and receive visual updates about the visit.",
  },
  {
    title: "Practical Information",
    description:
      "Get photos, videos, and observations to help you decide what to do next.",
  },
];

function About() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#17324D]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#78D6C9]">
              About ViewForMe
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Eyes on
              <span className="block text-[#78D6C9]">
                the Property.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
              We help people view properties remotely by arranging
              local viewing visits and sharing useful visual
              information, wherever they may be.
            </p>

            <a
              href="/book"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-7 py-4 font-semibold text-white transition hover:bg-[#238579]"
            >
              Book a Viewing
              <ArrowRight size={19} />
            </a>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
              alt="Modern residential property exterior"
              className="h-[350px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[450px]"
            />

            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                <Eye size={24} />
              </div>

              <div>
                <p className="font-bold text-[#17324D]">
                  ViewForMe
                </p>
                <p className="text-xs text-slate-500">
                  Your Eyes on the Property
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85"
              alt="Property professional discussing a home"
              loading="lazy"
              className="h-[350px] w-full rounded-[2rem] object-cover sm:h-[480px]"
            />
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Our Story
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#17324D] sm:text-4xl">
              Property Decisions Shouldn't Depend on
              Being Physically Present.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              Finding the right property can be challenging,
              especially when you're living in another city,
              relocating from abroad, or managing a busy schedule.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Sometimes, an interesting property becomes available
              but you simply cannot attend the viewing.
              Travelling long distances for every appointment
              can be expensive, inconvenient, and time-consuming.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-600">
              ViewForMe is designed to make that process easier.
              Customers can request a local representative to
              visit a property, observe specified areas, and
              share photos, videos, and practical observations.
            </p>

            <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#F0FAF8] p-5">
              <CheckCircle2
                size={22}
                className="mt-0.5 shrink-0 text-[#2A9D8F]"
              />

              <p className="text-sm font-medium leading-7 text-[#226E66]">
                Our goal is simple: help you get a clearer
                picture of a property before deciding
                your next step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#F6F9FA] px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              What Drives Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Making Remote Property Viewing Easier
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Our mission is to make property viewing more
              accessible and convenient through clear
              communication and practical visual information.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => {
              const icons = [MapPin, Eye, Camera];
              const Icon = icons[index];

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#17324D]">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Who We Help
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Property Viewing Support for Different Needs
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Whether you're searching for a new home,
              exploring an investment, or managing a property
              remotely, ViewForMe is designed to help.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {audiences.map((audience) => {
              const Icon = audience.icon;

              return (
                <div
                  key={audience.title}
                  className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-teal-200 hover:shadow-md sm:flex-row"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#17324D]">
                      {audience.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {audience.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICE SCOPE */}
      <section className="bg-[#F6F9FA] px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-white p-7 sm:flex-row sm:p-9">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
            <Target size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17324D]">
              Understanding What Our Service Covers
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              ViewForMe provides visual property observations,
              photographs, and videos based on the viewing
              requirements agreed for each visit.
              We do not provide professional property surveys,
              valuations, technical testing, legal advice,
              or certified safety inspections.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#78D6C9]">
            Let's Get Started
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Can't Attend the Viewing?
            <span className="mt-2 block text-[#78D6C9]">
              We're Here to Help.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200">
            Tell us which property you'd like viewed and
            what you'd like us to look out for.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579]"
            >
              Book a Viewing
              <ArrowRight size={19} />
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
