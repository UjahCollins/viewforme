
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  ExternalLink,
  Info,
} from "lucide-react";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information", title: "Information We Collect" },
  { id: "purposes", title: "How We Use Information" },
  { id: "lawful-bases", title: "Lawful Bases" },
  { id: "sharing", title: "Sharing Information" },
  { id: "transfers", title: "International Transfers" },
  { id: "retention", title: "Data Retention" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies" },
  { id: "contact", title: "Contact & Complaints" },
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
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <Info
          size={19}
          className="mt-1 shrink-0 text-amber-700"
        />

        <p className="text-sm leading-7 text-amber-900">
          <strong>Client confirmation required:</strong>{" "}
          {children}
        </p>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
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
            <ShieldCheck
              size={27}
              className="text-[#78D6C9]"
            />

            <span className="text-sm font-bold uppercase tracking-widest text-[#78D6C9]">
              Legal & Privacy
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Information about how personal data is collected
            and used in connection with ViewForMe services.
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
                aria-label="Privacy policy sections"
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

          {/* POLICY */}
          <article className="min-w-0 space-y-10">
            <ReviewNotice>
              This policy must be checked against the
              business's actual data practices before
              publication. Do not remove the draft status
              until the outstanding details are resolved.
            </ReviewNotice>

            <PolicySection
              id="introduction"
              title="1. Introduction"
            >
              <p>
                ViewForMe provides a service through which
                customers can request visual property
                viewings and related property observations.
              </p>

              <p>
                This policy explains how personal
                information may be collected and used
                when you browse the website, make a
                booking request, contact the business,
                or apply to become a property viewer.
              </p>

              <p>
                The organisation responsible for
                deciding how and why personal data is
                processed is known as the data controller.
              </p>

              <ReviewNotice>
                Insert the full legal name, registered
                business address, and contact details
                of the actual data controller. Confirm
                whether any UK representative or data
                protection officer is required.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="information"
              title="2. Information We Collect"
            >
              <p>
                Depending on how you interact with
                ViewForMe, the information requested
                may include:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Your name, email address, and
                  telephone number.
                </li>
                <li>
                  Property addresses, locations,
                  and viewing requirements.
                </li>
                <li>
                  Preferred viewing dates and times.
                </li>
                <li>
                  Property representative contact
                  details and access instructions.
                </li>
                <li>
                  Messages and enquiries sent to
                  ViewForMe.
                </li>
                <li>
                  Viewer application information,
                  including location, availability,
                  experience, and travel arrangements.
                </li>
                <li>
                  Payment and transaction references
                  when payment processing is enabled.
                </li>
              </ul>

              <p>
                Information may also be received
                from property representatives or
                other people involved in arranging
                a viewing.
              </p>

              <ReviewNotice>
                Confirm all categories actually collected,
                including technical data such as IP
                addresses, logs, analytics identifiers,
                and any additional information obtained
                from third parties.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="purposes"
              title="3. How We Use Information"
            >
              <p>
                Personal information may be needed to:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Respond to enquiries and booking requests.
                </li>
                <li>
                  Arrange property access and appointments.
                </li>
                <li>
                  Communicate with customers, viewers,
                  and property representatives.
                </li>
                <li>
                  Deliver agreed photographs, videos,
                  and visual observations.
                </li>
                <li>
                  Process payments and maintain
                  transaction records.
                </li>
                <li>
                  Review viewer applications and
                  manage assignments.
                </li>
                <li>
                  Handle complaints and comply
                  with legal obligations.
                </li>
                <li>
                  Protect the website and investigate
                  suspected misuse.
                </li>
              </ul>

              <p>
                Information should only be used
                for purposes supported by an
                appropriate lawful basis.
              </p>
            </PolicySection>

            <PolicySection
              id="lawful-bases"
              title="4. Lawful Bases for Processing"
            >
              <p>
                UK data protection law requires an
                appropriate lawful basis for each
                purpose involving personal data.
              </p>

              <p>
                Depending on the activity, possible
                bases include:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Contract:</strong> Processing
                  necessary to provide a requested
                  service or take steps before entering
                  into a contract.
                </li>
                <li>
                  <strong>Legal obligation:</strong>{" "}
                  Processing required to comply with
                  applicable law.
                </li>
                <li>
                  <strong>Legitimate interests:</strong>{" "}
                  Processing necessary for a properly
                  assessed business interest that is
                  not overridden by individuals'
                  rights and interests.
                </li>
                <li>
                  <strong>Consent:</strong> Processing
                  for a specific purpose where valid
                  consent is required and obtained.
                </li>
              </ul>

              <ReviewNotice>
                Map each actual processing purpose to
                its lawful basis and document any
                legitimate interests assessment.
                Do not treat acknowledgement of a
                privacy policy as consent to all
                processing activities.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="sharing"
              title="5. Sharing Personal Information"
            >
              <p>
                Providing the service may require
                limited information to be shared
                with relevant parties, such as:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Assigned property viewers who need
                  details to carry out a visit.
                </li>
                <li>
                  Property agents, landlords, or
                  representatives involved in
                  arranging access.
                </li>
                <li>
                  Payment service providers,
                  where payments are enabled.
                </li>
                <li>
                  Website hosting, email, messaging,
                  and other technology providers.
                </li>
                <li>
                  Professional advisers or authorities
                  where legally necessary.
                </li>
              </ul>

              <p>
                Only information reasonably necessary
                for the relevant purpose should
                be shared.
              </p>

              <ReviewNotice>
                Confirm the actual recipients,
                service providers, and any data
                processing agreements required.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="transfers"
              title="6. International Data Transfers"
            >
              <p>
                Some service providers or authorised
                personnel may be located outside
                the United Kingdom.
              </p>

              <p>
                Where personal information is
                transferred internationally, the
                business must determine whether
                the transfer is restricted and,
                if so, ensure an appropriate legal
                transfer mechanism applies.
              </p>

              <ReviewNotice>
                Confirm where website data is hosted
                and which countries can access it.
                In particular, assess access by
                developers or administrators outside
                the UK, and document applicable
                transfer safeguards and how individuals
                can obtain information about them.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="retention"
              title="7. How Long We Keep Information"
            >
              <p>
                Personal information should be kept
                only for as long as necessary for
                the purpose for which it was collected,
                including applicable legal, accounting,
                and dispute-resolution requirements.
              </p>

              <ReviewNotice>
                Insert the actual retention periods
                or clearly defined retention criteria
                for booking records, enquiries,
                viewer applications, photographs,
                videos, access instructions, and
                financial records.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="security"
              title="8. Data Security"
            >
              <p>
                Appropriate technical and organisational
                safeguards should be used to protect
                personal information against
                unauthorised access, disclosure,
                alteration, or loss.
              </p>

              <p>
                Access to booking information and
                property documentation should be
                limited to people who need it
                for authorised business purposes.
              </p>

              <ReviewNotice>
                Verify actual security controls,
                including administrator access,
                encryption, backups, secure file
                sharing, and the handling of
                photographs or videos sent via
                messaging services.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="rights"
              title="9. Your Data Protection Rights"
            >
              <p>
                Depending on the circumstances,
                you may have rights to:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Access your personal information.</li>
                <li>Correct inaccurate information.</li>
                <li>Request deletion of information.</li>
                <li>Restrict certain processing.</li>
                <li>Object to certain processing.</li>
                <li>
                  Receive or transfer eligible
                  personal information.
                </li>
                <li>
                  Withdraw consent where processing
                  relies on consent.
                </li>
                <li>
                  Challenge qualifying solely automated
                  decisions, where applicable.
                </li>
              </ul>

              <p className="font-semibold text-[#17324D]">
                You have the right to object to
                processing based on legitimate interests,
                subject to applicable legal conditions.
              </p>

              <p>
                You can contact ViewForMe to make
                a request. Some rights are subject
                to legal limitations or exceptions.
              </p>
            </PolicySection>

            <PolicySection
              id="cookies"
              title="10. Cookies and Similar Technologies"
            >
              <p>
                The website may use cookies or
                similar technologies for essential
                functionality and, if introduced,
                analytics or other optional purposes.
              </p>

              <p>
                The types of technologies used,
                their purposes, and any available
                choices should be explained in
                the Cookie Policy.
              </p>

              <ReviewNotice>
                Audit actual cookies, analytics,
                embedded content, and third-party
                scripts before publishing the
                Cookie Policy.
              </ReviewNotice>
            </PolicySection>

            <PolicySection
              id="contact"
              title="11. Contact and Complaints"
            >
              <p>
                For privacy-related enquiries,
                contact ViewForMe:
              </p>

              <a
                href="mailto:viewforme@property.co.uk"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                <Mail size={18} />
                viewforme@property.co.uk
              </a>

              <p>
                You may also raise a complaint
                with the UK Information
                Commissioner's Office (ICO).
              </p>

              <a
                href="https://ico.org.uk/make-a-complaint/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                Visit the ICO website
                <ExternalLink size={16} />
              </a>

              <p>
                This policy should be reviewed
                whenever relevant data processing
                activities change.
              </p>
            </PolicySection>

            <div className="rounded-2xl bg-[#F0FAF8] p-6">
              <h2 className="text-lg font-bold text-[#17324D]">
                Questions About Your Privacy?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Contact ViewForMe for information
                about how your personal data
                is handled.
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center rounded-xl bg-[#2A9D8F] px-6 py-3 font-semibold text-white hover:bg-[#238579]"
              >
                Contact ViewForMe
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
