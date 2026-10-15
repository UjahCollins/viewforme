
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ClipboardList,
  MapPin,
  CalendarDays,
  CreditCard,
  UserCheck,
  Camera,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CircleCheck,
  Images,
  Video,
  FileText,
  ChevronDown,
  Info,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Choose Your Service",
    description:
      "Start by selecting the type of property viewing you need. ViewForMe supports residential properties, commercial premises, storage spaces, and visual construction progress visits.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Share Property Details",
    description:
      "Tell us where the property is located, provide any available access information, and specify what you'd like the viewer to observe.",
  },
  {
    number: "03",
    icon: CalendarDays,
    title: "Request a Viewing Schedule",
    description:
      "Choose your preferred date and time. You can also provide an alternative appointment to help with scheduling.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Review Your Booking & Pay",
    description:
      "Review your request and the final price before proceeding to secure payment. Payment means your request has been received; it does not automatically confirm the appointment.",
  },
  {
    number: "05",
    icon: UserCheck,
    title: "We Arrange the Viewing",
    description:
      "Our team reviews your request, coordinates property access, and arranges an available local viewer. You'll receive confirmation once the appointment has been agreed.",
  },
  {
    number: "06",
    icon: Camera,
    title: "Receive Your Viewing Updates",
    description:
      "Following the visit, receive the agreed photographs, videos, and visual observations to help you decide on your next steps.",
  },
];

const deliverables = [
  {
    icon: Images,
    title: "Property Photographs",
    description:
      "Images of accessible areas relevant to your viewing requirements.",
  },
  {
    icon: Video,
    title: "Property Videos",
    description:
      "Video footage showing accessible spaces and visible features, where agreed.",
  },
  {
    icon: FileText,
    title: "Visual Observations",
    description:
      "Practical notes about what the viewer could see during the visit.",
  },
];

const statuses = [
  {
    icon: Clock3,
    title: "Request Received",
    description:
      "Your request and payment have been recorded. The appointment is still awaiting confirmation.",
  },
  {
    icon: UserCheck,
    title: "Viewing Confirmed",
    description:
      "Property access and viewer availability have been arranged, and the appointment has been confirmed.",
  },
  {
    icon: CircleCheck,
    title: "Viewing Completed",
    description:
      "The property visit has taken place. The agreed viewing materials will be prepared and shared.",
  },
];

const faqs = [
  {
    question: "Do I need to be present during the viewing?",
    answer:
      "No. ViewForMe is designed for customers who cannot attend in person. You provide your requirements, and an arranged local viewer visits the property on your behalf.",
  },
  {
    question: "Does payment automatically confirm my viewing?",
    answer:
      "No. Payment records your viewing request. The appointment is only confirmed after property access and viewer availability have been arranged.",
  },
  {
    question: "Can I choose what the viewer checks?",
    answer:
      "Yes. During booking, you can select checklist items, add custom questions, and provide special instructions. Requests must remain within the agreed scope of a visual viewing service.",
  },
  {
    question: "How will I receive my viewing materials?",
    answer:
      "ViewForMe plans to share photographs, videos, and observations through the agreed communication channel, including WhatsApp where appropriate.",
  },
  {
    question: "Can ViewForMe tell me whether a property is safe to buy?",
    answer:
      "No. ViewForMe provides visual observations, not professional surveys, structural assessments, valuations, or certified safety inspections. You should engage qualified professionals for those services.",
  },
  {
    question: "What happens if access to the property cannot be arranged?",
    answer:
      "Our team will contact you about the available options. Any rescheduling, cancellation, or refund will be handled according to the terms agreed at booking and the applicable refund policy.",
  },
];

function ProcessCard({ step }) {
  const Icon = step.icon;

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-teal-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <Icon size={27} strokeWidth={1.8} />
        </div>

        <span className="text-4xl font-extrabold text-slate-100">
          {step.number}
        </span>
      </div>

      <h3 className="mt-7 text-xl font-bold text-[#17324D]">
        {step.title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {step.description}
      </p>
    </div>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-5 py-6 text-left"
      >
        <span className="text-base font-bold text-[#17324D]">
          {item.question}
        </span>

        <ChevronDown
          size={20}
          className={`shrink-0 text-[#2A9D8F] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <p className="pb-6 pr-8 text-sm leading-7 text-slate-600">
          {item.answer}
        </p>
      )}
    </div>
  );
}

function HowItWorksPage() {
  const [openFAQ, setOpenFAQ] = useState(0);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#78D6C9]">
            How ViewForMe Works
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            From Booking to
            <span className="block text-[#78D6C9]">
              Property Insights.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Discover how ViewForMe helps you request a
            local property visit, arrange your viewing,
            and receive useful visual updates.
          </p>

          <Link
            to="/book"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Book a Viewing
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-[#F6F9FA] px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              The Viewing Process
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Six Steps to Your Property Viewing
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              We've designed the process to make requesting
              a remote property viewing as straightforward
              as possible.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <ProcessCard
                key={step.number}
                step={step}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
                Your Viewing Updates
              </span>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#17324D] sm:text-4xl">
                See More Without
                Being There.
              </h2>

              <p className="mt-6 text-base leading-8 text-slate-600">
                Once the viewing has been completed,
                ViewForMe shares the agreed visual
                documentation and observations from
                the property visit.
              </p>

              <div className="mt-8 space-y-6">
                {deliverables.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#17324D]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Modern property interior"
                loading="lazy"
                className="h-[380px] w-full rounded-[2rem] object-cover shadow-sm sm:h-[520px]"
              />

              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                  <Camera size={23} />
                </div>

                <div>
                  <p className="font-bold text-[#17324D]">
                    Visual Property Updates
                  </p>

                  <p className="text-xs text-slate-500">
                    Photos, videos & observations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING STATUS */}
      <section className="bg-[#F6F9FA] px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Booking Status
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Understanding Your Booking Status
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              A paid request is not automatically a confirmed
              appointment. Here's what each stage means.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {statuses.map((status, index) => {
              const Icon = status.icon;

              return (
                <div
                  key={status.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                      <Icon size={25} />
                    </div>

                    <span className="text-sm font-bold text-slate-300">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#17324D]">
                    {status.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {status.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <Info
              size={21}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-sm leading-7 text-blue-900">
              Appointment confirmation depends on property
              access arrangements and viewer availability.
              If your requested date cannot be accommodated,
              our team will contact you about available options.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Frequently Asked Questions
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Questions About the Process?
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Here are answers to some common questions
              about requesting a viewing.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white px-6 sm:px-9">
            {faqs.map((item, index) => (
              <FAQItem
                key={item.question}
                item={item}
                isOpen={openFAQ === index}
                onToggle={() =>
                  setOpenFAQ(
                    openFAQ === index ? null : index
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST NOTICE */}
      <section className="bg-[#F6F9FA] px-5 py-14 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-7 sm:flex-row sm:p-9">
          <ShieldCheck
            size={27}
            className="shrink-0 text-[#2A9D8F]"
          />

          <div>
            <h2 className="text-xl font-bold text-[#17324D]">
              Visual Observations, Not Professional Surveys
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              ViewForMe provides photographs, videos, and
              visual observations based on the agreed
              viewing scope. Our service does not replace
              professional property surveys, structural
              assessments, valuations, technical tests,
              or certified safety inspections.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#78D6C9]">
            Get Started
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Ready to See Your Property
            <span className="block text-[#78D6C9]">
              Without Being There?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200">
            Choose your service, tell us about the property,
            and request your preferred viewing appointment.
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

export default HowItWorksPage;
