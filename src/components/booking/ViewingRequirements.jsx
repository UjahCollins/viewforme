
import { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  Info,
  Check,
} from "lucide-react";

const checklists = {
  residential: [
    "Overall property condition",
    "Living room and bedrooms",
    "Kitchen and bathroom",
    "Windows and doors",
    "Visible signs of damp or damage",
    "Floors, walls, and ceilings",
    "Outdoor spaces and surroundings",
    "Visible fixtures and fittings",
    "Parking and property access",
  ],

  commercial: [
    "Overall property condition",
    "Workspace or shop layout",
    "Doors, windows, and entrances",
    "Visible electrical fittings",
    "Visible plumbing facilities",
    "Toilets and shared facilities",
    "Parking and loading access",
    "Accessibility features",
    "Visible signs of damage",
  ],

  storage: [
    "Overall storage unit condition",
    "Approximate visible space and layout",
    "Doors and locking mechanisms",
    "Visible signs of damp or leaks",
    "Floor and wall condition",
    "Access routes",
    "Lighting and visible fittings",
    "Visible signs of pests or damage",
  ],

  construction: [
    "Overall visible site progress",
    "Exterior construction progress",
    "Interior construction progress",
    "Visible materials on site",
    "Doors and window installation",
    "Roofing progress where visible",
    "Visible finishing work",
    "Site access and surroundings",
    "Visible concerns or damage",
  ],
};

function ViewingRequirements({
  selectedService,
  formData,
  setFormData,
  handleChange,
  onBack,
  onNext,
}) {
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");

  const availableChecklist =
    checklists[selectedService] || checklists.residential;

  const selectedItems = formData.checklistItems || [];
  const customItems = formData.customChecklistItems || [];

  const toggleItem = (item) => {
    setFormData((previous) => ({
      ...previous,
      checklistItems: selectedItems.includes(item)
        ? selectedItems.filter((value) => value !== item)
        : [...selectedItems, item],
    }));

    setError("");
  };

  const addCustomItem = () => {
    const value = customInput.trim();

    if (!value) return;

    if (value.length > 150) {
      setError("Custom checklist items must be 150 characters or fewer.");
      return;
    }

    const exists = [...availableChecklist, ...customItems].some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setError("This checklist item already exists.");
      return;
    }

    if (customItems.length >= 10) {
      setError("You can add up to 10 custom checklist items.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      customChecklistItems: [
        ...previous.customChecklistItems,
        value,
      ],
    }));

    setCustomInput("");
    setError("");
  };

  const removeCustomItem = (item) => {
    setFormData((previous) => ({
      ...previous,
      customChecklistItems:
        previous.customChecklistItems.filter(
          (value) => value !== item
        ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      selectedItems.length === 0 &&
      customItems.length === 0 &&
      !formData.specialInstructions.trim()
    ) {
      setError(
        "Please select at least one checklist item or provide viewing instructions."
      );
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Heading */}
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <ClipboardCheck size={25} />
        </div>

        <h2 className="text-2xl font-bold text-[#17324D] sm:text-3xl">
          What Would You Like Us to Check?
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Choose the areas you'd like your viewer to focus on.
          You can also add your own questions and special instructions.
        </p>
      </div>

      {/* Standard checklist */}
      <div className="mt-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#17324D]">
            Viewing Checklist
          </h3>

          <span className="rounded-full bg-[#E8F6F3] px-3 py-1.5 text-xs font-semibold text-[#238579]">
            {selectedItems.length} selected
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {availableChecklist.map((item) => {
            const isSelected = selectedItems.includes(item);

            return (
              <label
                key={item}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-[#2A9D8F] bg-[#F0FAF8]"
                    : "border-slate-200 bg-white hover:border-teal-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItem(item)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#2A9D8F]"
                />

                <span className="text-sm font-medium leading-6 text-[#17324D]">
                  {item}
                </span>

                {isSelected && (
                  <Check
                    size={17}
                    className="ml-auto shrink-0 text-[#2A9D8F]"
                  />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Custom checklist */}
      <div className="mt-10 border-t border-slate-100 pt-8">
        <h3 className="text-lg font-bold text-[#17324D]">
          Add Your Own Questions
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Is there something specific you'd like the viewer
          to look at? Add it to your checklist.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={customInput}
            onChange={(event) =>
              setCustomInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomItem();
              }
            }}
            maxLength={150}
            placeholder="e.g. Check visible condition of kitchen cabinets"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />

          <button
            type="button"
            onClick={addCustomItem}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17324D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#244662]"
          >
            <Plus size={19} />
            Add Item
          </button>
        </div>

        {customItems.length > 0 && (
          <div className="mt-5 space-y-3">
            {customItems.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between gap-3 rounded-xl border border-teal-100 bg-[#F0FAF8] px-4 py-3"
              >
                <span className="text-sm text-[#17324D]">
                  {item}
                </span>

                <button
                  type="button"
                  onClick={() => removeCustomItem(item)}
                  aria-label={`Remove ${item}`}
                  className="shrink-0 text-slate-500 transition hover:text-red-600"
                >
                  <X size={19} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-slate-500">
          {customItems.length} of 10 custom items added
        </p>
      </div>

      {/* Special instructions */}
      <div className="mt-9">
        <label
          htmlFor="specialInstructions"
          className="mb-2 block text-sm font-semibold text-[#17324D]"
        >
          Additional Viewing Instructions
          <span className="ml-2 text-xs font-normal text-slate-400">
            Optional
          </span>
        </label>

        <textarea
          id="specialInstructions"
          name="specialInstructions"
          rows={5}
          value={formData.specialInstructions}
          onChange={handleChange}
          maxLength={2000}
          placeholder="Tell us anything else you'd like your viewer to know. For example, please take detailed photos of the kitchen, bathroom, and garden."
          className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {/* Scope notice */}
      <div className="mt-7 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-sm leading-6 text-blue-900">
          ViewForMe provides visual observations only.
          Viewers cannot perform technical testing, professional
          surveys, valuations, legal checks, or safety inspections.
          Custom requests are subject to review and approval.
        </p>
      </div>

      {/* Error */}
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
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

export default ViewingRequirements;
