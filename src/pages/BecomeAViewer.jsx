
import { useState } from "react";

import {
  UserRound,
  MapPin,
  Camera,
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Send,
  Info,
  ShieldCheck,
  Smartphone,
  CarFront,
} from "lucide-react";
import { submitViewerApplication } from "../services/viewerApplicationApi.js";

const responsibilities = [
  {
    icon: MapPin,
    title: "Visit Assigned Properties",
    description:
      "Attend approved property viewing appointments in locations you have agreed to cover.",
  },
  {
    icon: Camera,
    title: "Capture Visual Information",
    description:
      "Take photographs and videos of accessible areas according to the agreed viewing instructions.",
  },
  {
    icon: ClipboardCheck,
    title: "Share Clear Observations",
    description:
      "Provide factual notes about what you observed during the visit without making unsupported assessments.",
  },
];

const expectations = [
  "Be based in Northern Ireland or able to attend assignments there.",
  "Communicate clearly and professionally.",
  "Have access to a smartphone capable of taking clear photos and videos.",
  "Be punctual and reliable when accepting appointments.",
  "Respect property access rules, privacy, and confidentiality.",
  "Follow the viewing instructions and agreed service scope.",
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  coverageAreas: "",
  availability: "",
  transport: "",
  experience: "",
  motivation: "",
  consent: false,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition placeholder:text-slate-400 focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

function BecomeViewer() {
 const [formData, setFormData] = useState(initialForm);
const [formError, setFormError] = useState("");
const [formSuccess, setFormSuccess] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
  };

  
const handleSubmit = async (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  setFormError("");
  setFormSuccess("");

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "coverageAreas",
    "availability",
  ];

  const hasMissingField = requiredFields.some(
    (field) => !formData[field].trim()
  );

  if (hasMissingField) {
    setFormError("Please complete all required fields.");
    return;
  }

  const email = formData.email.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFormError("Please enter a valid email address.");
    return;
  }

  const phone = formData.phone.trim();

  if (!/^\+?[0-9()\s-]{7,25}$/.test(phone)) {
    setFormError("Please enter a valid phone number.");
    return;
  }

  if (!formData.consent) {
    setFormError(
      "Please acknowledge the privacy notice before continuing."
    );
    return;
  }

  const coverageAreas = formData.coverageAreas
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);

  if (
    coverageAreas.length === 0 ||
    coverageAreas.length > 20 ||
    coverageAreas.some(
      (area) => area.length < 2 || area.length > 100
    )
  ) {
    setFormError(
      "Please provide between 1 and 20 valid coverage areas."
    );
    return;
  }

  const payload = {
    fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
    email,
    phone,
    city: formData.city.trim(),
    coverageAreas,
    availability: formData.availability,
    ...(formData.transport && {
      transport: formData.transport,
    }),
    experience: formData.experience.trim(),
    motivation: formData.motivation.trim(),
    consent: true,
  };

  try {
    setIsSubmitting(true);

    const response = await submitViewerApplication(payload);

    if (response.success) {
      setFormSuccess(
        response.message ||
          "Your application has been submitted successfully."
      );

      setFormData({ ...initialForm });
    } else {
      setFormError(
        response.message || "Unable to submit your application."
      );
    }
  } catch (error) {
    setFormError(
      error.message ||
        "Unable to submit your application. Please try again."
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
            Join ViewForMe
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Become a Local
            <span className="block text-[#78D6C9]">
              Property Viewer.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Help people explore properties remotely by
            carrying out arranged visual visits and
            sharing useful property information.
          </p>

          <a
            href="#viewer-application"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-4 font-semibold text-white transition hover:bg-[#238579]"
          >
            Apply to Become a Viewer
            <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* ROLE INTRODUCTION */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              The Opportunity
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#17324D] sm:text-4xl">
              Help Someone See a Property
              They Can't Visit.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              Many people are interested in properties
              they cannot easily visit themselves.
              They may be relocating, living abroad,
              managing a business, or simply unable
              to attend an appointment.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-600">
              ViewForMe is designed to connect these
              customers with suitable local viewers
              who can attend arranged appointments,
              document accessible areas, and share
              factual visual observations.
            </p>

            <div className="mt-7 rounded-xl bg-[#F0FAF8] p-5">
              <p className="text-sm font-medium leading-7 text-[#226E66]">
                Viewer assignments are arranged individually.
                Acceptance into the viewer network does not
                guarantee regular assignments or earnings.
              </p>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85"
              alt="Property viewing discussion"
              loading="lazy"
              className="h-[350px] w-full rounded-[2rem] object-cover sm:h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* RESPONSIBILITIES */}
      <section className="bg-[#F6F9FA] px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Your Responsibilities
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              What Does a Property Viewer Do?
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Your role is to provide reliable visual
              information from approved property visits.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {responsibilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#17324D]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPECTATIONS */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Who Can Apply?
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              What We're Looking For
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              You don't necessarily need to be a property
              professional to express interest. However,
              applicants should be reliable, observant,
              and comfortable documenting property visits.
            </p>

            <ul className="mt-8 space-y-4">
              {expectations.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0 text-[#2A9D8F]"
                  />

                  <span className="text-sm leading-7 text-slate-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Smartphone, title: "Smartphone" },
              { icon: MapPin, title: "Local Knowledge" },
              { icon: Clock3, title: "Availability" },
              { icon: CarFront, title: "Travel Access" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-[#F0FAF8] p-6 text-center"
                >
                  <Icon
                    size={32}
                    className="text-[#2A9D8F]"
                  />

                  <h3 className="mt-5 text-sm font-bold text-[#17324D]">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        id="viewer-application"
        className="scroll-mt-24 bg-[#F6F9FA] px-5 py-20 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              Viewer Registration
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              Apply to Join ViewForMe
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Complete the application below to tell us
              about yourself and your availability.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-12 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-10"
          >
            {/* PERSONAL DETAILS */}
            <div className="flex items-center gap-3">
              <UserRound
                size={23}
                className="text-[#2A9D8F]"
              />

              <h3 className="text-xl font-bold text-[#17324D]">
                Personal Information
              </h3>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  First Name *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  placeholder="First name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Last Name *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Email Address *
                </label>

                <input
                  id="email"
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

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Phone Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={25}
                  placeholder="+44..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* LOCATION */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3">
                <MapPin
                  size={23}
                  className="text-[#2A9D8F]"
                />

                <h3 className="text-xl font-bold text-[#17324D]">
                  Location & Coverage
                </h3>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Primary Town / City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="e.g. Belfast"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="coverageAreas"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Areas You Can Cover *
                  </label>

                  <input
                    id="coverageAreas"
                    name="coverageAreas"
                    value={formData.coverageAreas}
                    onChange={handleChange}
                    required
                    maxLength={250}
                    placeholder="e.g. Belfast, Lisburn"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3">
                <Clock3
                  size={23}
                  className="text-[#2A9D8F]"
                />

                <h3 className="text-xl font-bold text-[#17324D]">
                  Availability & Experience
                </h3>
              </div>

              <div className="mt-7 space-y-6">
                <div>
                  <label
                    htmlFor="availability"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    General Availability *
                  </label>

                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">
                      Select your availability
                    </option>
                    <option value="weekdays">
                      Weekdays
                    </option>
                    <option value="weekends">
                      Weekends
                    </option>
                    <option value="both">
                      Weekdays and Weekends
                    </option>
                    <option value="flexible">
                      Flexible / Varies
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="transport"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Travel Arrangements
                  </label>

                  <select
                    id="transport"
                    name="transport"
                    value={formData.transport}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">
                      Select an option
                    </option>
                    <option value="own-vehicle">
                      Own Vehicle
                    </option>
                    <option value="public-transport">
                      Public Transport
                    </option>
                    <option value="walking-cycling">
                      Walking / Cycling
                    </option>
                    <option value="other">
                      Other Arrangements
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Relevant Experience
                  </label>

                  <textarea
                    id="experience"
                    name="experience"
                    rows={4}
                    value={formData.experience}
                    onChange={handleChange}
                    maxLength={1500}
                    placeholder="Tell us about any experience with property viewings, photography, inspections, customer service, or similar work."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="motivation"
                    className="mb-2 block text-sm font-semibold text-[#17324D]"
                  >
                    Why Would You Like to Join?
                  </label>

                  <textarea
                    id="motivation"
                    name="motivation"
                    rows={4}
                    value={formData.motivation}
                    onChange={handleChange}
                    maxLength={1500}
                    placeholder="Briefly tell us why you're interested in becoming a ViewForMe viewer."
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>
            </div>

            {/* PRIVACY */}
            <div className="mt-9 rounded-xl border border-slate-200 bg-slate-50 p-5">
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
                  the information I provide to review
                  and communicate about my application.
                  I have read the{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2A9D8F] underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* NOTICE */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-sm leading-6 text-blue-900">
                Applications are reviewed individually.
                Submitting an application does not guarantee
                approval, employment, or paid assignments.
                Any assignment terms will be agreed separately.
              </p>
            </div>

            {formError && (
              <p
                role="alert"
                className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
              >
                {formError}
              </p>
            )}

            {formSuccess && (
  <div
    role="status"
    className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
  >
    <CheckCircle2 size={20} className="shrink-0" />
    <p>{formSuccess}</p>
  </div>
)}

            <button
  type="submit"
  disabled={isSubmitting}
  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-4 font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-60"
>
  <Send size={19} />
  {isSubmitting ? "Submitting Application..." : "Submit Application"}
</button>

            <p className="mt-4 text-center text-xs leading-6 text-slate-500">
              Complete and submit the online application form with your personal details, coverage areas, and availability.
            </p>
          </form>
        </div>
      </section>

      {/* APPLICATION PROCESS */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#2A9D8F]">
              What Happens Next?
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#17324D] sm:text-4xl">
              The Application Process
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Submit Your Details",
                description:
                  "Complete the application form when online submissions are available.",
              },
              {
                number: "02",
                title: "Application Review",
                description:
                  "The ViewForMe team reviews your location, availability, and suitability.",
              },
              {
                number: "03",
                title: "Next Steps",
                description:
                  "Suitable applicants may be contacted for further discussion and onboarding.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 p-7"
              >
                <span className="text-4xl font-extrabold text-[#2A9D8F]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-[#17324D]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL NOTICE */}
      <section className="bg-[#17324D] px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 sm:flex-row">
          <ShieldCheck
            size={30}
            className="shrink-0 text-[#78D6C9]"
          />

          <div>
            <h2 className="text-xl font-bold text-white">
              Professionalism and Property Respect
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Viewers must respect property access arrangements,
              confidentiality, and the agreed viewing scope.
              They must not carry out technical inspections
              or make professional assessments unless separately
              qualified and expressly authorised to do so.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BecomeViewer;
