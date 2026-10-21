
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  Mail,
  Phone,
  Building2,
  ClipboardList,
  CreditCard,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Save,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";
import BookingProgress from "../../components/admin/BookingProgress";

import {
  availableViewers,
  bookingDetailsExtras,
} from "../../data/adminMockData";

import { getAdminBookingById } from "../../services/adminBookingApi.js";

import { normalizeAdminBookingDetails } from "../../utils/normalizeAdminBookingDetails.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);


const formatDate = (value) => {
  if (!value) return "Not confirmed";

  const date =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T12:00:00Z`)
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};


const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

function DetailCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <Icon size={21} />
        </div>

        <h2 className="text-lg font-bold text-[#17324D]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-6">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-words text-sm font-semibold text-[#17324D] sm:text-right">
        {value || "Not provided"}
      </span>
    </div>
  );
}

function BookingDetails() {
 
const { id } = useParams();

const [booking, setBooking] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  let active = true;

  async function loadBooking() {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminBookingById(id);

      if (!active) return;

      const bookingData = response.data;

      if (!bookingData) {
        throw new Error("Booking not found.");
      }

      setBooking(normalizeAdminBookingDetails(bookingData));
    } catch (err) {
      if (!active) return;

      setBooking(null);
      setError(err.message || "Unable to load booking.");
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  if (id) {
    loadBooking();
  } else {
    setError("Invalid booking ID.");
    setLoading(false);
  }

  return () => {
    active = false;
  };
}, [id]);


  const extras = bookingDetailsExtras[id] || {};

  const [form, setForm] = useState({
    status: booking?.status || "Pending",
    viewer: booking?.viewer || "",
    accessStatus: extras.accessStatus || "Not Arranged",
    confirmedDate: extras.confirmedDate || "",
    confirmedTime: extras.confirmedTime || "",
    reportStatus: extras.reportStatus || "Not Started",
    reportDelivered: extras.reportDelivered || false,
    internalNotes: extras.internalNotes || "",
  });

  const [notice, setNotice] = useState("");

  
useEffect(() => {
  if (!booking) return;

  setForm({
    status: booking.status,
    viewer: booking.viewer || "",
    accessStatus: extras.accessStatus || "Not Arranged",
    confirmedDate: extras.confirmedDate || "",
    confirmedTime: extras.confirmedTime || "",
    reportStatus: extras.reportStatus || "Not Started",
    reportDelivered: extras.reportDelivered || false,
    internalNotes: extras.internalNotes || "",
  });

  setNotice("");
}, [booking, id]);


if (loading) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
      <p className="text-sm font-medium text-slate-600">
        Loading booking details...
      </p>
    </div>
  );
}


  if (!booking) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
        <AlertCircle
          size={42}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Booking Not Found
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          {error || `We couldn't find a booking with ID ${id}.`}
        </p>

        <Link
          to="/admin/bookings"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 font-semibold text-white"
        >
          <ArrowLeft size={18} />
          Back to Bookings
        </Link>
      </div>
    );
  }

  const matchingViewers = availableViewers.filter(
    (viewer) =>
      viewer.status === "Active" &&
      viewer.coverageAreas.some(
        (area) =>
          area.toLowerCase() ===
          booking.location.toLowerCase()
      )
  );

  const assignedViewer = availableViewers.find(
    (viewer) => viewer.name === form.viewer
  );

  const viewerOptions =
    assignedViewer &&
    !matchingViewers.some(
      (viewer) => viewer.id === assignedViewer.id
    )
      ? [assignedViewer, ...matchingViewers]
      : matchingViewers;

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setNotice("");
  };

  const canConfirm =
    booking.paymentStatus === "Paid" &&
    form.accessStatus === "Arranged" &&
    Boolean(form.viewer) &&
    Boolean(form.confirmedDate) &&
    Boolean(form.confirmedTime);

  const handleSave = () => {
    if (
      ["Confirmed", "In Progress", "Completed"].includes(
        form.status
      ) &&
      !canConfirm
    ) {
      setNotice(
        "Before confirming or progressing this booking, verify payment, property access, viewer assignment, and the confirmed appointment date and time."
      );
      return;
    }

    if (
      form.reportDelivered &&
      (form.status !== "Completed" ||
        form.reportStatus !== "Ready")
    ) {
      setNotice(
        "The viewing must be completed and its report marked ready before recording report delivery."
      );
      return;
    }

    // Frontend demonstration only.
    // No API request or database update occurs here.
    setNotice(
      "Demo changes validated. They are only held in this page's React state and have not been saved to a server."
    );
  };

  const canDeliver =
    form.status === "Completed" &&
    form.reportStatus === "Ready";

  return (
    <div className="space-y-8">
      {/* BACK */}
      <Link
        to="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Bookings
      </Link>

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
              Booking {booking.reference || booking.id}
            </h1>

            <StatusBadge status={form.status} />
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {booking.service} — {booking.location}
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-700">
            Frontend demo — changes are not persisted
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#238579]"
        >
          <Save size={18} />
          Validate Changes
        </button>
      </div>

      {/* NOTICE */}
      {notice && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4"
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <p className="text-sm leading-7 text-blue-800">
            {notice}
          </p>
        </div>
      )}

      {/* PROGRESS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-7 text-lg font-bold text-[#17324D]">
          Booking Progress
        </h2>

        <BookingProgress
          paymentStatus={booking.paymentStatus}
          accessStatus={form.accessStatus}
          viewer={form.viewer}
          status={form.status}
          reportDelivered={form.reportDelivered}
        />
      </section>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* CUSTOMER */}
          <DetailCard
            title="Customer Information"
            icon={UserRound}
          >
            <InfoRow
              label="Full Name"
              value={booking.customer}
            />

            <InfoRow
              label="Email Address"
              value={
                <a
                  href={`mailto:${booking.email}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {booking.email}
                </a>
              }
            />

            <InfoRow
              label="Phone Number"
              value={
                <a
                  href={`tel:${booking.phone}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {booking.phone}
                </a>
              }
            />
          </DetailCard>

          {/* PROPERTY */}
          <DetailCard
            title="Property Information"
            icon={Building2}
          >
            <InfoRow
              label="Service"
              value={booking.service}
            />

            <InfoRow
              label="Property Type"
              value={booking.propertyPostcode}
            />

            <InfoRow
              label="Address"
              value={booking.propertyAddress}
            />

            <InfoRow
              label="Location"
              value={booking.location}
            />

            <div className="mt-5">
              <h3 className="text-sm font-bold text-[#17324D]">
                Viewing Instructions
              </h3>

              <p className="mt-3 rounded-xl bg-[#F6F9FA] p-4 text-sm leading-7 text-slate-600">
                {booking.specialInstructions ||
                  "No additional viewing instructions provided."}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-sm font-bold text-[#17324D]">
                Viewing Checklist
              </h3>

              <div className="space-y-3">
                {(extras.checklist || [
                  "General property condition",
                  "Photographs and videos",
                ]).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="text-[#2A9D8F]"
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </DetailCard>

          {/* APPOINTMENT */}
          <DetailCard
            title="Appointment Scheduling"
            icon={CalendarDays}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">
                  Requested Date
                </p>

                <p className="mt-2 font-semibold text-[#17324D]">
                  {formatDate(booking.date)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Requested Time
                </p>

                <p className="mt-2 font-semibold text-[#17324D]">
                  {booking.time || "Not provided"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmed-date"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Confirmed Date
                </label>

                <input
                  id="confirmed-date"
                  type="date"
                  value={form.confirmedDate}
                  onChange={(event) =>
                    updateField(
                      "confirmedDate",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmed-time"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Confirmed Time
                </label>

                <input
                  id="confirmed-time"
                  type="time"
                  value={form.confirmedTime}
                  onChange={(event) =>
                    updateField(
                      "confirmedTime",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Only confirm the appointment after
              coordinating access with the property
              owner or agent and the assigned viewer.
            </p>
          </DetailCard>

          {/* PROPERTY ACCESS */}
          <DetailCard
            title="Property Access Coordination"
            icon={MapPin}
          >
            <InfoRow
  label="Access Contact"
  value={booking.accessContactName}
/>

<InfoRow
  label="Contact Number"
  value={booking.accessContactPhone}
/>

<InfoRow
  label="Access Instructions"
  value={booking.accessNotes}
/>

            <div className="mt-5">
              <label
                htmlFor="access-status"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Access Status
              </label>

              <select
                id="access-status"
                value={form.accessStatus}
                onChange={(event) =>
                  updateField(
                    "accessStatus",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="Not Arranged">
                  Not Arranged
                </option>
                <option value="Contacted">
                  Contacted
                </option>
                <option value="Arranged">
                  Arranged
                </option>
                <option value="Unavailable">
                  Unavailable
                </option>
              </select>
            </div>
          </DetailCard>

          {/* VIEWER ASSIGNMENT */}
          <DetailCard
            title="Viewer Assignment"
            icon={UserRound}
          >
            <label
              htmlFor="assigned-viewer"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Select Viewer
            </label>

            <select
              id="assigned-viewer"
              value={form.viewer}
              onChange={(event) =>
                updateField("viewer", event.target.value)
              }
              className={inputClass}
            >
              <option value="">
                No Viewer Assigned
              </option>

              {viewerOptions.map((viewer) => (
                <option
                  key={viewer.id}
                  value={viewer.name}
                >
                  {viewer.name} — {viewer.location}
                </option>
              ))}
            </select>

            <p className="mt-3 text-xs leading-6 text-slate-500">
              Viewers are filtered by their listed
              coverage areas. Actual availability
              must be confirmed separately.
            </p>

            {matchingViewers.length === 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                No active viewers currently match
                this location in the demo data.
              </div>
            )}
          </DetailCard>

          {/* REPORT */}
          <DetailCard
            title="Viewing Report"
            icon={FileImage}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="report-status"
                  className="mb-2 block text-sm font-semibold text-[#17324D]"
                >
                  Report Status
                </label>

                <select
                  id="report-status"
                  value={form.reportStatus}
                  onChange={(event) =>
                    updateField(
                      "reportStatus",
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="Not Started">
                    Not Started
                  </option>
                  <option value="Awaiting Materials">
                    Awaiting Materials
                  </option>
                  <option value="Under Review">
                    Under Review
                  </option>
                  <option value="Ready">
                    Ready
                  </option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#17324D]">
                  Delivery Method
                </p>

                <div className="rounded-xl bg-[#F6F9FA] px-4 py-3 text-sm text-slate-600">
                  {extras.reportDelivery || "WhatsApp"}
                </div>
              </div>
            </div>

            <label className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.reportDelivered}
                disabled={
                  !canDeliver &&
                  !form.reportDelivered
                }
                onChange={(event) =>
                  updateField(
                    "reportDelivered",
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 accent-[#2A9D8F]"
              />

              <span className="text-sm leading-7 text-slate-600">
                Mark report as delivered to customer
                (demo record only)
              </span>
            </label>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Viewing photographs, videos, and notes
              will initially be coordinated manually.
              A report upload workflow can be added
              when required.
            </p>
          </DetailCard>

          {/* INTERNAL NOTES */}
          <DetailCard
            title="Internal Administration Notes"
            icon={MessageSquare}
          >
            <textarea
              value={form.internalNotes}
              onChange={(event) =>
                updateField(
                  "internalNotes",
                  event.target.value
                )
              }
              rows={5}
              placeholder="Add internal coordination notes..."
              className={`${inputClass} resize-y`}
            />

            <p className="mt-3 text-xs text-slate-500">
              Notes are temporary in this frontend demo.
              Do not enter real personal or confidential
              information.
            </p>
          </DetailCard>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* STATUS MANAGEMENT */}
          <DetailCard
            title="Booking Status"
            icon={ClipboardList}
          >
            <label
              htmlFor="booking-status"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Current Status
            </label>

            <select
              id="booking-status"
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value)
              }
              className={inputClass}
            >
              {[
                "Pending",
                "Assigned",
                "Confirmed",
                "In Progress",
                "Completed",
                "Cancelled",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Booking status and payment status
              are managed separately.
            </p>

            {!canConfirm &&
              ["Confirmed", "In Progress", "Completed"].includes(
                form.status
              ) && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-800">
                  Confirmation requirements
                  are not yet satisfied.
                </div>
              )}
          </DetailCard>

          {/* PAYMENT */}
          <DetailCard
            title="Payment Summary"
            icon={CreditCard}
          >
            <InfoRow
              label="Amount"
              value={formatCurrency(booking.amount)}
            />

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">
                Payment Status
              </span>

              <StatusBadge
                status={booking.paymentStatus}
              />
            </div>

            <InfoRow
  label="Payment Date"
  value={
    booking.paidAt
      ? formatDate(booking.paidAt)
      : "Not Paid"
  }
/>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Payment status is read-only in this
              demonstration. Real payment information
              will be verified through the backend
              and payment provider.
            </p>
          </DetailCard>

          {/* QUICK SUMMARY */}
          <DetailCard
            title="Booking Summary"
            icon={Clock3}
          >
            <InfoRow
              label="Booking ID"
              value={booking.id}
            />

            <InfoRow
              label="Created"
              value={formatDate(booking.createdAt)}
            />

            <InfoRow
              label="Assigned Viewer"
              value={form.viewer || "Not Assigned"}
            />

            <InfoRow
              label="Confirmed Date"
              value={formatDate(form.confirmedDate)}
            />

            <InfoRow
              label="Confirmed Time"
              value={form.confirmedTime || "Not Confirmed"}
            />
          </DetailCard>

          {/* REMINDER */}
          <div className="rounded-2xl bg-[#17324D] p-6 text-white">
            <AlertCircle
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Coordination Reminder
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              A paid booking is not automatically
              a confirmed appointment. Property
              access, viewer availability, and
              appointment details must be verified.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Changes are temporary until backend integration.
        </p>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
        >
          <Save size={18} />
          Validate Changes
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;
