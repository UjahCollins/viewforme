
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MessageSquare,
  ClipboardList,
  Send,
  Save,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import {
  customerEnquiries,
  enquiryStatuses,
} from "../../data/adminMockData";

const formatDate = (value) => {
  if (!value) return "Not recorded";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
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

  const enquiry = customerEnquiries.find(
    (item) => item.id === id
  );

  const [status, setStatus] = useState(
    enquiry?.status || "New"
  );

  const [assignedTo, setAssignedTo] = useState(
    enquiry?.assignedTo || ""
  );

  const [internalNotes, setInternalNotes] = useState(
    enquiry?.internalNotes || ""
  );

  const [responseNotes, setResponseNotes] = useState(
    enquiry?.responseNotes || ""
  );

  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!enquiry) return;

    setStatus(enquiry.status);
    setAssignedTo(enquiry.assignedTo || "");
    setInternalNotes(enquiry.internalNotes || "");
    setResponseNotes(enquiry.responseNotes || "");
    setNotice("");
  }, [id]);

  if (!enquiry) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Enquiry Not Found
        </h1>

        <Link
          to="/admin/enquiries"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-[#2A9D8F]"
        >
          <ArrowLeft size={17} />
          Back to Enquiries
        </Link>
      </div>
    );
  }

  const replySubject = `Re: ${enquiry.subject}`;

  const replyBody = `Hello ${enquiry.name},

Thank you for contacting ViewForMe.

Regarding your enquiry:

"${enquiry.subject}"

[Write your response here]

Kind regards,
ViewForMe Support Team`;

  const mailtoLink =
    `mailto:${enquiry.email}` +
    `?subject=${encodeURIComponent(replySubject)}` +
    `&body=${encodeURIComponent(replyBody)}`;

  const handleValidate = () => {
    if (
      ["Responded", "Resolved"].includes(status) &&
      !responseNotes.trim()
    ) {
      setNotice(
        "Please record the response or resolution details before validating this status."
      );
      return;
    }

    setNotice(
      `Demo validation completed for status: ${status}. Changes are temporary. No database update or customer notification has occurred.`
    );
  };

  return (
    <div className="space-y-8">
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
            <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
              Enquiry {enquiry.id}
            </h1>

            <StatusBadge status={status} />
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {enquiry.subject}
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-700">
            Demo enquiry — changes are not persisted
          </p>
        </div>

        <a
          href={mailtoLink}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
        >
          <Send size={18} />
          Reply by Email
        </a>
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

      <div className="grid gap-6 xl:grid-cols-3">
        {/* MAIN CONTENT */}
        <div className="space-y-6 xl:col-span-2">
          {/* CUSTOMER */}
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
              value={enquiry.name}
            />

            <InfoRow
              label="Email"
              value={
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {enquiry.email}
                </a>
              }
            />

            <InfoRow
              label="Phone"
              value={
                <a
                  href={`tel:${enquiry.phone}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {enquiry.phone}
                </a>
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

            <p className="text-sm font-semibold text-[#17324D]">
              {enquiry.subject}
            </p>

            <div className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F6F9FA] p-5 text-sm leading-8 text-slate-600">
              {enquiry.message}
            </div>
          </section>

          {/* RESPONSE NOTES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <Mail
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Response Tracking
              </h2>
            </div>

            <label
              htmlFor="response-notes"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Response or Resolution Notes
            </label>

            <textarea
              id="response-notes"
              rows={6}
              value={responseNotes}
              onChange={(event) => {
                setResponseNotes(event.target.value);
                setNotice("");
              }}
              placeholder="Record what was communicated to the customer..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm leading-7 outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
            />

            <p className="mt-3 text-xs leading-6 text-slate-500">
              This field records response information.
              It does not send an email or message.
            </p>
          </section>

          {/* INTERNAL NOTES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Internal Administration Notes
              </h2>
            </div>

            <textarea
              rows={5}
              value={internalNotes}
              onChange={(event) => {
                setInternalNotes(event.target.value);
                setNotice("");
              }}
              placeholder="Add follow-up tasks or internal notes..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
            />

            <p className="mt-3 text-xs text-slate-500">
              Internal notes are not customer-facing.
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
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
            >
              {enquiryStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label
              htmlFor="assigned-admin"
              className="mb-2 mt-5 block text-sm font-semibold text-[#17324D]"
            >
              Assigned Administrator
            </label>

            <input
              id="assigned-admin"
              type="text"
              value={assignedTo}
              onChange={(event) => {
                setAssignedTo(event.target.value);
                setNotice("");
              }}
              placeholder="Enter administrator name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
            />

            <button
              type="button"
              onClick={handleValidate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
            >
              <Save size={18} />
              Validate Changes
            </button>
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
              label="Responded"
              value={formatDate(enquiry.respondedAt)}
            />

            <InfoRow
              label="Resolved"
              value={formatDate(enquiry.resolvedAt)}
            />
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