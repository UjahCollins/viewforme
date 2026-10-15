
import { useState } from "react";
import {
  UserRound,
  Building2,
  MessageCircle,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import FormField from "./FormField.jsx";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

function CustomerDetails({
  formData,
  handleChange,
  onBack,
  onNext,
}) {
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please complete all required customer details.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\+?[0-9()\s-]{7,25}$/.test(formData.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!formData.privacyConsent) {
      setError("Please acknowledge the privacy notice.");
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Customer information */}
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <UserRound size={25} />
        </div>

        <h2 className="text-2xl font-bold text-[#17324D] sm:text-3xl">
          How Can We Reach You?
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Provide your contact details so we can communicate
          about your viewing request and arrange the next steps.
        </p>
      </div>

      <div className="mt-9 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
            maxLength={80}
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
            maxLength={80}
          />
        </div>

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          maxLength={254}
          helpText="We'll use this for booking updates and receipts."
        />

        <FormField
          label="WhatsApp / Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+44 7700 900000"
          required
          maxLength={25}
          helpText="Include your country code if you're outside the UK."
        />
      </div>

      {/* Property contact */}
      <div className="mt-10 border-t border-slate-100 pt-8">
        <div className="flex items-center gap-3">
          <Building2 size={22} className="text-[#2A9D8F]" />

          <h3 className="text-xl font-bold text-[#17324D]">
            Property Contact Details
          </h3>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          If the property is managed by an estate agent,
          landlord, or another representative, please provide
          their details so we can arrange access.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="propertyContactType"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Contact Type
            </label>

            <select
              id="propertyContactType"
              name="propertyContactType"
              value={formData.propertyContactType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select contact type</option>
              <option value="estate-agent">Estate Agent</option>
              <option value="landlord">Landlord</option>
              <option value="property-owner">Property Owner</option>
              <option value="site-manager">Site Manager</option>
              <option value="other">Other Representative</option>
              <option value="unknown">Not Yet Known</option>
            </select>
          </div>

          <FormField
            label="Contact Name / Agency"
            name="propertyContactName"
            value={formData.propertyContactName}
            onChange={handleChange}
            placeholder="Name of agent, landlord, or company"
            maxLength={150}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Contact Phone"
              name="propertyContactPhone"
              type="tel"
              value={formData.propertyContactPhone}
              onChange={handleChange}
              placeholder="+44..."
              maxLength={25}
            />

            <FormField
              label="Contact Email"
              name="propertyContactEmail"
              type="email"
              value={formData.propertyContactEmail}
              onChange={handleChange}
              placeholder="agent@example.com"
              maxLength={254}
            />
          </div>
        </div>
      </div>

      {/* Communication preference */}
      <div className="mt-10 border-t border-slate-100 pt-8">
        <div className="flex items-center gap-3">
          <MessageCircle size={22} className="text-[#2A9D8F]" />

          <h3 className="text-xl font-bold text-[#17324D]">
            Communication Preferences
          </h3>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          How would you prefer us to contact you
          about your booking?
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { value: "whatsapp", label: "WhatsApp" },
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone Call" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                formData.contactPreference === option.value
                  ? "border-[#2A9D8F] bg-[#F0FAF8]"
                  : "border-slate-200 hover:border-teal-200"
              }`}
            >
              <input
                type="radio"
                name="contactPreference"
                value={option.value}
                checked={
                  formData.contactPreference === option.value
                }
                onChange={handleChange}
                className="accent-[#2A9D8F]"
              />

              <span className="text-sm font-medium text-[#17324D]">
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {formData.contactPreference === "whatsapp" && (
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Please ensure the phone number provided is
            registered on WhatsApp.
          </p>
        )}
      </div>

      {/* Privacy acknowledgement */}
      <div className="mt-9 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="privacyConsent"
            checked={formData.privacyConsent}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[#2A9D8F]"
          />

          <span className="text-sm leading-7 text-slate-700">
            I understand that ViewForMe will use the contact
            and property information I provide to process
            and communicate about my viewing request.
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

      {/* Information notice */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-sm leading-6 text-blue-900">
          Providing an estate agent or landlord's contact
          information helps us coordinate access. A viewing
          request is not a confirmed appointment until
          arrangements have been approved.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-100 pt-7">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#17324D]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3.5 font-semibold text-white transition hover:bg-[#238579]"
        >
          Review Booking
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

export default CustomerDetails;
