
import {
  ArrowRight,
  MapPin,
  ClipboardCheck,
  Camera,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: MapPin,
    title: "Save Time & Travel",
    description:
      "Explore properties without making unnecessary trips. Whether you're busy, relocating, or living far away, we'll attend the viewing on your behalf.",
  },
  {
    icon: ClipboardCheck,
    title: "Your Priorities Come First",
    description:
      "Tell us what you'd like checked before the visit. We'll use your instructions to guide the viewing and focus on the details that matter to you.",
  },
  {
    icon: Camera,
    title: "See More With Photos & Videos",
    description:
      "Receive visual updates that help you understand the property's appearance and visible condition before deciding on your next steps.",
  },
  {
    icon: MessageCircle,
    title: "Convenient WhatsApp Delivery",
    description:
      "No complicated customer portal required. Your viewing results can be delivered directly through WhatsApp for easy access.",
  },
];

function WhyChooseUs() {
  return (
    <section
      id="why-viewforme"
      className="overflow-hidden bg-[#F6F9FA] py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Image */}
        <div className="relative">
          <div className="absolute -left-5 -top-5 h-40 w-40 rounded-full bg-teal-100/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] shadow-xl shadow-slate-900/10">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85"
              alt="Bright modern residential property interior"
              loading="lazy"
              className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[620px]"
            />
          </div>

          {/* Floating message */}
          <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:left-auto sm:right-[-10px] sm:max-w-[270px] sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#2A9D8F]">
                <CheckCircle2 size={23} />
              </div>

              <div>
                <p className="font-bold text-[#17324D]">
                  Your Eyes on the Property
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Get a closer look, even when you can't be there.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#2A9D8F]">
            Why Choose ViewForMe?
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#17324D] sm:text-4xl lg:text-5xl">
            A Better Way to View Property,
            <span className="text-[#2A9D8F]">
              {" "}Wherever You Are.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600">
            Finding the right property shouldn't depend on whether
            you can attend every viewing in person. ViewForMe
            helps you get the information you need through
            convenient, personalised property visits.
          </p>

          {/* Benefits */}
          <div className="mt-9 space-y-7">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#17324D]">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href="/book"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-7 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Book Your Viewing
            <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
