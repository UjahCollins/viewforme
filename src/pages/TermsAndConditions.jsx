
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  Mail,
  Info,
  ArrowRight,
} from "lucide-react";

const sections = [
  { id: "about", title: "About ViewForMe" },
  { id: "services", title: "Our Services" },
  { id: "booking", title: "Booking & Confirmation" },
  { id: "payment", title: "Pricing & Payments" },
  { id: "customer", title: "Customer Responsibilities" },
  { id: "access", title: "Property Access" },
  { id: "reports", title: "Viewing Materials" },
  { id: "cancellation", title: "Cancellations & Refunds" },
  { id: "consumer-rights", title: "Consumer Rights" },
  { id: "liability", title: "Liability" },
  { id: "complaints", title: "Complaints & Disputes" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Information" },
];

function TermsSection({ id, title, children }) {
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

function TermsAndConditions() {
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
            <FileText
              size={27}
              className="text-[#78D6C9]"
            />

            <span className="text-sm font-bold uppercase tracking-widest text-[#78D6C9]">
              Legal Information
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white sm:text-5xl">
            Terms and Conditions
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Important information about requesting
            and receiving property viewing services
            through ViewForMe.
          </p>

          <p className="mt-6 text-sm text-slate-300">
            Status: Draft — pending business approval
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* TABLE OF CONTENTS */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-[#F6F9FA] p-6">
              <h2 className="font-bold text-[#17324D]">
                On This Page
              </h2>

              <nav
                aria-label="Terms and conditions sections"
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

          {/* TERMS */}
          <article className="min-w-0 space-y-10">
            <ReviewNotice>
              These terms are a working draft.
              The business must confirm its legal
              identity, pricing arrangements,
              cancellation rules, and other
              operational details before publication.
            </ReviewNotice>

            {/* 1 */}
            <TermsSection
              id="about"
              title="1. About ViewForMe"
            >
              <p>
                ViewForMe is a property viewing service
                intended to help customers obtain
                visual information about properties
                they cannot conveniently visit
                themselves.
              </p>

              <p>
                The service involves arranging
                authorised visits and providing
                agreed photographs, videos,
                and factual visual observations.
              </p>

              <p>
                ViewForMe does not act as the seller,
                landlord, letting agent, or purchaser
                of a property merely by providing
                a viewing service.
              </p>

              <ReviewNotice>
                Insert the full legal trading entity,
                registered address, and required
                business identification details.
                Confirm the precise legal role of
                ViewForMe and its viewers.
              </ReviewNotice>
            </TermsSection>

            {/* 2 */}
            <TermsSection
              id="services"
              title="2. Services Provided"
            >
              <p>
                The services offered may include:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Residential Property Viewing.</li>
                <li>Commercial Property Viewing.</li>
                <li>Storage Unit Inspection.</li>
                <li>Construction Progress Inspection.</li>
              </ul>

              <p>
                These services are intended to provide
                visual observations of accessible
                property areas.
              </p>

              <p>
                They do not constitute professional
                property surveys, structural
                assessments, valuations, certified
                safety inspections, legal advice,
                or specialist technical testing.
              </p>

              <p>
                Service availability depends on
                location, the requested scope,
                access arrangements, and viewer
                availability.
              </p>
            </TermsSection>

            {/* 3 */}
            <TermsSection
              id="booking"
              title="3. Booking Requests and Confirmation"
            >
              <p>
                Customers may submit a booking
                request through the website
                by providing the relevant
                property and contact details.
              </p>

              <p>
                A booking request does not,
                by itself, guarantee that a
                viewing will take place at
                the requested time.
              </p>

              <p>
                A successful payment does not
                automatically mean that the
                requested appointment has
                been confirmed.
              </p>

              <p>
                An appointment is confirmed
                only when ViewForMe communicates
                that the necessary scheduling
                and property access arrangements
                have been completed.
              </p>

              <ReviewNotice>
                Confirm when a legally binding
                service contract is formed and
                how booking acceptance will be
                communicated to customers.
              </ReviewNotice>
            </TermsSection>

            {/* 4 */}
            <TermsSection
              id="payment"
              title="4. Pricing and Payments"
            >
              <p>
                The applicable price should
                be presented to the customer
                before payment is requested.
              </p>

              <p>
                Pricing may depend on the
                type of service, property
                location, travel distance,
                and agreed requirements.
              </p>

              <p>
                Where online payments are
                available, the payment
                process may be handled
                by an authorised third-party
                payment provider.
              </p>

              <p>
                Customers should be informed
                of the total payable amount,
                including any applicable
                taxes or additional charges,
                before completing an order.
              </p>

              <ReviewNotice>
                Confirm the final pricing model,
                currency, VAT treatment, payment
                timing, and any permitted
                additional charges. The Stripe
                integration is not yet active.
              </ReviewNotice>
            </TermsSection>

            {/* 5 */}
            <TermsSection
              id="customer"
              title="5. Customer Responsibilities"
            >
              <p>
                Customers are expected to
                provide accurate information
                when requesting a viewing.
              </p>

              <p>
                This includes the property
                address, preferred schedule,
                relevant contact information,
                and requested viewing scope.
              </p>

              <p>
                Customers should not request
                access to a property or area
                without appropriate permission.
              </p>

              <p>
                Customers should also avoid
                providing unnecessary sensitive
                information in booking forms
                or communication channels.
              </p>
            </TermsSection>

            {/* 6 */}
            <TermsSection
              id="access"
              title="6. Property Access and Viewer Responsibilities"
            >
              <p>
                All property visits require
                appropriate authorisation
                and access arrangements.
              </p>

              <p>
                Viewers must respect the
                agreed appointment time,
                property rules, privacy,
                and any applicable site
                access requirements.
              </p>

              <p>
                Viewers should not enter
                restricted or unsafe areas
                or carry out activities
                outside the agreed scope.
              </p>

              <p>
                Construction site visits
                are subject to site
                authorisation and appropriate
                safety arrangements.
              </p>

              <p>
                If access cannot be arranged,
                ViewForMe will need to discuss
                the available options
                with the customer.
              </p>
            </TermsSection>

            {/* 7 */}
            <TermsSection
              id="reports"
              title="7. Viewing Materials and Limitations"
            >
              <p>
                Depending on the agreed
                service, customers may receive
                photographs, videos, and
                factual visual observations.
              </p>

              <p>
                These materials describe
                visible conditions at the
                time of the visit and
                within the accessible areas.
              </p>

              <p>
                They may not identify hidden
                defects, structural problems,
                electrical faults, legal
                restrictions, or other
                matters requiring specialist
                investigation.
              </p>

              <p>
                Customers should obtain
                independent professional
                advice where appropriate
                before making significant
                property decisions.
              </p>

              <ReviewNotice>
                Confirm the actual report
                format, delivery method,
                expected turnaround time,
                and permitted use of
                photographs and videos.
              </ReviewNotice>
            </TermsSection>

            {/* 8 */}
            <TermsSection
              id="cancellation"
              title="8. Rescheduling, Cancellations and Refunds"
            >
              <p>
                Customers may need to
                reschedule or cancel
                a requested viewing.
              </p>

              <p>
                The treatment of cancellations,
                unsuccessful access attempts,
                and refunds must be explained
                before a customer is required
                to pay.
              </p>

              <p>
                The applicable arrangements
                should also distinguish
                between an unconfirmed request
                and a confirmed appointment.
              </p>

              <p>
                Additional information will
                be provided in the{" "}
                <Link
                  to="/refund-policy"
                  className="font-semibold text-[#2A9D8F] underline"
                >
                  Cancellation and Refund Policy
                </Link>
                .
              </p>

              <ReviewNotice>
                Define cancellation windows,
                rescheduling rules, no-access
                scenarios, and any applicable
                charges or refunds. These must
                be checked against statutory
                consumer cancellation rights.
              </ReviewNotice>
            </TermsSection>

            {/* 9 */}
            <TermsSection
              id="consumer-rights"
              title="9. Consumer Rights"
            >
              <p>
                Customers who qualify as
                consumers may have statutory
                rights under applicable
                UK consumer legislation.
              </p>

              <p>
                Services supplied to consumers
                must meet relevant legal
                standards, including the
                requirement to perform
                services with reasonable
                care and skill.
              </p>

              <p>
                Distance contracts may also
                be subject to statutory
                cancellation and information
                requirements, depending
                on the circumstances.
              </p>

              <p>
                Nothing in these terms is
                intended to exclude or
                restrict consumer rights
                that cannot lawfully
                be excluded.
              </p>

              <ReviewNotice>
                Have a qualified UK legal
                professional review the
                treatment of distance-contract
                cancellation rights, including
                requests to start services
                within a statutory cancellation
                period.
              </ReviewNotice>
            </TermsSection>

            {/* 10 */}
            <TermsSection
              id="liability"
              title="10. Liability"
            >
              <p>
                ViewForMe's obligations
                and responsibilities should
                be assessed according to
                the agreed service and
                applicable law.
              </p>

              <p>
                Visual observations are
                limited to the areas and
                conditions observable
                during an authorised visit.
              </p>

              <p>
                No provision in these
                terms excludes or limits
                liability where doing so
                would be unlawful.
              </p>

              <ReviewNotice>
                Finalise any limitation
                of liability only after
                reviewing applicable consumer
                law, insurance arrangements,
                service risks, and the
                business's legal structure.
              </ReviewNotice>
            </TermsSection>

            {/* 11 */}
            <TermsSection
              id="complaints"
              title="11. Complaints and Disputes"
            >
              <p>
                Customers who have concerns
                about a booking or completed
                service should contact
                ViewForMe with the relevant
                booking information and
                details of the issue.
              </p>

              <p>
                The business should review
                complaints fairly and
                communicate available
                resolution options.
              </p>

              <ReviewNotice>
                Confirm the complaints
                procedure, response targets,
                any applicable alternative
                dispute resolution arrangements,
                and the governing law and
                jurisdiction provisions.
              </ReviewNotice>
            </TermsSection>

            {/* 12 */}
            <TermsSection
              id="changes"
              title="12. Changes to These Terms"
            >
              <p>
                ViewForMe may update these
                terms to reflect changes
                in its services, operations,
                or legal requirements.
              </p>

              <p>
                Customers should be able
                to identify the version
                applicable when they
                entered into their
                service agreement.
              </p>

              <p>
                Changes should not
                retrospectively remove
                existing contractual
                or statutory rights.
              </p>
            </TermsSection>

            {/* 13 */}
            <TermsSection
              id="contact"
              title="13. Contact Information"
            >
              <p>
                For questions about
                these terms or ViewForMe
                services, contact:
              </p>

              <a
                href="mailto:support@viewforme.org"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                <Mail size={18} />
                support@viewforme.org
              </a>

              <ReviewNotice>
                Verify this email address
                and add the legally required
                business contact information.
              </ReviewNotice>
            </TermsSection>

            {/* FINAL CTA */}
            <div className="rounded-2xl bg-[#F0FAF8] p-7">
              <h2 className="text-xl font-bold text-[#17324D]">
                Have a Question About Our Terms?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Contact ViewForMe if you
                need clarification about
                our services or booking process.
              </p>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 font-semibold text-white transition hover:bg-[#238579]"
              >
                Contact Us
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default TermsAndConditions;
