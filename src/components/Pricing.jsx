
import {
  MapPin,
  House,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const pricingFactors = [
  {
    icon: MapPin,
    title: "Property Location",
    description:
      "The distance and location of the property help determine the viewing cost.",
  },
  {
    icon: House,
    title: "Service Type",
    description:
      "Choose from residential, commercial, storage, or construction progress viewings.",
  },
  {
    icon: ClipboardList,
    title: "Your Requirements",
    description:
      "Provide your viewing instructions so we can understand the scope of your request.",
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#2A9D8F]">
            Simple & Transparent
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#17324D] sm:text-4xl lg:text-5xl">
            Pricing That Fits Your Viewing
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Every property viewing is different. Your viewing cost
            depends on the property's location, the service selected,
            and any additional requirements.
          </p>
        </div>

        {/* Pricing factors */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pricingFactors.map((factor) => {
            const Icon = factor.icon;

            return (
              <div
                key={factor.title}
                className="rounded-2xl border border-slate-100 bg-[#F6F9FA] p-7 text-center transition hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F]">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-[#17324D]">
                  {factor.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pricing CTA */}
        <div className="mt-12 overflow-hidden rounded-[2rem] bg-[#17324D] px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#78D6C9]">
            <CheckCircle2 size={28} />
          </div>

          <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Know Your Viewing Cost Before You Pay
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Once our pricing is configured, you'll be able to enter
            your property details, review the applicable viewing cost,
            and confirm your booking before making payment.
          </p>

          <a
            href="/book"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-7 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Start Your Booking
            <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
