
import {
  MapPin,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import FormField from "./FormField.jsx";

const propertyTypes = [
  "Detached House",
  "Semi-Detached House",
  "Terraced House",
  "Apartment / Flat",
  "Office",
  "Retail / Shop",
  "Warehouse",
  "Storage Unit",
  "Construction Site",
  "Other",
];

function PropertyDetails({
  formData,
  handleChange,
  onBack,
  onNext,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Heading */}
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <MapPin size={25} />
        </div>

        <h2 className="text-2xl font-bold text-[#17324D] sm:text-3xl">
          Tell Us About the Property
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Provide the property location and any useful information
          that will help us arrange your viewing.
        </p>
      </div>

      {/* Form fields */}
      <div className="mt-9 space-y-6">
        <FormField
          label="Property Address"
          name="propertyAddress"
          value={formData.propertyAddress}
          onChange={handleChange}
          placeholder="Street address and building number"
          required
          maxLength={200}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Town / City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Belfast"
            required
            maxLength={100}
          />

          <FormField
            label="Postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="e.g. BT1 1AA"
            required
            maxLength={10}
          />
        </div>

        {/* Property type */}
        <div>
          <label
            htmlFor="propertyType"
            className="mb-2 block text-sm font-semibold text-[#17324D]"
          >
            Property Type
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Select property type</option>

            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Access instructions */}
        <div>
          <label
            htmlFor="accessInstructions"
            className="mb-2 block text-sm font-semibold text-[#17324D]"
          >
            Property Access / Agent Information
            <span className="ml-2 text-xs font-normal text-slate-400">
              Optional
            </span>
          </label>

          <textarea
            id="accessInstructions"
            name="accessInstructions"
            rows={4}
            value={formData.accessInstructions}
            onChange={handleChange}
            maxLength={1000}
            placeholder="Provide any helpful information about accessing the property, such as an estate agent's name, viewing reference, or access arrangements."
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition placeholder:text-slate-400 focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Do not include keys, alarm codes, or other sensitive
            access credentials.
          </p>
        </div>

        {/* Information notice */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <Info
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <p className="text-sm leading-6 text-blue-900">
            Please ensure the property address is accurate.
            Viewing appointments are subject to property access
            arrangements and local viewer availability.
          </p>
        </div>
      </div>

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
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

export default PropertyDetails;
