
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  FileImage,
  Image as ImageIcon,
  Video,
  ClipboardList,
  Send,
  AlertCircle,
  CheckCircle2,
  Save,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import {
  viewingReports,
  reportStatuses,
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
        {value || "Not available"}
      </span>
    </div>
  );
}

function ReportDetails() {
  const { id } = useParams();

  const report = viewingReports.find(
    (item) => item.id === id
  );

  const [status, setStatus] = useState(
    report?.status || "Awaiting Materials"
  );

  const [summary, setSummary] = useState(
    report?.summary || ""
  );

  const [adminNotes, setAdminNotes] = useState(
    report?.adminNotes || ""
  );

  const [deliveryReference, setDeliveryReference] = useState(
    report?.deliveryReference || ""
  );

  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!report) return;

    setStatus(report.status);
    setSummary(report.summary || "");
    setAdminNotes(report.adminNotes || "");
    setDeliveryReference(report.deliveryReference || "");
    setNotice("");
  }, [id]);

  if (!report) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Report Not Found
        </h1>

        <Link
          to="/admin/reports"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-[#2A9D8F]"
        >
          <ArrowLeft size={17} />
          Back to Reports
        </Link>
      </div>
    );
  }

  const receivedMedia = report.media.filter(
    (item) => item.received
  );

  const outstandingMedia = report.media.filter(
    (item) => !item.received
  );

  const canMarkReady =
    summary.trim().length > 0 &&
    report.observations.length > 0 &&
    receivedMedia.length > 0 &&
    outstandingMedia.length === 0;

  const handleValidate = () => {
    if (
      ["Ready", "Delivered"].includes(status) &&
      !canMarkReady
    ) {
      setNotice(
        "A report cannot be marked ready until it has a summary, observations, received media, and no outstanding listed materials."
      );
      return;
    }

    if (
      status === "Delivered" &&
      !deliveryReference.trim()
    ) {
      setNotice(
        "Please enter a delivery reference or confirmation note before marking the report as delivered."
      );
      return;
    }

    setNotice(
      `Demo validation completed for status: ${status}. No database update or customer delivery has occurred.`
    );
  };

  return (
    <div className="space-y-8">
      <Link
        to="/admin/reports"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Reports
      </Link>

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
              Report {report.id}
            </h1>

            <StatusBadge status={status} />
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {report.service} — {report.location}
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-700">
            Frontend demonstration — no live media or delivery
          </p>
        </div>

        <button
          type="button"
          onClick={handleValidate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
        >
          <Save size={18} />
          Validate Changes
        </button>
      </div>

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
          {/* REPORT INFORMATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <FileImage
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Report Information
              </h2>
            </div>

            <InfoRow
              label="Report ID"
              value={report.id}
            />

            <InfoRow
              label="Booking"
              value={
                <Link
                  to={`/admin/bookings/${report.bookingId}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {report.bookingId}
                </Link>
              }
            />

            <InfoRow
              label="Customer"
              value={report.customer}
            />

            <InfoRow
              label="Assigned Viewer"
              value={report.viewer}
            />

            <InfoRow
              label="Service"
              value={report.service}
            />

            <InfoRow
              label="Location"
              value={report.location}
            />

            <InfoRow
              label="Viewing Date"
              value={formatDate(report.viewingDate)}
            />

            <InfoRow
              label="Submitted"
              value={formatDate(report.submittedAt)}
            />
          </section>

          {/* REPORT SUMMARY */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Report Summary
            </h2>

            <label
              htmlFor="report-summary"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Inspection Summary
            </label>

            <textarea
              id="report-summary"
              rows={6}
              value={summary}
              onChange={(event) => {
                setSummary(event.target.value);
                setNotice("");
              }}
              placeholder="Enter the viewing summary..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm leading-7 outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
            />

            <p className="mt-3 text-xs leading-6 text-slate-500">
              Keep observations factual. Avoid
              unsupported claims about structural
              safety, legal compliance, or property value.
            </p>
          </section>

          {/* OBSERVATIONS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList
                size={21}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Viewer Observations
              </h2>
            </div>

            {report.observations.length > 0 ? (
              <div className="space-y-4">
                {report.observations.map((observation) => (
                  <div
                    key={observation.title}
                    className="rounded-xl bg-[#F6F9FA] p-5"
                  >
                    <h3 className="font-bold text-[#17324D]">
                      {observation.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {observation.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No observations have been recorded.
              </p>
            )}
          </section>

          {/* MEDIA */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-2 text-lg font-bold text-[#17324D]">
              Viewing Media
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Metadata for photographs and videos
              expected from the viewer.
            </p>

            {report.media.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {report.media.map((item) => {
                  const Icon =
                    item.type === "Video"
                      ? Video
                      : ImageIcon;

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                        <Icon size={24} />
                      </div>

                      <p className="mt-4 font-semibold text-[#17324D]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.type}
                      </p>

                      <div className="mt-4">
                        {item.received ? (
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={15} />
                            Marked as received
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-700">
                            Awaiting material
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-[#F6F9FA] p-6 text-center text-sm text-slate-500">
                No media items recorded yet.
              </div>
            )}

            <p className="mt-5 text-xs leading-6 text-slate-500">
              These are demonstration metadata records.
              There are no files to preview or download.
              Actual media storage will be implemented
              during backend development.
            </p>
          </section>

          {/* ADMIN NOTES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Internal Review Notes
            </h2>

            <textarea
              rows={5}
              value={adminNotes}
              onChange={(event) => {
                setAdminNotes(event.target.value);
                setNotice("");
              }}
              placeholder="Record review comments or follow-up actions..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
            />
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* STATUS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-[#17324D]">
              Report Management
            </h2>

            <label
              htmlFor="report-status"
              className="mb-2 mt-5 block text-sm font-semibold text-[#17324D]"
            >
              Report Status
            </label>

            <select
              id="report-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setNotice("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
            >
              {reportStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleValidate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
            >
              <Save size={18} />
              Validate Changes
            </button>
          </section>

          {/* DELIVERY */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Send
                size={21}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Customer Delivery
              </h2>
            </div>

            <InfoRow
              label="Method"
              value={report.deliveryMethod}
            />

            <InfoRow
              label="Recorded Delivery"
              value={formatDate(report.deliveredAt)}
            />

            <label
              htmlFor="delivery-reference"
              className="mb-2 mt-5 block text-sm font-semibold text-[#17324D]"
            >
              Delivery Confirmation Note
            </label>

            <textarea
              id="delivery-reference"
              rows={3}
              value={deliveryReference}
              onChange={(event) => {
                setDeliveryReference(event.target.value);
                setNotice("");
              }}
              placeholder="Record how delivery was confirmed..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2A9D8F]"
            />

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Selecting Delivered does not send a
              WhatsApp message. It only validates
              the demonstration form.
            </p>
          </section>

          {/* OPERATIONAL NOTE */}
          <div className="rounded-2xl bg-[#17324D] p-6 text-white">
            <AlertCircle
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Report Quality Check
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Before delivering a report, verify
              that the submitted materials correspond
              to the correct property and booking,
              and that observations accurately
              reflect what the viewer documented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetails;
