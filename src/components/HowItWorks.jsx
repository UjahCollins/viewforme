
import {
  CalendarCheck,
  ClipboardCheck,
  House,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CalendarCheck,
    title: "Book a Viewing",
    description:
      "Choose your viewing service, enter the property details, and select your preferred date and time.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Confirm Your Request",
    description:
      "Tell us what matters to you. After payment, we'll review your request and arrange a suitable local viewer.",
  },
  {
    number: "03",
    icon: House,
    title: "We Visit the Property",
    description:
      "Once the appointment is confirmed, your assigned viewer attends the property, captures photos and videos, and checks your requested details.",
  },
  {
    number: "04",
    icon: MessageCircle,
    title: "Receive Your Results",
    description:
      "Get your viewing photos, videos, and relevant observations delivered directly through WhatsApp.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#F6F9FA] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#2A9D8F]">
            Simple & Convenient
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#17324D] sm:text-4xl lg:text-5xl">
            How ViewForMe Works
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Can't be there in person? We'll help you see the property
            without making the trip. Here's how it works.
          </p>
        </div>

        {/* Steps grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F] transition-colors group-hover:bg-[#2A9D8F] group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-3xl font-extrabold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#17324D]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-base font-medium text-slate-600">
            Ready to see your next property without travelling?
          </p>

          <a
            href="/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-7 py-4 font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#238579]"
          >
            Book Your Viewing
            <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
