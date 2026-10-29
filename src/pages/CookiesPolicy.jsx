
import { Link } from "react-router-dom";

import {
  Cookie,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  BarChart3,
  Megaphone,
  ExternalLink,
  Info,
  Mail,
} from "lucide-react";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "what-are-cookies", title: "What Are Cookies?" },
  { id: "types", title: "Types of Cookies" },
  { id: "current-use", title: "Current Website Technologies" },
  { id: "third-parties", title: "Third-Party Services" },
  { id: "consent", title: "Consent & Preferences" },
  { id: "browser", title: "Browser Controls" },
  { id: "updates", title: "Policy Updates" },
  { id: "contact", title: "Contact Us" },
];

const cookieCategories = [
  {
    icon: ShieldCheck,
    title: "Strictly Necessary",
    description:
      "Technologies that are genuinely required to provide a service requested by the visitor or enable essential website functions.",
    consent: "May be exempt from consent",
  },
  {
    icon: SlidersHorizontal,
    title: "Functional",
    description:
      "Technologies used to remember optional settings or provide additional functionality.",
    consent: "Assess based on actual purpose",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Technologies used to measure website traffic, interactions, and visitor behaviour.",
    consent: "Generally requires consent",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description:
      "Technologies used for advertising, profiling, or tracking visitors across websites.",
    consent: "Generally requires consent",
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

function CookiePolicy() {
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
            <Cookie
              size={27}
              className="text-[#78D6C9]"
            />

            <span className="text-sm font-bold uppercase tracking-widest text-[#78D6C9]">
              Website Policies
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white sm:text-5xl">
            Cookie Policy
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Information about cookies, similar
            technologies, and how visitors
            can manage their preferences.
          </p>

          <p className="mt-6 text-sm text-slate-300">
            Status: Draft — pending website audit
          </p>
        </div>
      </section>

      {/* COOKIE CATEGORY CARDS */}
      <section className="bg-[#F6F9FA] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cookieCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={24} />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-[#17324D]">
                    {category.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {category.description}
                  </p>

                  <p className="mt-5 text-xs font-semibold text-[#2A9D8F]">
                    {category.consent}
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
          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-[#F6F9FA] p-6">
              <h2 className="font-bold text-[#17324D]">
                On This Page
              </h2>

              <nav
                aria-label="Cookie policy sections"
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

          {/* CONTENT */}
          <article className="min-w-0 space-y-10">
            <ReviewNotice>
              This policy is a draft. The final
              version must reflect the actual
              cookies and similar technologies
              used by the deployed website.
            </ReviewNotice>

            {/* INTRODUCTION */}
            <PolicySection
              id="introduction"
              title="1. Introduction"
            >
              <p>
                This Cookie Policy explains
                how cookies and similar
                technologies may be used
                in connection with the
                ViewForMe website.
              </p>

              <p>
                It should be read alongside
                the{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-[#2A9D8F] underline"
                >
                  Privacy Policy
                </Link>
                , which provides further
                information about personal
                data processing.
              </p>
            </PolicySection>

            {/* WHAT ARE COOKIES */}
            <PolicySection
              id="what-are-cookies"
              title="2. What Are Cookies?"
            >
              <p>
                Cookies are small data
                files that websites may
                store on a visitor's
                device through a browser.
              </p>

              <p>
                Cookies can support
                functions such as
                remembering preferences,
                maintaining sessions,
                and measuring website
                usage.
              </p>

              <p>
                Similar technologies,
                including browser storage,
                may also store or access
                information on a device.
              </p>

              <p>
                The applicable rules
                depend on what a
                technology does and
                whether an exemption
                applies.
              </p>
            </PolicySection>

            {/* TYPES */}
            <PolicySection
              id="types"
              title="3. Types of Cookies and Similar Technologies"
            >
              <p>
                Websites may use
                different categories
                of technologies:
              </p>

              <ul className="list-disc space-y-3 pl-6">
                <li>
                  <strong>Strictly necessary:</strong>{" "}
                  Technologies needed for
                  essential functions or
                  services explicitly
                  requested by visitors.
                </li>

                <li>
                  <strong>Functional:</strong>{" "}
                  Technologies that remember
                  optional preferences or
                  support additional features.
                </li>

                <li>
                  <strong>Analytics:</strong>{" "}
                  Technologies that help
                  website operators understand
                  usage and performance.
                </li>

                <li>
                  <strong>Marketing:</strong>{" "}
                  Technologies used for
                  advertising, profiling,
                  or cross-site tracking.
                </li>
              </ul>

              <p>
                These categories describe
                possible technologies;
                they do not mean that
                ViewForMe currently uses
                every category.
              </p>
            </PolicySection>

            {/* CURRENT USE */}
            <PolicySection
              id="current-use"
              title="4. Technologies Used by This Website"
            >
              <p>
                The final cookie inventory
                will identify the technologies
                used by the live website.
              </p>

              <p>
                For each relevant technology,
                the inventory should include
                its name, provider, purpose,
                duration, and whether
                consent is required.
              </p>

              <ReviewNotice>
                Audit the deployed website
                and complete the cookie
                inventory before launch.
                Do not claim that analytics,
                marketing cookies, or
                payment-related cookies
                are active unless confirmed.
              </ReviewNotice>
            </PolicySection>

            {/* THIRD PARTIES */}
            <PolicySection
              id="third-parties"
              title="5. Third-Party Technologies"
            >
              <p>
                Third-party services may
                introduce cookies or
                similar technologies.
              </p>

              <p>
                For example, an online
                payment provider, embedded
                media service, or analytics
                provider may use technologies
                associated with its service.
              </p>

              <p>
                ViewForMe should review
                these technologies before
                introducing third-party
                integrations.
              </p>

              <ReviewNotice>
                Confirm which external
                providers are active,
                including the final
                payment integration,
                analytics services,
                and embedded content.
              </ReviewNotice>
            </PolicySection>

            {/* CONSENT */}
            <PolicySection
              id="consent"
              title="6. Consent and Cookie Preferences"
            >
              <p>
                Where consent is required,
                optional technologies
                should not be activated
                before valid consent
                has been obtained.
              </p>

              <p>
                Visitors should receive
                clear information about
                their choices and be able
                to reject non-essential
                technologies as easily
                as they can accept them.
              </p>

              <p>
                Where consent-based
                technologies are used,
                visitors should also
                have an accessible way
                to withdraw or change
                their preferences.
              </p>

              <ReviewNotice>
                If optional cookies or
                similar technologies are
                introduced, implement
                consent management and
                a working preference
                control before enabling
                those technologies.
              </ReviewNotice>
            </PolicySection>

            {/* BROWSER */}
            <PolicySection
              id="browser"
              title="7. Browser Controls"
            >
              <p>
                Most browsers provide
                settings for reviewing,
                blocking, or deleting
                cookies.
              </p>

              <p>
                These settings vary
                between browsers and
                devices.
              </p>

              <p>
                Blocking technologies
                required for certain
                website functions may
                affect how those
                functions operate.
              </p>

              <p>
                Browser controls are
                not a replacement for
                obtaining valid consent
                where consent is
                legally required.
              </p>
            </PolicySection>

            {/* UPDATES */}
            <PolicySection
              id="updates"
              title="8. Updates to This Policy"
            >
              <p>
                This policy should be
                reviewed when website
                technologies, service
                providers, or relevant
                legal requirements change.
              </p>

              <p>
                The published version
                should identify its
                effective or last
                updated date.
              </p>

              <ReviewNotice>
                Insert the approved
                publication date after
                the cookie audit and
                legal review are complete.
              </ReviewNotice>
            </PolicySection>

            {/* CONTACT */}
            <PolicySection
              id="contact"
              title="9. Contact Us"
            >
              <p>
                For questions about
                cookies or privacy
                practices, contact
                ViewForMe:
              </p>

              <a
                href="mailto:support@viewforme.org"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                <Mail size={18} />
                support@viewforme.org
              </a>

              <p>
                You can also find
                information about
                UK data protection
                and cookie rules
                from the Information
                Commissioner's Office.
              </p>

              <a
                href="https://ico.org.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[#2A9D8F] hover:underline"
              >
                Visit the ICO Website
                <ExternalLink size={16} />
              </a>
            </PolicySection>

            {/* FINAL CTA */}
            <div className="rounded-2xl bg-[#F0FAF8] p-7">
              <h2 className="text-xl font-bold text-[#17324D]">
                Have Questions About Your Privacy?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Contact ViewForMe for
                further information about
                the website's privacy
                practices.
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

export default CookiePolicy;
