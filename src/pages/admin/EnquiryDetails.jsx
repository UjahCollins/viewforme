
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Save,
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Loader2,
  Trash2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import {
  getAdminEnquiryById,
  updateAdminEnquiryStatus,
  deleteAdminEnquiry,
} from "../../services/adminEnquiryApi.js";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const ENQUIRY_TYPES = {
  general: "General Enquiry",
  booking: "New Booking Enquiry",
  "existing-booking": "Existing Booking",
  "property-agent": "Property Agent / Landlord",
  viewer: "Become a Viewer",
  partnership: "Business Partnership",
  complaint: "Feedback or Complaint",
  other: "Other",
};

const formatDate = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(date);
};

const getStatusLabel = (status) => {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.label ||
    status ||
    "Unknown"
  );
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-5">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-words text-sm font-semibold text-[#17324D] sm:text-right">
        {value || "Not provided"}
      </span>
    </div>
  );
}

function EnquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [status, setStatus] = useState("NEW");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchEnquiry() {
      try {
        setLoading(true);
        setError("");
        setNotice("");
        setEnquiry(null);

        const response = await getAdminEnquiryById(id);

        if (!active) return;

        if (!response?.success || !response?.data?.enquiry) {
          throw new Error(
            response?.message || "Enquiry not found."
          );
        }

        const record = response.data.enquiry;

        setEnquiry(record);
        setStatus(record.status || "NEW");
      } catch (err) {
        if (!active) return;

        setError(
          err?.message ||
            "Unable to load enquiry details."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchEnquiry();

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const refreshEnquiry = () => {
    setReloadKey((previous) => previous + 1);
  };

  const handleSaveStatus = async () => {
    if (!enquiry || saving) return;

    if (status === enquiry.status) {
      setNotice("No status changes to save.");
      setError("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const response = await updateAdminEnquiryStatus(
        enquiry.id,
        status
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to update enquiry status."
        );
      }

      // Use the returned record when available.
      // Otherwise update the status locally.
      const updatedEnquiry = response?.data?.enquiry;

      setEnquiry((previous) => ({
        ...previous,
        ...(updatedEnquiry || {}),
        status: updatedEnquiry?.status || status,
      }));

      setStatus(updatedEnquiry?.status || status);

      setNotice("Enquiry status updated successfully.");
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save enquiry status."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!enquiry || deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this enquiry? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setNotice("");

      const response = await deleteAdminEnquiry(enquiry.id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to delete enquiry."
        );
      }

      navigate("/admin/enquiries", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete enquiry."
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8">
        <Loader2
          size={36}
          className="animate-spin text-[#2A9D8F]"
        />

        <p className="text-sm text-slate-600">
          Loading enquiry details...
        </p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Enquiry Not Available
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
          {error ||
            "This enquiry could not be found or is no longer available."}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={refreshEnquiry}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#17324D]"
          >
            <RefreshCw size={17} />
            Retry
          </button>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Back to Enquiries
          </Link>
        </div>
      </div>
    );
  }

  const replySubject = `Re: ${enquiry.subject || "Your enquiry"}`;

  const replyBody = `Hello ${enquiry.fullName},

Thank you for contacting ViewForMe.

Regarding your enquiry:

"${enquiry.subject || "General enquiry"}"

[Write your response here]

Kind regards,
ViewForMe Support Team`;

  const mailtoLink =
    `mailto:${enquiry.email}` +
    `?subject=${encodeURIComponent(replySubject)}` +
    `&body=${encodeURIComponent(replyBody)}`;

  const whatsappPhone = (() => {
    const phone = (enquiry.phone || "").replace(/\D/g, "");

    if (!phone) return "";

    if (phone.startsWith("0044")) return phone.slice(2);
    if (phone.startsWith("44")) return phone;
    if (phone.startsWith("0")) return `44${phone.slice(1)}`;

    return phone;
  })();

  // WhatsApp direct response
  const whatsappMessage = `Hello ${enquiry.fullName || "Customer"},

Thank you for contacting ViewForMe.

We are reaching out regarding your enquiry:

"${enquiry.subject || "General enquiry"}"

Kind regards,
ViewForMe Support Team`;

  const whatsappLink = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  const hasStatusChanged = status !== enquiry.status;

  return (
    <div className="space-y-8">
      {/* BACK LINK */}
      <Link
        to="/admin/enquiries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Enquiries
      </Link>

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-all text-2xl font-extrabold text-[#17324D] sm:text-3xl">
              Enquiry Details
            </h1>

            <StatusBadge
              status={getStatusLabel(enquiry.status)}
            />
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {enquiry.subject || "No subject"}
          </p>

          <p className="mt-2 break-all text-xs text-slate-400">
            Reference: {enquiry.id}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refreshEnquiry}
            disabled={saving || deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#17324D] hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <a
            href={mailtoLink}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
          >
            <Send size={18} />
            Reply by Email
          </a>

          {/* WhatsApp Direct Response */}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1DA851]"
            >
              <MessageSquare size={18} />
              Reply via WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* SUCCESS NOTICE */}
      {notice && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4"
        >
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-[#2A9D8F]"
          />

          <p className="text-sm leading-7 text-teal-800">
            {notice}
          </p>
        </div>
      )}

      {/* ERROR NOTICE */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-sm leading-7 text-red-800">
            {error}
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* MAIN CONTENT */}
        <div className="space-y-6 xl:col-span-2">
          {/* CUSTOMER INFORMATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <UserRound
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Customer Information
              </h2>
            </div>

            <InfoRow
              label="Name"
              value={enquiry.fullName}
            />

            <InfoRow
              label="Email"
              value={
                enquiry.email ? (
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-[#2A9D8F] hover:underline"
                  >
                    {enquiry.email}
                  </a>
                ) : (
                  "Not provided"
                )
              }
            />

            <InfoRow
              label="Phone"
              value={
                enquiry.phone ? (
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-[#2A9D8F] hover:underline"
                  >
                    {enquiry.phone}
                  </a>
                ) : (
                  "Not provided"
                )
              }
            />
          </section>

          {/* ORIGINAL MESSAGE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <MessageSquare
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Customer Message
              </h2>
            </div>

            <InfoRow
              label="Enquiry Type"
              value={
                ENQUIRY_TYPES[enquiry.enquiryType] ||
                enquiry.enquiryType ||
                "Not specified"
              }
            />

            <InfoRow
              label="Subject"
              value={enquiry.subject || "No subject"}
            />

            <div className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-[#F6F9FA] p-5 text-sm leading-8 text-slate-600">
              {enquiry.message}
            </div>
          </section>

          {/* RESPONSE TRACKING */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <Mail
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Customer Response
              </h2>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              You can respond directly to this customer
              using your email application. The reply
              will include the enquiry subject and a
              prepared message template.
            </p>

            <a
              href={mailtoLink}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#2A9D8F] px-5 py-3 text-sm font-semibold text-[#2A9D8F] hover:bg-[#E8F6F3]"
            >
              <Send size={17} />
              Compose Email Response
            </a>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Opening your email application does not
              automatically send a message or record
              a response in the ViewForMe database.
            </p>
          </section>

          {/* ADMINISTRATION NOTES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Administration Notes
              </h2>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              Administrator assignment, internal notes,
              and response tracking will become available
              when their database fields and API endpoints
              are implemented.
            </p>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* MANAGEMENT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-[#17324D]">
              Enquiry Management
            </h2>

            <label
              htmlFor="enquiry-status"
              className="mb-2 mt-5 block text-sm font-semibold text-[#17324D]"
            >
              Enquiry Status
            </label>

            <select
              id="enquiry-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setNotice("");
                setError("");
              }}
              disabled={saving || deleting}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2A9D8F] disabled:opacity-60"
            >
              {STATUS_OPTIONS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            {hasStatusChanged && (
              <p className="mt-3 text-xs text-amber-700">
                You have an unsaved status change.
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveStatus}
              disabled={
                saving ||
                deleting ||
                !hasStatusChanged
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {saving
                ? "Saving Changes..."
                : "Save Status"}
            </button>

            <p className="mt-3 text-xs leading-6 text-slate-500">
              Status updates are saved directly to
              the ViewForMe database.
            </p>
          </section>

          {/* TIMELINE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays
                size={21}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Enquiry Timeline
              </h2>
            </div>

            <InfoRow
              label="Received"
              value={formatDate(enquiry.createdAt)}
            />

            <InfoRow
              label="Last Updated"
              value={formatDate(enquiry.updatedAt)}
            />

            <InfoRow
              label="Current Status"
              value={getStatusLabel(enquiry.status)}
            />
          </section>

          {/* DELETE */}
          <section className="rounded-2xl border border-red-200 bg-white p-6">
            <h2 className="text-lg font-bold text-red-700">
              Delete Enquiry
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Permanently remove this enquiry from
              ViewForMe. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={18} />
              )}

              {deleting
                ? "Deleting Enquiry..."
                : "Delete Enquiry"}
            </button>
          </section>

          {/* REMINDER */}
          <div className="rounded-2xl bg-[#17324D] p-6 text-white">
            <AlertCircle
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Customer Communication
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Ensure that responses are accurate,
              professional, and consistent with
              ViewForMe's booking, payment,
              and refund policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnquiryDetails;
