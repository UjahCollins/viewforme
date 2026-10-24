
import { useEffect, useRef, useState } from "react";
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

import {bookingDetailsExtras,} from "../../data/adminMockData";
import { getAdminViewers } from "../../services/adminViewerApi.js";
import {
  createAdminAssignment, cancelAdminAssignment} from "../../services/adminAssignmentApi.js";
import { getAdminBookingById, confirmAdminBooking, cancelAdminBooking,completeAdminBooking,deliverAdminBookingReport,} from "../../services/adminBookingApi.js";

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
const [confirming, setConfirming] = useState(false);
const [cancelling, setCancelling] = useState(false);
const [completing, setCompleting] = useState(false);
const [deliveringReport, setDeliveringReport] = useState(false);
const [showCancelForm, setShowCancelForm] = useState(false);
const [cancellationReason, setCancellationReason] = useState("");
const [viewers, setViewers] = useState([]);
const [viewersLoading, setViewersLoading] = useState(false);
const [viewersError, setViewersError] = useState("");
const [assigningViewer, setAssigningViewer] = useState(false);
const [assignmentError, setAssignmentError] = useState("");
const [assignmentSuccess, setAssignmentSuccess] = useState("");
const [cancellingAssignment, setCancellingAssignment] = useState(false);
const [showAssignmentCancelForm, setShowAssignmentCancelForm] = useState(false);
const [assignmentCancelReason, setAssignmentCancelReason] = useState("");

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

useEffect(() => {
  let active = true;

  async function loadViewers() {
    setViewersLoading(true);
    setViewersError("");

    try {
      const allViewers = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await getAdminViewers({
          status: "ACTIVE",
          page,
          limit: 100,
        });

        if (!active) return;

        allViewers.push(...(response.data || []));

        totalPages = response.pagination?.totalPages || 1;
        page += 1;
      } while (page <= totalPages);

      if (active) {
        setViewers(allViewers);
      }
    } catch (error) {
      if (active) {
        setViewersError(
          error.message || "Unable to load viewers."
        );
      }
    } finally {
      if (active) {
        setViewersLoading(false);
      }
    }
  }

  loadViewers();

  return () => {
    active = false;
  };
}, []);


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
  const noticeRef = useRef(null);
  
useEffect(() => {
  if (!booking) return;

  setForm({
    status: booking.status,
    viewer:
  (booking.assignments || []).find((assignment) =>
    ["ASSIGNED", "ACCEPTED"].includes(assignment.status)
  )?.viewerId || "",
    accessStatus: extras.accessStatus || "Not Arranged",
    confirmedDate: extras.confirmedDate || "",
    confirmedTime: extras.confirmedTime || "",
    reportStatus: extras.reportStatus || "Not Started",
    reportDelivered: extras.reportDelivered || false,
    internalNotes: extras.internalNotes || "",
  });

  
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

const bookingCity = (
  booking.propertyCity ||
  booking.city ||
  ""
).trim().toLowerCase();

const matchingViewers = viewers.filter((viewer) => {
  if (viewer.status !== "ACTIVE") return false;

  const viewerLocations = [
    viewer.city,
    ...(viewer.coverageAreas || []),
  ]
    .filter(Boolean)
    .map((area) => area.trim().toLowerCase());

  return (
    Boolean(bookingCity) &&
    viewerLocations.includes(bookingCity)
  );
});

const assignedViewer = viewers.find(
  (viewer) => viewer.id === form.viewer
);

const viewerOptions =
  assignedViewer &&
  !matchingViewers.some(
    (viewer) => viewer.id === assignedViewer.id
  )
    ? [assignedViewer, ...matchingViewers]
    : matchingViewers;

    const activeAssignment = (booking.assignments || []).find(
  (assignment) =>
    ["ASSIGNED", "ACCEPTED"].includes(assignment.status)
);

const assignedViewerName =
  activeAssignment?.viewer?.fullName ||
  viewers.find(
    (viewer) => viewer.id === activeAssignment?.viewerId
  )?.fullName ||
  "Unknown Viewer";

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

  
const handleConfirmBooking = async () => {
  if (!booking?.id || confirming) return;

  const confirmed = window.confirm(
    `Are you sure you want to confirm booking ${booking.reference}?`
  );

  if (!confirmed) return;

  setConfirming(true);
  setNotice("");

  try {
    await confirmAdminBooking(booking.id);

    // Fetch the updated booking from the backend.
    const response = await getAdminBookingById(booking.id);

    setBooking(
      normalizeAdminBookingDetails(response.data)
    );

    setNotice("Booking confirmed successfully.");
  } catch (error) {
    setNotice(
      error.message || "Unable to confirm booking."
    );
  } finally {
    setConfirming(false);
  }
};



const handleCancelBooking = async () => {
  const reason = cancellationReason.trim();

  if (reason.length < 5 || reason.length > 1000) {
    setNotice(
      "Please provide a cancellation reason between 5 and 1000 characters."
    );
    return;
  }

  if (!booking?.id || cancelling) return;

  const confirmed = window.confirm(
    `Are you sure you want to cancel booking ${booking.reference}?`
  );

  if (!confirmed) return;

  setCancelling(true);
  setNotice("");

  try {
    const result = await cancelAdminBooking(booking.id, reason);

    // The cancellation request has succeeded.
    const refundRequired =
      result?.refundRequired ??
      result?.data?.refundRequired ??
      false;

    const successMessage = refundRequired
      ? "Booking cancelled successfully. A payment refund may be required and must be handled separately."
      : "Booking cancelled successfully.";

    // Update the booking from the cancellation response first.
    const updatedBooking = result?.data?.id
      ? result.data
      : result?.data?.data;

    if (updatedBooking?.id) {
      setBooking(normalizeAdminBookingDetails(updatedBooking));
    }

    setShowCancelForm(false);
    setCancellationReason("");

    // Display success immediately, independently of the refresh.
    setNotice(successMessage);
    requestAnimationFrame(() => {
  noticeRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
});

    // Refresh booking details without allowing a refresh failure
    // to overwrite the successful cancellation message.
    try {
      const response = await getAdminBookingById(booking.id);

      if (response?.data) {
        setBooking(normalizeAdminBookingDetails(response.data));
      }
    } catch (refreshError) {
      console.error(
        "Booking cancelled, but refreshing details failed:",
        refreshError
      );
    }
  } catch (error) {
    setNotice(error.message || "Unable to cancel booking.");
  } finally {
    setCancelling(false);
  }
};

const handleCompleteBooking = async () => {
  if (!booking?.id || completing) return;

  const confirmed = window.confirm(
    `Are you sure the viewing for booking ${booking.reference} has been completed?`
  );

  if (!confirmed) return;

  setCompleting(true);
  setNotice("");

  try {
    const result = await completeAdminBooking(booking.id);

    if (result?.data?.id) {
      setBooking(normalizeAdminBookingDetails(result.data));
    }

    setNotice("Booking marked as completed successfully.");

    requestAnimationFrame(() => {
      noticeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    try {
      const response = await getAdminBookingById(booking.id);

      if (response?.data) {
        setBooking(normalizeAdminBookingDetails(response.data));
      }
    } catch (refreshError) {
      console.error(
        "Booking completed, but refreshing details failed:",
        refreshError
      );
    }
  } catch (error) {
    setNotice(
      error.message || "Unable to mark booking as completed."
    );
  } finally {
    setCompleting(false);
  }
};

const handleDeliverReport = async () => {
  if (!booking?.id || deliveringReport) return;

  if (booking.rawStatus !== "COMPLETED") {
    setNotice("Complete the booking before recording report delivery.");
    return;
  }

  const alreadyDelivered = (booking.reports || []).some(
    (report) => report.status === "DELIVERED"
  );

  if (alreadyDelivered) {
    setNotice("The viewing report has already been delivered.");
    return;
  }

  const confirmed = window.confirm(
    `Have you already sent the viewing report for booking ${booking.reference} to the customer?`
  );

  if (!confirmed) return;

  setDeliveringReport(true);
  setNotice("");

  try {
    const result = await deliverAdminBookingReport(booking.id);

    // Update the report immediately using the successful response.
    if (result?.data?.id) {
      setBooking((previous) => ({
        ...previous,
        reports: [...(previous.reports || []), result.data],
      }));
    }

    setNotice("Viewing report marked as delivered successfully.");

    requestAnimationFrame(() => {
      noticeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    // Refresh the booking from the database.
    try {
      const response = await getAdminBookingById(booking.id);

      if (response?.data) {
        setBooking(normalizeAdminBookingDetails(response.data));
      }
    } catch (refreshError) {
      console.error(
        "Report delivered, but refreshing booking failed:",
        refreshError
      );
    }
  } catch (error) {
    setNotice(
      error.message || "Unable to mark the report as delivered."
    );
  } finally {
    setDeliveringReport(false);
  }
};

const handleAssignViewer = async () => {
  const viewerId = form.viewer;

  if (booking.rawStatus !== "CONFIRMED") {
    setAssignmentError(
      "Only confirmed bookings can be assigned to viewers."
    );
    return;
  }

  if (!viewerId) {
    setAssignmentError("Please select a viewer.");
    return;
  }

  if (activeAssignment) {
    setAssignmentError(
      "This booking already has an active viewer assignment."
    );
    return;
  }

  if (assigningViewer) return;

  const selectedViewer = viewers.find(
    (viewer) => viewer.id === viewerId
  );

  const confirmed = window.confirm(
    `Assign ${selectedViewer?.fullName || "this viewer"} to booking ${booking.reference}?`
  );

  if (!confirmed) return;

  setAssigningViewer(true);
  setAssignmentError("");
  setAssignmentSuccess("");

  try {
    await createAdminAssignment({
      bookingId: booking.id,
      viewerId,
    });

    setAssignmentSuccess(
      "Viewer assigned to booking successfully."
    );

    // Refresh the booking to retrieve the saved assignment.
    try {
      const response = await getAdminBookingById(booking.id);

      if (response?.data) {
        setBooking(
          normalizeAdminBookingDetails(response.data)
        );
      }
    } catch (refreshError) {
      console.error(
        "Viewer assigned, but refreshing booking failed:",
        refreshError
      );
    }
  } catch (error) {
    setAssignmentError(
      error.message || "Unable to assign viewer."
    );
  } finally {
    setAssigningViewer(false);
  }
};

const handleCancelAssignment = async () => {
  const reason = assignmentCancelReason.trim();

  if (!activeAssignment?.id || cancellingAssignment) return;

  if (reason.length < 5 || reason.length > 2000) {
    setAssignmentError(
      "Please provide a cancellation reason between 5 and 2000 characters."
    );
    return;
  }

  const confirmed = window.confirm(
    `Cancel the viewer assignment for booking ${booking.reference}?`
  );

  if (!confirmed) return;

  setCancellingAssignment(true);
  setAssignmentError("");
  setAssignmentSuccess("");

  try {
    await cancelAdminAssignment(activeAssignment.id, reason);

    setAssignmentSuccess(
      "Viewer assignment cancelled successfully."
    );

    setShowAssignmentCancelForm(false);
    setAssignmentCancelReason("");

    // Refresh booking details to reflect the cancelled assignment.
    try {
      const response = await getAdminBookingById(booking.id);

      if (response?.data) {
        setBooking(
          normalizeAdminBookingDetails(response.data)
        );
      }
    } catch (refreshError) {
      console.error(
        "Assignment cancelled, but refreshing booking failed:",
        refreshError
      );
    }
  } catch (error) {
    setAssignmentError(
      error.message || "Unable to cancel viewer assignment."
    );
  } finally {
    setCancellingAssignment(false);
  }
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

            <StatusBadge status={booking.status} />
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {booking.service} — {booking.location}
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-700">
             Booking information is retrieved from the ViewForMe system.
          </p>
        </div>

        {booking.rawStatus === "AWAITING_CONFIRMATION" && (
  <button
    type="button"
    onClick={handleConfirmBooking}
    disabled={confirming}
    className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {confirming ? "Confirming..." : "Confirm Booking"}
  </button>
)}
{!["CANCELLED", "COMPLETED"].includes(
  booking.rawStatus
) && (
  <button
    type="button"
    onClick={() => setShowCancelForm(true)}
    disabled={cancelling || confirming}
    className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
  >
    Cancel Booking
  </button>
)}
      </div>


{showCancelForm && (
  <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
    <h2 className="text-lg font-bold text-red-800">
      Cancel Booking
    </h2>

    <p className="mt-2 text-sm leading-6 text-red-700">
      Please provide the reason for cancelling this
      booking. This action will update the booking
      status in the ViewForMe system.
    </p>

    <label
      htmlFor="cancellation-reason"
      className="mt-5 block text-sm font-semibold text-red-800"
    >
      Cancellation Reason
    </label>

    <textarea
      id="cancellation-reason"
      value={cancellationReason}
      onChange={(event) =>
        setCancellationReason(event.target.value)
      }
      rows={4}
      maxLength={1000}
      placeholder="Enter the reason for cancellation..."
      className="mt-2 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400"
    />

    <p className="mt-2 text-xs text-red-600">
      {cancellationReason.trim().length}/1000 characters
      (minimum 5)
    </p>

    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleCancelBooking}
        disabled={
          cancelling ||
          cancellationReason.trim().length < 5
        }
        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelling
          ? "Cancelling..."
          : "Confirm Cancellation"}
      </button>

      <button
        type="button"
        onClick={() => {
          setShowCancelForm(false);
          setCancellationReason("");
        }}
        disabled={cancelling}
        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Keep Booking
      </button>
    </div>
  </section>
)}


      {/* NOTICE */}
{notice && (
  <div
    ref={noticeRef}
    role="status"
    aria-live="polite"
    className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
  >
    <CheckCircle2
      size={20}
      className="mt-0.5 shrink-0 text-emerald-700"
    />

    <p className="text-sm leading-7 text-emerald-800">
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
  viewer={form.viewer}
  status={booking.status}
 reportDelivered={(booking.reports || []).some(
  (report) => report.status === "DELIVERED"
)}
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
              label="Postcode"
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
              disabled={
  assigningViewer ||
  Boolean(activeAssignment) ||
  booking.rawStatus !== "CONFIRMED"
}
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
    value={viewer.id}
  >
    {viewer.fullName} — {viewer.city || "Location not specified"}
  </option>
))}
            </select>

            {booking.rawStatus === "CONFIRMED" &&
  !activeAssignment && (
    <button
      type="button"
      onClick={handleAssignViewer}
      disabled={
        assigningViewer ||
        !form.viewer ||
        viewersLoading ||
        Boolean(viewersError)
      }
      className="mt-4 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {assigningViewer
        ? "Assigning Viewer..."
        : "Assign Viewer"}
    </button>
  )}

  {activeAssignment && (
  <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4">
    <p className="text-sm font-semibold text-teal-800">
      Assigned Viewer: {assignedViewerName}
    </p>

    <p className="mt-1 text-xs text-teal-700">
      Assignment Status: {activeAssignment.status}
    </p>
  </div>
)}

{activeAssignment && !showAssignmentCancelForm && (
  <button
    type="button"
    onClick={() => {
      setAssignmentError("");
      setShowAssignmentCancelForm(true);
    }}
    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
  >
    Cancel Viewer Assignment
  </button>
)}

{activeAssignment && showAssignmentCancelForm && (
  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
    <label
      htmlFor="assignment-cancel-reason"
      className="block text-sm font-semibold text-red-800"
    >
      Reason for Cancelling Assignment
    </label>

    <textarea
      id="assignment-cancel-reason"
      value={assignmentCancelReason}
      onChange={(event) =>
        setAssignmentCancelReason(event.target.value)
      }
      rows={3}
      maxLength={2000}
      placeholder="Enter the reason for cancelling this assignment..."
      className={`${inputClass} mt-2`}
    />

    <p className="mt-2 text-xs text-red-600">
      {assignmentCancelReason.trim().length}/2000 characters
      (minimum 5)
    </p>

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleCancelAssignment}
        disabled={
          cancellingAssignment ||
          assignmentCancelReason.trim().length < 5
        }
        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancellingAssignment
          ? "Cancelling..."
          : "Confirm Assignment Cancellation"}
      </button>

      <button
        type="button"
        onClick={() => {
          setShowAssignmentCancelForm(false);
          setAssignmentCancelReason("");
          setAssignmentError("");
        }}
        disabled={cancellingAssignment}
        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Keep Assignment
      </button>
    </div>
  </div>
)}

{assignmentSuccess && (
  <p role="status" className="mt-3 text-sm text-emerald-700">
    {assignmentSuccess}
  </p>
)}

{assignmentError && (
  <p role="alert" className="mt-3 text-sm text-red-600">
    {assignmentError}
  </p>
)}

{booking.rawStatus !== "CONFIRMED" &&
  !activeAssignment && (
    <p className="mt-3 text-sm text-amber-700">
      Confirm this booking before assigning a viewer.
    </p>
  )}

            {viewersLoading && (
  <p className="mt-3 text-sm text-slate-500">
    Loading available viewers...
  </p>
)}

{viewersError && (
  <p className="mt-3 text-sm text-red-600">
    {viewersError}
  </p>
)}

            <p className="mt-3 text-xs leading-6 text-slate-500">
              Viewers are filtered by their listed
              coverage areas. Actual availability
              must be confirmed separately.
            </p>

           {!viewersLoading &&
  !viewersError &&
  matchingViewers.length === 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                No active viewers currently cover
this property's city.
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

           {(() => {
  const deliveredReport = (booking.reports || []).find(
    (report) => report.status === "DELIVERED"
  );

  return deliveredReport ? (
    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 text-emerald-800">
        <CheckCircle2 size={20} />

        <span className="text-sm font-semibold">
          Report Delivered Successfully
        </span>
      </div>

      <p className="mt-2 text-sm text-emerald-700">
        Delivered on: {formatDate(deliveredReport.deliveredAt)}
      </p>
    </div>
  ) : booking.rawStatus === "COMPLETED" ? (
    <button
      type="button"
      onClick={handleDeliverReport}
      disabled={deliveringReport}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CheckCircle2 size={18} />

      {deliveringReport
        ? "Recording Delivery..."
        : "Mark Report as Delivered"}
    </button>
  ) : (
    <p className="mt-6 text-sm text-amber-700">
      Complete the booking before recording report delivery.
    </p>
  );
})()}

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Viewing photographs, videos, and notes
              will initially be coordinated manually.
              A report upload workflow can be added
              when required.
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

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
  <StatusBadge status={booking.status} />
</div>

{["CONFIRMED", "IN_PROGRESS"].includes(
  booking.rawStatus
) && (
  <button
    type="button"
    onClick={handleCompleteBooking}
    disabled={completing || confirming || cancelling}
    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <CheckCircle2 size={18} />
    {completing
      ? "Completing Booking..."
      : "Mark as Completed"}
  </button>
)}
{booking.rawStatus === "CANCELLED" && (
  <div className="mt-5 space-y-2">
    <InfoRow
      label="Cancelled On"
      value={formatDate(booking.cancelledAt)}
    />

    <InfoRow
      label="Cancellation Reason"
      value={booking.cancellationReason}
    />
  </div>
)}

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Booking status and payment status
              are managed separately.
            </p>

            
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
               Payment information is retrieved from the ViewForMe
  backend and updated through Stripe payment processing.
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
  value={
    activeAssignment
      ? assignedViewerName
      : "Not Assigned"
  }
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

    
    </div>
  );
}

export default BookingDetails;
