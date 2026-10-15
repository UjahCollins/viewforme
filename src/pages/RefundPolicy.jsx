
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  CalendarClock,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Mail,
  Info,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const sections = [
  { id: "overview", title: "Policy Overview" },
  { id: "cancellation-rights", title: "Statutory Cancellation Rights" },
  { id: "customer-cancellation", title: "Customer Cancellations" },
  { id: "rescheduling", title: "Rescheduling" },
  { id: "unavailability", title: "Unavailable Viewers" },
  { id: "property-access", title: "Property Access Issues" },
  { id: "missed-appointments", title: "Missed Appointments" },
  { id: "completed-services", title: "Completed Services" },
  { id: "refund-processing", title: "Refund Processing" },
  { id: "request-refund", title: "Requesting a Refund" },
  { id: "contact", title: "Contact Us" },
];

const scenarios = [
  {
    icon: CalendarClock,
    title: "Customer Cancellation",
    description:
      "Customers may request cancellation before or after appointment confirmation. Any refund depends on the applicable legal rights and agreed cancellation terms.",
  },
  {
    icon: RefreshCcw,
    title: "Rescheduling Requests",
    description:
      "Customers may request an alternative appointment. Rescheduling depends on property access and viewer availability.",
  },
  {
    icon: AlertCircle,
    title: "Viewing Cannot Proceed",
    description:
      "If an appointment cannot proceed, ViewForMe will review the circumstances and communicate appropriate options.",
  },
];

function PolicySection({ id, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-slate-200 pb-9 last:border-0"
    >
      <h2 className="text-xl font-bold text-[#17324D] sm:text-2xl">
        {title}
      </h2>

      <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function ReviewNotice({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <Info
        size={19}
        className="mt-1 shrink-0 text-amber-700"
      />

      <p className="text-sm leading-7 text-amber-900">
        <strong>Client confirmation required:</strong>{" "}
        {children}
      </p>
    </div>
  );
}

function RefundPolicy() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-[#17324D] px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="mt-9 flex items-center gap-3">
            <RefreshCcw
              size={27}
              className="text-[#78D6C9]"
            />

            <span className="text-sm font-bold uppercase tracking-widest text-[#78D6C9]">
              Booking Policies
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Cancellation & Refund Policy
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Information about cancelling a property
            viewing request, rescheduling an appointment,
            and requesting a refund.
          </p>

          <p className="mt-6 text-sm text-slate-300">
            Status: Draft — pending business approval
          </p>
        </div>
      </section>

      {/* INTRODUCTION CARDS */}
      <section className="bg-[#F6F9FA] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;

              return (
                <div
                  key={scenario.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                >
                  <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-[#E8F6F3] p-3 text-[#2A9D8F]">
                    <Icon size={25} />
                  </div>

                  <h2 className="mt-6 text-lg font-bold text-[#17324D]">
                    {scenario.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {scenario.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN POLICY */}
      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* TABLE OF CONTENTS */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-[#F6F9FA] p-6">
              <h2 className="font-bold text-[#17324D]">
                On This Page
              </h2>

              <nav
                aria-label="Refund policy sections"
                className="mt-5 space-y-3"
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-slate-600 transition hover:text-[#2A9D8F]"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* POLICY CONTENT */}
          <article className="min-w-0 space-y-10">
            <ReviewNotice>
              This policy is a draft. Cancellation
              periods, refund eligibility, and
              processing arrangements must be
              approved before accepting payments.
            </ReviewNotice>

            {/* OVERVIEW */}
            <PolicySection
              id="overview"
              title="1. Policy Overview"
            >
              <p>
                ViewForMe provides arranged visual
                property viewing services for
                customers who cannot conveniently
                attend a property themselves.
              </p>

              <p>
                This policy explains how requests
                to cancel or reschedule a viewing
                may be handled and what customers
                should know about refunds.
              </p>

              <p>
                A submitted booking request,
                a successful payment, and a
                confirmed appointment are
                separate stages of the process.
              </p>

              <p>
                An appointment is confirmed
                only after the necessary property
                access and viewer availability
                arrangements have been completed.
              </p>
            </PolicySection>

            {/* STATUTORY RIGHTS */}
            <PolicySection
              id="cancellation-rights"
              title="2. Statutory Cancellation Rights"
            >
              <p>
                Customers who qualify as consumers
                may have statutory cancellation
                rights when purchasing services
                online or through other
                distance-selling arrangements.
              </p>

              <p>
                Where applicable, the usual
                cancellation period for a
                distance service contract is
                14 days from the day after
                the contract is entered into,
                subject to legal exceptions
                and specific rules concerning
                services started or completed
                during that period.
              </p>

              <p>
                Customers may be required to
                pay a proportionate amount
                for services supplied during
                the cancellation period only
                where the relevant legal
                conditions have been met.
              </p>

              <p>
                Nothing in this policy is
                intended to remove or restrict
                statutory consumer rights.
              </p>

              <ReviewNotice>
                Confirm whether any legal
                exceptions apply to the
                particular services offered.
                The checkout must handle
                requests for early service
                commencement and any required
                acknowledgements correctly.
              </ReviewNotice>
            </PolicySection>

            {/* CUSTOMER CANCELLATION */}
            <PolicySection
              id="customer-cancellation"
              title="3. Customer Cancellations"
            >
              <p>
                Customers may contact ViewForMe
                to request cancellation of
                a property viewing.
              </p>

              <p>
                The outcome will depend on
                the booking stage, any services
                already performed, the agreed
                terms, and applicable
                statutory rights.
              </p>

              <p>
                ViewForMe should communicate
                whether the request has been
                cancelled and explain any
                refund or charge that applies.
              </p>

              <ReviewNotice>
                Establish any additional
                contractual cancellation
                windows and fees. They must
                be clearly disclosed before
                purchase and must not
                override applicable legal rights.
              </ReviewNotice>
            </PolicySection>

            {/* RESCHEDULING */}
            <PolicySection
              id="rescheduling"
              title="4. Rescheduling Appointments"
            >
              <p>
                Customers may request an
                alternative date or time
                for their viewing.
              </p>

              <p>
                Rescheduling is subject to
                the availability of an
                appropriate viewer and
                the property representative's
                ability to provide access.
              </p>

              <p>
                A new appointment is only
                confirmed when ViewForMe
                communicates the revised
                arrangements.
              </p>

              <ReviewNotice>
                Confirm whether rescheduling
                is free, whether any notice
                period applies, and when
                additional costs may arise.
              </ReviewNotice>
            </PolicySection>

            {/* VIEWER UNAVAILABLE */}
            <PolicySection
              id="unavailability"
              title="5. When a Viewer Is Unavailable"
            >
              <p>
                ViewForMe may be unable to
                arrange a suitable viewer
                for a requested appointment.
              </p>

              <p>
                In such circumstances,
                ViewForMe should contact
                the customer to discuss
                alternative arrangements.
              </p>

              <p>
                Where ViewForMe cannot
                provide the agreed service,
                the customer may be
                entitled to an appropriate
                refund or other remedy
                under the contract and
                applicable law.
              </p>

              <ReviewNotice>
                Approve the exact refund
                procedure for bookings that
                ViewForMe cannot fulfil.
              </ReviewNotice>
            </PolicySection>

            {/* PROPERTY ACCESS */}
            <PolicySection
              id="property-access"
              title="6. Property Access Issues"
            >
              <p>
                Property visits depend on
                appropriate authorisation
                and access arrangements.
              </p>

              <p>
                A viewing may be affected
                if a landlord, agent,
                property representative,
                or other authorised person
                cannot provide access.
              </p>

              <p>
                ViewForMe should review
                the reason for the
                unsuccessful appointment
                and communicate the
                available options.
              </p>

              <p>
                These may include
                rescheduling or another
                appropriate resolution,
                depending on the
                circumstances and the
                customer's legal rights.
              </p>

              <ReviewNotice>
                Define how unsuccessful
                access attempts are handled,
                including any travel charges,
                customer-provided access
                information, and refunds.
              </ReviewNotice>
            </PolicySection>

            {/* MISSED APPOINTMENTS */}
            <PolicySection
              id="missed-appointments"
              title="7. Missed Appointments"
            >
              <p>
                If an assigned viewer
                does not attend a confirmed
                appointment, ViewForMe
                should investigate the
                circumstances and communicate
                a suitable resolution.
              </p>

              <p>
                If a viewing cannot proceed
                because required access
                arrangements were not
                available, the circumstances
                should be reviewed before
                determining any charges
                or refunds.
              </p>

              <ReviewNotice>
                Establish operational
                procedures for late arrivals,
                viewer no-shows, property
                representative no-shows,
                and other missed appointments.
              </ReviewNotice>
            </PolicySection>

            {/* COMPLETED SERVICES */}
            <PolicySection
              id="completed-services"
              title="8. Completed Viewing Services"
            >
              <p>
                Once a viewing has been
                carried out, the availability
                of cancellation or refund
                rights depends on the
                circumstances, the contract,
                and applicable law.
              </p>

              <p>
                Where a consumer has expressly
                requested that services begin
                during an applicable statutory
                cancellation period, specific
                rules may apply to charges
                and cancellation rights.
              </p>

              <p>
                Customers may also have
                remedies if a service
                has not been performed
                with reasonable care and skill.
              </p>

              <p>
                Completion of a viewing
                does not automatically
                remove all statutory
                consumer rights.
              </p>
            </PolicySection>

            {/* REFUND PROCESSING */}
            <PolicySection
              id="refund-processing"
              title="9. Refund Processing"
            >
              <p>
                Where a refund is due,
                ViewForMe should communicate
                the amount and the
                applicable processing
                arrangements.
              </p>

              <p>
                Statutory cancellation
                refunds are subject to
                applicable legal deadlines
                and payment-method rules.
              </p>

              <p>
                The time taken for a
                refunded amount to appear
                in a customer's account
                may also depend on
                the payment provider
                and financial institution.
              </p>

              <ReviewNotice>
                Confirm the refund
                processing workflow,
                payment provider procedures,
                and any contractual refund
                commitments beyond
                statutory requirements.
              </ReviewNotice>
            </PolicySection>

            {/* REQUEST REFUND */}
            <PolicySection
              id="request-refund"
              title="10. How to Request a Cancellation or Refund"
            >
              <p>
                Customers can contact
                ViewForMe to request
                a cancellation,
                rescheduling, or refund.
              </p>

              <p>
                To help identify the
                relevant booking, customers
                should provide:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Their name and contact information.
                </li>
                <li>
                  Their booking reference, if available.
                </li>
                <li>
                  The relevant property or appointment.
                </li>
                <li>
                  The nature of the request.
                </li>
              </ul>

              <p>
                Customers should not
                send full payment card
                details or unnecessary
                sensitive information.
              </p>

              <a
                href="mailto:viewforme@property.co.uk"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                <Mail size={18} />
                viewforme@property.co.uk
              </a>

              <ReviewNotice>
                Verify the support email
                address and establish
                an internal process for
                receiving and tracking
                cancellation requests.
              </ReviewNotice>
            </PolicySection>

            {/* CONTACT */}
            <PolicySection
              id="contact"
              title="11. Contact Us"
            >
              <p>
                For questions about
                this policy or a
                property viewing,
                please contact ViewForMe.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                Visit our Contact Page
                <ArrowRight size={17} />
              </Link>
            </PolicySection>

            {/* FINAL NOTICE */}
            <div className="rounded-2xl bg-[#F0FAF8] p-7">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={26}
                  className="shrink-0 text-[#2A9D8F]"
                />

                <div>
                  <h2 className="text-xl font-bold text-[#17324D]">
                    Your Consumer Rights
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    This policy is intended
                    to explain the treatment
                    of cancellations and refunds.
                    It does not override
                    applicable statutory
                    consumer protections.
                  </p>

                  <Link
                    to="/terms"
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
                  >
                    Read Terms and Conditions
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default RefundPolicy;
