
import {
  ClipboardCheck,
  MapPin,
  CalendarDays,
  UserRound,
  ListChecks,
  CreditCard,
  Pencil,
  ArrowLeft,
  Info,
  Clock3,
} from "lucide-react";

const serviceNames = {
  residential: "Residential Property Viewing",
  commercial: "Commercial Property Viewing",
  storage: "Storage Unit Inspection",
  construction: "Construction Progress Inspection",
};

const formatDate = (date) => {
  if (!date) return "Not provided";

  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatTime = (time) => {
  if (!time) return "Not provided";

  const [hour, minute] = time.split(":").map(Number);

  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${String(minute).padStart(2, "0")} ${period}`;
};

function ReviewSection({
  title,
  icon: Icon,
  step,
  onEdit,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
            <Icon size={21} />
          </div>

          <h3 className="text-base font-bold text-[#17324D] sm:text-lg">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2A9D8F] transition hover:text-[#238579]"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>

      <div className="pt-5">{children}</div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#17324D]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function BookingReview({
  selectedService,
  formData,
  onEdit,
  onBack,
  onSubmit,
  isSubmitting = false,
  submitError = "",
  canPay = false,
  bookingQuote = null,
quoteLoading = false,
quoteError = "",
}) {
  const allChecklistItems = [
    ...formData.checklistItems,
    ...formData.customChecklistItems,
  ];

  return (
    <div>
      {/* Heading */}
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <ClipboardCheck size={25} />
        </div>

        <h2 className="text-2xl font-bold text-[#17324D] sm:text-3xl">
          Review Your Booking
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Please check your information carefully.
          You can return to any section to make changes.
        </p>
      </div>

      <div className="mt-9 space-y-5">
        {/* Service */}
        <ReviewSection
          title="Selected Service"
          icon={ClipboardCheck}
          step={1}
          onEdit={onEdit}
        >
          <Detail
            label="Service"
            value={serviceNames[selectedService]}
          />
        </ReviewSection>

        {/* Property */}
        <ReviewSection
          title="Property Details"
          icon={MapPin}
          step={2}
          onEdit={onEdit}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Detail
              label="Address"
              value={formData.propertyAddress}
            />

            <Detail
              label="Town / City"
              value={formData.city}
            />

            <Detail
              label="Postcode"
              value={formData.postcode}
            />

            <Detail
              label="Property Type"
              value={formData.propertyType}
            />
          </div>

          {formData.accessInstructions && (
            <div className="mt-5">
              <Detail
                label="Access Information"
                value={formData.accessInstructions}
              />
            </div>
          )}
        </ReviewSection>

        {/* Schedule */}
        <ReviewSection
          title="Viewing Schedule"
          icon={CalendarDays}
          step={3}
          onEdit={onEdit}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Detail
              label="Preferred Date"
              value={formatDate(formData.preferredDate)}
            />

            <Detail
              label="Preferred Time"
              value={formatTime(formData.preferredTime)}
            />

            {formData.alternativeDate && (
              <>
                <Detail
                  label="Alternative Date"
                  value={formatDate(formData.alternativeDate)}
                />

                <Detail
                  label="Alternative Time"
                  value={formatTime(formData.alternativeTime)}
                />
              </>
            )}
          </div>

          {formData.scheduleNotes && (
            <div className="mt-5">
              <Detail
                label="Scheduling Notes"
                value={formData.scheduleNotes}
              />
            </div>
          )}
        </ReviewSection>

        {/* Requirements */}
        <ReviewSection
          title="Viewing Requirements"
          icon={ListChecks}
          step={4}
          onEdit={onEdit}
        >
          {allChecklistItems.length > 0 ? (
            <ul className="space-y-3">
              {allChecklistItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-start gap-3 text-sm leading-6 text-[#17324D]"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A9D8F]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No checklist items selected.
            </p>
          )}

          {formData.specialInstructions && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <Detail
                label="Additional Instructions"
                value={formData.specialInstructions}
              />
            </div>
          )}
        </ReviewSection>

        {/* Customer */}
        <ReviewSection
          title="Customer & Property Contact"
          icon={UserRound}
          step={5}
          onEdit={onEdit}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Detail
              label="Customer Name"
              value={`${formData.firstName} ${formData.lastName}`}
            />

            <Detail
              label="Email"
              value={formData.email}
            />

            <Detail
              label="Phone / WhatsApp"
              value={formData.phone}
            />

            <Detail
              label="Preferred Contact Method"
              value={formData.contactPreference}
            />
          </div>

          {(formData.propertyContactName ||
            formData.propertyContactPhone ||
            formData.propertyContactEmail) && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h4 className="mb-5 text-sm font-bold text-[#17324D]">
                Property Representative
              </h4>

              <div className="grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Contact Type"
                  value={formData.propertyContactType?.replaceAll(
                    "-",
                    " "
                  )}
                />

                <Detail
                  label="Name / Agency"
                  value={formData.propertyContactName}
                />

                <Detail
                  label="Phone"
                  value={formData.propertyContactPhone}
                />

                <Detail
                  label="Email"
                  value={formData.propertyContactEmail}
                />
              </div>
            </div>
          )}
        </ReviewSection>
      </div>

{/* Pricing */}
<section className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
  <div className="flex items-center gap-3 bg-[#17324D] px-6 py-5 text-white">
    <CreditCard size={23} />

    <h3 className="text-lg font-bold">
      Booking Summary & Payment
    </h3>
  </div>

  <div className="p-6">
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-[#17324D]">
        Viewing Service
      </span>

      <span className="text-right text-sm font-medium text-slate-600">
        {bookingQuote?.serviceName ||
          serviceNames[selectedService]}
      </span>
    </div>

    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="flex items-center justify-between gap-4">
        <span className="font-bold text-[#17324D]">
          Total Payable
        </span>

        {quoteLoading ? (
          <span className="text-sm text-slate-500">
            Calculating price...
          </span>
        ) : bookingQuote ? (
          <span className="text-2xl font-extrabold text-[#17324D]">
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: bookingQuote.currency,
            }).format(Number(bookingQuote.amount))}
          </span>
        ) : (
          <span className="text-sm text-slate-500">
            Price unavailable
          </span>
        )}
      </div>
    </div>

    <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F0FAF8] p-4">
      <Info
        size={20}
        className="mt-0.5 shrink-0 text-[#2A9D8F]"
      />

      <p className="text-sm leading-6 text-[#226E66]">
        This amount has been retrieved from ViewForMe's
        pricing system. Payment is processed securely
        through Stripe. Your viewing appointment will
        remain subject to confirmation.
      </p>
    </div>

    {quoteError && (
      <p
        role="alert"
        className="mt-4 text-sm text-red-600"
      >
        {quoteError}
      </p>
    )}

    {submitError && (
      <p
        role="alert"
        className="mt-4 text-sm text-red-600"
      >
        {submitError}
      </p>
    )}

    <button
      type="button"
      onClick={onSubmit}
      disabled={!canPay || isSubmitting}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-4 font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
    >
      <CreditCard size={19} />

      {isSubmitting
        ? "Preparing Secure Checkout..."
        : quoteLoading
          ? "Retrieving Price..."
          : "Proceed to Secure Payment"}
    </button>

    <p className="mt-3 text-center text-xs text-slate-500">
      You will review the payment details again on Stripe
      before completing payment.
    </p>
  </div>
</section>




      {/* Booking status */}
      <div className="mt-7 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <Clock3
          size={21}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-sm leading-7 text-blue-900">
          Your selected appointment is a request, not a
          confirmed booking. ViewForMe must first coordinate
          property access and local viewer availability.
          Successful payment, once enabled, will mean your
          request has been received, not that the appointment
          has been confirmed.
        </p>
      </div>

      {/* Scope disclaimer */}
      <p className="mt-6 text-xs leading-6 text-slate-500">
        ViewForMe provides visual observations only.
        Our service does not replace professional surveys,
        valuations, technical inspections, legal checks,
        or safety assessments.
      </p>

      {/* Back */}
      <div className="mt-9 border-t border-slate-100 pt-7">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#17324D]"
        >
          <ArrowLeft size={18} />
          Back to Contact Details
        </button>
      </div>
    </div>
  );
}

export default BookingReview;
