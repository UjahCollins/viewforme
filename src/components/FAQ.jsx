
import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is ViewForMe?",
    answer:
      "ViewForMe is a property-viewing service that helps you arrange for a local representative to visit a property on your behalf. We capture photos, videos, and relevant observations so you can get a closer look without attending in person.",
  },
  {
    question: "How do I book a property viewing?",
    answer:
      "Select your preferred service, provide the property address, choose a suitable date and time, and tell us what you'd like checked. You'll review your request and the applicable price before payment. Your appointment is confirmed after a viewer has been assigned and the visit arranged.",
  },
  {
    question: "How much does a viewing cost?",
    answer:
      "Pricing depends on the property's location, the service selected, and the requirements of your visit. The applicable cost will be presented for your review before payment once the booking system is configured.",
  },
  {
    question: "How will I receive my viewing results?",
    answer:
      "Your viewing photos, videos, and relevant observations will be shared directly through WhatsApp using the contact details provided during booking.",
  },
  {
    question: "Can I request specific things to be checked?",
    answer:
      "Yes. You can provide a checklist or special instructions when booking. We'll review your requirements and let you know if any requests fall outside the scope of a visual property viewing.",
  },
  {
    question: "Can I choose the date and time?",
    answer:
      "Yes. You can provide your preferred viewing date and time, along with an alternative. Appointments are subject to viewer availability and access arrangements with the property owner, agent, or landlord.",
  },
  {
    question: "What happens after I make payment?",
    answer:
      "Your booking request will be received for review. We'll arrange a suitable viewer and confirm the appointment details. Payment alone does not mean the property visit has been confirmed.",
  },
  {
    question: "Can I cancel or reschedule my viewing?",
    answer:
      "You can contact our team to request a cancellation or rescheduling. Any applicable refunds or charges will depend on the cancellation and refund policy presented during booking.",
  },
  {
    question: "Is ViewForMe a professional property survey?",
    answer:
      "No. ViewForMe provides visual observations, photographs, and videos from a scheduled visit. It does not replace a professional property survey, valuation, legal assessment, or safety inspection.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="bg-[#F6F9FA] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#2A9D8F]">
            Need Help?
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#17324D] sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Everything you need to know about booking a viewing
            with ViewForMe.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                >
                  <span className="text-base font-bold text-[#17324D]">
                    {faq.question}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F6F3] text-[#2A9D8F]">
                    {isOpen ? <Minus size={19} /> : <Plus size={19} />}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-5 pb-6 sm:px-7"
                  >
                    <p className="border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-base text-slate-600">
            Still have questions? We're here to help.
          </p>

          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-[#2A9D8F] transition hover:text-[#238579]"
          >
            Contact Our Team
            <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
