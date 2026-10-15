
import { ArrowRight, MessageCircle } from "lucide-react";

function FinalCTA() {
  return (
    <section className="bg-white px-5 py-20 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#17324D] px-6 py-16 text-center sm:px-12 sm:py-20">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#2A9D8F]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
            Ready to Get Started?
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Can't Be There?
            <span className="mt-2 block text-[#78D6C9]">
              Let Us Be Your Eyes.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Whether you're moving, investing, or simply too busy
            to attend a viewing, ViewForMe helps you get a closer
            look at the property that matters to you.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/book"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579] sm:w-auto"
            >
              Book a Viewing
              <ArrowRight size={19} />
            </a>

            <a
              href="/contact"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle size={19} />
              Contact Us
            </a>
          </div>

          <p className="mt-7 text-xs leading-6 text-slate-300">
            Choose your service, share your requirements,
            and let us help arrange your viewing.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
