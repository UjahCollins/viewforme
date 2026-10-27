
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import react from "react";
function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Hero text */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3.5 py-2">
            <span className="h-2 w-2 rounded-full bg-[#2A9D8F]" />
            <span className="text-xs font-semibold tracking-wide text-[#226E66] sm:text-sm">
              PROPERTY VIEWINGS MADE SIMPLE
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.13] tracking-tight text-[#17324D] sm:text-5xl lg:text-6xl">
            Can't Make the Viewing?
            <span className="mt-2 block text-[#2A9D8F]">
              We'll Go for You.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Get a local representative to visit your chosen property,
            capture photos and videos, and check the details that matter
            to you. Receive your viewing results directly through WhatsApp.
          </p>

          {/* Benefits */}
          <div className="mt-6 flex flex-col gap-3">
            {[
              "Photos and videos from your viewing",
              "Checks tailored to your requirements",
              "Results delivered directly to WhatsApp",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-[#2A9D8F]"
                />
                <span className="text-sm text-slate-600 sm:text-base">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/book"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-7 py-4 font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#238579]"
            >
              Book a Viewing
              <ArrowRight size={19} />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 px-7 py-4 font-semibold text-[#17324D] transition hover:bg-slate-50"
            >
              <PlayCircle size={19} />
              See How It Works
            </a>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Serving property seekers who need an extra pair of eyes on the ground.
          </p>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-teal-100/70 blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-2xl shadow-slate-900/10">
            <img
              src="https://res.cloudinary.com/je2503b8/image/upload/v1793092266/IMG_0958.jpg"
              alt="Modern residential property with landscaped grounds"
              className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[560px]"
            />

            {/* Image caption */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 pt-24 sm:p-8 sm:pt-28">
              <p className="text-sm font-medium text-white/80">
                Your property. Your requirements.
              </p>
              <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                A closer look, even from afar.
              </p>
            </div>
          </div>

          {/* WhatsApp delivery card */}
          <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-left-6 sm:right-auto sm:min-w-[260px] sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <p className="font-bold text-[#17324D]">
                  Viewing updates
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Delivered directly via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
