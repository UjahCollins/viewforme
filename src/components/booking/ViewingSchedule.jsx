
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const timeSlots = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
];

// Get today's date using local calendar values.
// Avoid toISOString(), which uses UTC.
function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function ViewingSchedule({
  formData,
  handleChange,
  onBack,
  onNext,
}) {
  const [error, setError] = useState("");

  const today = getToday();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.preferredDate || !formData.preferredTime) {
      setError("Please select your preferred viewing date and time.");
      return;
    }

    if (formData.preferredDate < today) {
      setError("Please choose a date that is not in the past.");
      return;
    }

    if (
      formData.alternativeDate &&
      formData.alternativeDate < today
    ) {
      setError("Your alternative date cannot be in the past.");
      return;
    }

    if (
      formData.alternativeDate &&
      !formData.alternativeTime
    ) {
      setError("Please choose a time for your alternative date.");
      return;
    }

    if (
      formData.alternativeTime &&
      !formData.alternativeDate
    ) {
      setError("Please choose a date for your alternative time.");
      return;
    }

    // Validate the preferred appointment in local time.
    const preferred = new Date(
      `${formData.preferredDate}T${formData.preferredTime}:00`
    );

    if (
      Number.isNaN(preferred.getTime()) ||
      preferred <= new Date()
    ) {
      setError("Please choose a future viewing date and time.");
      return;
    }

    if (formData.alternativeDate && formData.alternativeTime) {
      const alternative = new Date(
        `${formData.alternativeDate}T${formData.alternativeTime}:00`
      );

      if (
        Number.isNaN(alternative.getTime()) ||
        alternative <= new Date()
      ) {
        setError("Please choose a future alternative date and time.");
        return;
      }

      if (alternative.getTime() === preferred.getTime()) {
        setError(
          "Please choose a different appointment for your alternative."
        );
        return;
      }
    }

    onNext();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <form onSubmit={handleSubmit}>
      {/* Heading */}
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <CalendarDays size={25} />
        </div>

        <h2 className="text-2xl font-bold text-[#17324D] sm:text-3xl">
          When Would You Like Us to Visit?
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Select your preferred appointment date and time.
          You can also provide an alternative in case your first
          choice isn't available.
        </p>
      </div>

      {/* Preferred appointment */}
      <div className="mt-9">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[#17324D]">
          <Clock3 size={20} className="text-[#2A9D8F]" />
          Preferred Appointment
        </h3>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="preferredDate"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Preferred Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={today}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="preferredTime"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Preferred Time <span className="text-red-500">*</span>
            </label>

            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select preferred time</option>

              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alternative appointment */}
      <div className="mt-9 border-t border-slate-100 pt-8">
        <h3 className="text-lg font-bold text-[#17324D]">
          Alternative Appointment
          <span className="ml-2 text-sm font-normal text-slate-400">
            Optional
          </span>
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Providing an alternative can help us arrange your visit
          if your preferred appointment is unavailable.
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="alternativeDate"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Alternative Date
            </label>

            <input
              type="date"
              id="alternativeDate"
              name="alternativeDate"
              value={formData.alternativeDate}
              onChange={handleChange}
              min={today}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="alternativeTime"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Alternative Time
            </label>

            <select
              id="alternativeTime"
              name="alternativeTime"
              value={formData.alternativeTime}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select alternative time</option>

              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scheduling notes */}
      <div className="mt-8">
        <label
          htmlFor="scheduleNotes"
          className="mb-2 block text-sm font-semibold text-[#17324D]"
        >
          Scheduling Notes
          <span className="ml-2 text-xs font-normal text-slate-400">
            Optional
          </span>
        </label>

        <textarea
          id="scheduleNotes"
          name="scheduleNotes"
          rows={4}
          value={formData.scheduleNotes}
          onChange={handleChange}
          maxLength={1000}
          placeholder="Tell us about any timing restrictions or other scheduling information."
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Information notice */}
      <div className="mt-7 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-sm leading-6 text-blue-900">
          Your selected date and time are requests, not confirmed
          appointments. We'll confirm the final schedule after
          checking property access and viewer availability.
          Times are based on the property's local time in the UK.
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

export default ViewingSchedule;
