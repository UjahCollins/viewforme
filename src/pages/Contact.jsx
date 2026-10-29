
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  ArrowRight,
  HelpCircle,
  CalendarDays,
  UserRound,
  Info,
  Clock3,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { submitEnquiry } from "../services/enquiryApi.js";

// INITIAL FORM STATE
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  enquiryType: "",
  subject: "",
  message: "",
  consent: false,
};

// INPUT STYLING
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition placeholder:text-slate-400 focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

// CONTACT METHODS
const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general enquiries and customer support.",
    value: "support@viewforme.org",
    href: "mailto:support@viewforme.org",
    action: "Send an Email",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team about your enquiry.",
    value: "+44 7760 981224",
    href: "tel:+447760981224",
    action: "Call ViewForMe",
  },
  {
    icon: MapPin,
    title: "Where We Operate",
    description: "Property viewing services in eligible areas.",
    value: "Northern Ireland, United Kingdom",
    href: null,
    action: null,
  },
];

// ENQUIRY TYPES
const enquiryOptions = [
  { value: "general", label: "General Enquiry" },
  { value: "booking", label: "New Booking Enquiry" },
  { value: "existing-booking", label: "Existing Booking" },
  { value: "property-agent", label: "Property Agent / Landlord" },
  { value: "viewer", label: "Become a Viewer" },
  { value: "partnership", label: "Business Partnership" },
  { value: "complaint", label: "Feedback or Complaint" },
  { value: "other", label: "Other" },
];

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLE INPUT CHANGES
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
    setFormSuccess("");
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setFormError("");
    setFormSuccess("");

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "enquiryType",
      "subject",
      "message",
    ];

    const hasMissingField = requiredFields.some(
      (field) => !String(formData[field] || "").trim()
    );

    if (hasMissingField) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (
      formData.phone.trim() &&
      !/^\+?[0-9()\s-]{7,25}$/.test(
        formData.phone.trim()
      )
    ) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    if (formData.message.trim().length < 10) {
      setFormError(
        "Your message must contain at least 10 characters."
      );
      return;
    }

    if (!formData.consent) {
      setFormError(
        "Please acknowledge the privacy notice."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await submitEnquiry({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        enquiryType: formData.enquiryType,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        consent: formData.consent,
      });

      if (response?.success !== true) {
        throw new Error(
          response?.message ||
            "Unable to submit your enquiry."
        );
      }

      setFormSuccess(
        response.message ||
          "Your enquiry has been submitted successfully. Our team will get back to you."
      );

      setFormData({ ...initialForm });
    } catch (error) {
      console.error("ENQUIRY SUBMISSION ERROR:", error);

      setFormError(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#78D6C9]">
            Contact ViewForMe
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            We're Here
            <span className="block text-[#78D6C9]">
              to Help.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Have a question about a viewing, an existing
            booking request, or working with ViewForMe?
            Get in touch with our team.
          </p>

          <a
            href="#contact-form"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Send an Enquiry
            <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Get in Touch
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Choose How to Reach Us
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Contact ViewForMe through one of the
              options below.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {contactMethods.map((method) => {
              const Icon = method.icon;

              return (
                <div
                  key={method.title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-teal-200 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#17324D]">
                    {method.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {method.description}
                  </p>

                  <p className="mt-4 break-words text-sm font-semibold text-[#17324D]">
                    {method.value}
                  </p>

                  {method.href && (
                    <a
                      href={method.href}
                      className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#2A9D8F] transition hover:text-[#238579]"
                    >
                      {method.action}
                      <ArrowRight size={17} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact-form"
        className="scroll-mt-24 bg-[#F6F9FA] px-5 py-20 lg:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* LEFT CONTENT */}
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Send a Message
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#17324D] sm:text-4xl">
              Tell Us How We Can Help.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Whether you're enquiring about a property
              viewing, need assistance with an existing
              request, or have a business-related question,
              we'd like to hear from you.
            </p>

            <div className="mt-9 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2A9D8F]">
                  <HelpCircle size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#17324D]">
                    General Enquiries
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Ask about our services, viewing coverage,
                    or how the booking process works.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2A9D8F]">
                  <CalendarDays size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#17324D]">
                    Booking Assistance
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Get help with an existing request,
                    scheduling, or viewing requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2A9D8F]">
                  <UserRound size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#17324D]">
                    Viewer & Partnership Enquiries
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Interested in becoming a viewer
                    or working with ViewForMe?
                    Contact our team.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-start gap-3 rounded-xl border border-teal-100 bg-[#E8F6F3] p-5">
              <Clock3
                size={21}
                className="mt-0.5 shrink-0 text-[#2A9D8F]"
              />

              <p className="text-sm leading-7 text-[#226E66]">
                Our team reviews enquiries and responds
                as availability permits. Please avoid
                including passwords, payment card details,
                or other sensitive information in your message.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-9"
          >
            <div className="flex items-center gap-3">
              <MessageCircle
                size={25}
                className="text-[#2A9D8F]"
              />

              <h3 className="text-2xl font-bold text-[#17324D]">
                Send Us a Message
              </h3>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Complete the fields below to send your
              enquiry directly to our team.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {/* FIRST NAME */}
              <div>
                <label
                  htmlFor="contact-first-name"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  First Name *
                </label>

                <input
                  id="contact-first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  placeholder="First name"
                  className={inputClass}
                />
              </div>

              {/* LAST NAME */}
              <div>
                <label
                  htmlFor="contact-last-name"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Last Name *
                </label>

                <input
                  id="contact-last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Email Address *
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Phone Number
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={25}
                  placeholder="+44..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* ENQUIRY TYPE */}
            <div className="mt-6">
              <label
                htmlFor="contact-enquiry-type"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Enquiry Type *
              </label>

              <select
                id="contact-enquiry-type"
                name="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">
                  Select an enquiry type
                </option>

                {enquiryOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}
            <div className="mt-6">
              <label
                htmlFor="contact-subject"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Subject *
              </label>

              <input
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="What is your enquiry about?"
                className={inputClass}
              />
            </div>

            {/* MESSAGE */}
            <div className="mt-6">
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Your Message *
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={3000}
                placeholder="Tell us how we can help..."
                className={`${inputClass} resize-y`}
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {formData.message.length}/3000 characters
              </p>
            </div>

            {/* CONSENT */}
            <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-[#2A9D8F]"
                />

                <span className="text-sm leading-7 text-slate-700">
                  I understand that ViewForMe will use
                  my information to respond to my enquiry,
                  as explained in the{" "}
                  <Link
                    to="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2A9D8F] underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* ERROR MESSAGE */}
            {formError && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
              >
                <Info
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-sm leading-6 text-amber-800">
                  {formError}
                </p>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {formSuccess && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4"
              >
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-[#2A9D8F]"
                />

                <p className="text-sm font-medium leading-6 text-teal-800">
                  {formSuccess}
                </p>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-4 font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <Send size={19} />
              )}

              {isSubmitting
                ? "Sending Message..."
                : "Send Message"}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-slate-500">
              Your enquiry will be sent securely to our
              team for review.
            </p>
          </form>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Helpful Links
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Looking for Something Specific?
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                title: "Book a Viewing",
                description:
                  "Request a property viewing using our booking form.",
                href: "/book",
                action: "Start Booking",
              },
              {
                icon: HelpCircle,
                title: "How It Works",
                description:
                  "Learn about our booking and viewing process.",
                href: "/how-it-works",
                action: "Learn More",
              },
              {
                icon: UserRound,
                title: "Become a Viewer",
                description:
                  "Learn about applying to join our local viewer network.",
                href: "/become-a-viewer",
                action: "View Opportunity",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group rounded-2xl border border-slate-200 p-7 transition hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#17324D]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2A9D8F]">
                    {item.action}

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#17324D] px-5 py-20 text-center lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#78D6C9]">
            ViewForMe
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Your Eyes on
            <span className="block text-[#78D6C9]">
              the Property.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200">
            Need someone to visit a property on your behalf?
            Start by telling us about the property
            and your viewing requirements.
          </p>

          <Link
            to="/book"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Book a Viewing
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Contact;
