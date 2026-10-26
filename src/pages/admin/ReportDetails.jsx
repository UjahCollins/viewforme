
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  FileImage,
  ClipboardList,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  X,
  Pencil,
  Save,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import {
  getAdminReportById,
  updateAdminReport,
  approveAdminReport,
  deliverAdminReport,
} from "../../services/adminReportService";

// =============================================
// REPORT STATUS CONFIGURATION
// =============================================

const reportStatuses = [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "DELIVERED",
];

const statusLabels = {
  DRAFT: "Draft",
  SUBMITTED: "Awaiting Review",
  APPROVED: "Ready",
  DELIVERED: "Delivered",
};

// =============================================
// DATE FORMATTER
// =============================================

function formatDate(value) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
}

// =============================================
// INFORMATION ROW
// =============================================

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-5">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-words text-sm font-semibold text-[#17324D] sm:text-right">
        {value ?? "Not available"}
      </span>
    </div>
  );
}

// =============================================
// DELIVERY CONFIRMATION MODAL
// =============================================

function DeliveryConfirmationModal({
  open,
  loading,
  onClose,
  onConfirm,
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmed(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
              <Send size={21} />
            </div>

            <h2
              id="delivery-modal-title"
              className="text-xl font-bold text-[#17324D]"
            >
              Confirm Report Delivery
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600">
          This action will change the report status to{" "}
          <strong>Delivered</strong> and record the
          delivery timestamp.
        </p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            This action does not send an email,
            WhatsApp message, or report file.
            Continue only if the report has already
            been delivered to the customer.
          </p>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) =>
              setConfirmed(event.target.checked)
            }
            disabled={loading}
            className="mt-1 h-4 w-4 accent-[#2A9D8F]"
          />

          <span className="text-sm leading-6 text-[#17324D]">
            I confirm that this report has already
            been delivered to the correct customer.
          </span>
        </label>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!confirmed || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={17} />

            {loading
              ? "Recording..."
              : "Confirm Delivery"}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================

function ReportDetails() {
  const { id } = useParams();

  // -------------------------------------------
  // REPORT STATE
  // -------------------------------------------

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------------------
  // ACTION STATE
  // -------------------------------------------

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [deliveryModalOpen, setDeliveryModalOpen] =
    useState(false);

  // -------------------------------------------
  // EDITING STATE
  // -------------------------------------------

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [reportForm, setReportForm] = useState({
    summary: "",
    observations: "",
    recommendations: "",
    mediaUrls: "",
  });

  // ===========================================
  // FETCH REPORT
  // ===========================================

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");
        setReport(null);
        setActionError("");
        setSuccessMessage("");
        setIsEditing(false);
        setDeliveryModalOpen(false);

        const response = await getAdminReportById(id);

        if (!active) return;

        setReport(response.data);
      } catch (err) {
        if (!active) return;

        setError(
          err.message ||
            "Unable to load report details."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      active = false;
    };
  }, [id]);

  // ===========================================
  // REFRESH REPORT
  // ===========================================

  async function refreshReport() {
    const response = await getAdminReportById(id);

    setReport(response.data);

    return response.data;
  }

  // ===========================================
  // START EDITING
  // ===========================================

  function handleStartEditing() {
    if (
      !report ||
      !["DRAFT", "SUBMITTED"].includes(report.status)
    ) {
      return;
    }

    setReportForm({
      summary: report.summary || "",
      observations: report.observations || "",
      recommendations: report.recommendations || "",
      mediaUrls: Array.isArray(report.mediaUrls)
        ? report.mediaUrls.join("\n")
        : "",
    });

    setActionError("");
    setSuccessMessage("");
    setIsEditing(true);
  }

  // ===========================================
  // CANCEL EDITING
  // ===========================================

  function handleCancelEditing() {
    if (saving) return;

    setIsEditing(false);
    setActionError("");
  }

  // ===========================================
  // FORM INPUT CHANGE
  // ===========================================

  function handleReportFormChange(event) {
    const { name, value } = event.target;

    setReportForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ===========================================
  // SAVE REPORT
  // ===========================================

  async function handleSaveReport(event) {
    event.preventDefault();

    if (
      saving ||
      actionLoading ||
      !report ||
      !["DRAFT", "SUBMITTED"].includes(report.status)
    ) {
      return;
    }

    const mediaUrls = reportForm.mediaUrls
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    // Validate media URLs
    const invalidMediaUrl = mediaUrls.some((url) => {
      try {
        return new URL(url).protocol !== "https:";
      } catch {
        return true;
      }
    });

    if (invalidMediaUrl) {
      setActionError(
        "All media URLs must be valid HTTPS links."
      );
      return;
    }

    if (mediaUrls.length > 30) {
      setActionError(
        "You can provide a maximum of 30 media URLs."
      );
      return;
    }

    const payload = {
      summary: reportForm.summary.trim() || null,
      observations:
        reportForm.observations.trim() || null,
      recommendations:
        reportForm.recommendations.trim() || null,
      mediaUrls,
    };

    try {
      setSaving(true);
      setActionError("");
      setSuccessMessage("");

      await updateAdminReport(id, payload);

      await refreshReport();

      setIsEditing(false);

      setSuccessMessage(
        "Viewing report updated successfully."
      );
    } catch (err) {
      setActionError(
        err.message || "Unable to update report."
      );
    } finally {
      setSaving(false);
    }
  }

  // ===========================================
  // APPROVE REPORT
  // ===========================================

  async function handleApproveReport() {
    if (
      actionLoading ||
      saving ||
      isEditing ||
      report?.status !== "SUBMITTED" ||
      !report?.summary?.trim()
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Approve this viewing report? Confirm that you have reviewed its content."
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      await approveAdminReport(id);

      await refreshReport();

      setSuccessMessage(
        "Viewing report approved successfully."
      );
    } catch (err) {
      setActionError(
        err.message || "Unable to approve report."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ===========================================
  // CONFIRM DELIVERY
  // ===========================================

  async function handleConfirmDelivery() {
    if (
      actionLoading ||
      saving ||
      report?.status !== "APPROVED"
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      await deliverAdminReport(id);

      setDeliveryModalOpen(false);

      await refreshReport();

      setSuccessMessage(
        "Report delivery recorded successfully."
      );
    } catch (err) {
      setActionError(
        err.message ||
          "Unable to record report delivery."
      );

      setDeliveryModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  }

  // ===========================================
  // LOADING STATE
  // ===========================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <Clock3
          size={35}
          className="mx-auto animate-pulse text-[#2A9D8F]"
        />

        <p className="mt-4 text-sm text-slate-500">
          Loading report details...
        </p>
      </div>
    );
  }

  // ===========================================
  // ERROR STATE
  // ===========================================

  if (error || !report) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Unable to Load Report
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          {error || "Report not found."}
        </p>

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

  // ===========================================
  // REPORT DATA
  // ===========================================

  const booking = report.booking;

  const assignment = booking?.assignments?.[0];

  const viewer = assignment?.viewer;
  const customer = booking?.customer;
  const service = booking?.service;

  const location = [
    booking?.propertyAddress,
    booking?.propertyCity,
    booking?.propertyPostcode,
  ]
    .filter(Boolean)
    .join(", ");

  const summary = report.summary?.trim() || "";

  const observations =
    report.observations?.trim() || "";

  const recommendations =
    report.recommendations?.trim() || "";

  const mediaUrls = Array.isArray(report.mediaUrls)
    ? report.mediaUrls
    : [];

  const status = report.status;

  const canEdit = ["DRAFT", "SUBMITTED"].includes(
    status
  );

  // Only summary is mandatory for approval
  const hasRequiredMaterials = summary.length > 0;

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className="space-y-8">
      {/* ===================================== */}
      {/* BACK BUTTON */}
      {/* ===================================== */}

      <Link
        to="/admin/reports"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Reports
      </Link>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
              {report.title || "Viewing Report"}
            </h1>

            <StatusBadge
              status={statusLabels[status] || status}
            />
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {service?.name || "Service not available"}
            {" — "}
            {location || "Location not available"}
          </p>

          <p className="mt-2 break-all text-xs font-medium text-slate-500">
            Report ID: {report.id}
          </p>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-wrap gap-3">
          {canEdit && !isEditing && (
            <button
              type="button"
              onClick={handleStartEditing}
              disabled={actionLoading || saving}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2A9D8F] px-5 py-3 text-sm font-semibold text-[#2A9D8F] hover:bg-[#E8F6F3] disabled:opacity-50"
            >
              <Pencil size={17} />
              Edit Report
            </button>
          )}

          {status === "SUBMITTED" && !isEditing && (
            <button
              type="button"
              onClick={handleApproveReport}
              disabled={
                actionLoading ||
                saving ||
                !hasRequiredMaterials
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={18} />

              {actionLoading
                ? "Approving..."
                : "Approve Report"}
            </button>
          )}

          {status === "APPROVED" && (
            <button
              type="button"
              onClick={() => {
                setActionError("");
                setDeliveryModalOpen(true);
              }}
              disabled={actionLoading || saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Send size={18} />
              Confirm Delivery
            </button>
          )}
        </div>
      </div>

      {/* ===================================== */}
      {/* SUCCESS MESSAGE */}
      {/* ===================================== */}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4"
        >
          <CheckCircle2
            size={20}
            className="shrink-0 text-green-700"
          />

          <p className="text-sm text-green-800">
            {successMessage}
          </p>
        </div>
      )}

      {/* ===================================== */}
      {/* ERROR MESSAGE */}
      {/* ===================================== */}

      {actionError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle
            size={20}
            className="shrink-0 text-red-700"
          />

          <p className="text-sm text-red-800">
            {actionError}
          </p>
        </div>
      )}

      {/* ===================================== */}
      {/* EDIT REPORT FORM */}
      {/* ===================================== */}

      {isEditing && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#17324D]">
              Edit Viewing Report
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Update the report information before
              approval. Observations, recommendations,
              and media URLs are optional.
            </p>
          </div>

          <form
            onSubmit={handleSaveReport}
            className="space-y-6"
          >
            {/* SUMMARY */}

            <div>
              <label
                htmlFor="report-summary"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Report Summary
                <span className="ml-2 text-xs font-normal text-slate-500">
                  Required for approval
                </span>
              </label>

              <textarea
                id="report-summary"
                name="summary"
                rows={5}
                value={reportForm.summary}
                onChange={handleReportFormChange}
                maxLength={10000}
                placeholder="Enter a summary of the completed viewing..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
              />
            </div>

            {/* OBSERVATIONS */}

            <div>
              <label
                htmlFor="report-observations"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Observations (Optional)
              </label>

              <textarea
                id="report-observations"
                name="observations"
                rows={5}
                value={reportForm.observations}
                onChange={handleReportFormChange}
                maxLength={20000}
                placeholder="Enter observations recorded during the inspection..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
              />
            </div>

            {/* RECOMMENDATIONS */}

            <div>
              <label
                htmlFor="report-recommendations"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Recommendations (Optional)
              </label>

              <textarea
                id="report-recommendations"
                name="recommendations"
                rows={4}
                value={reportForm.recommendations}
                onChange={handleReportFormChange}
                maxLength={10000}
                placeholder="Enter any recommendations..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
              />
            </div>

            {/* MEDIA URLS */}

            <div>
              <label
                htmlFor="report-media"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Media URLs (Optional)
              </label>

              <textarea
                id="report-media"
                name="mediaUrls"
                rows={4}
                value={reportForm.mediaUrls}
                onChange={handleReportFormChange}
                placeholder={
                  "https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter one HTTPS URL per line.
                Maximum 30 URLs.
              </p>
            </div>

            {/* FORM ACTIONS */}

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Report"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ===================================== */}
      {/* REPORT CONTENT */}
      {/* ===================================== */}

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
                booking?.id ? (
                  <Link
                    to={`/admin/bookings/${booking.id}`}
                    className="text-[#2A9D8F] hover:underline"
                  >
                    {booking.reference}
                  </Link>
                ) : (
                  "Not available"
                )
              }
            />

            <InfoRow
              label="Customer"
              value={customer?.fullName}
            />

            <InfoRow
              label="Customer Email"
              value={customer?.email}
            />

            <InfoRow
              label="Assigned Viewer"
              value={
                viewer?.fullName || "Not assigned"
              }
            />

            <InfoRow
              label="Service"
              value={service?.name}
            />

            <InfoRow
              label="Location"
              value={location || "Not available"}
            />

            <InfoRow
              label="Viewing Date"
              value={formatDate(
                booking?.preferredDate
              )}
            />

            <InfoRow
              label="Preferred Time"
              value={booking?.preferredTime}
            />

            <InfoRow
              label="Report Created"
              value={formatDate(report.createdAt)}
            />

            <InfoRow
              label="Last Updated"
              value={formatDate(report.updatedAt)}
            />
          </section>

          {/* SUMMARY */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Report Summary
            </h2>

            {summary ? (
              <div className="rounded-xl bg-[#F6F9FA] p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {summary}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No report summary has been recorded.
              </p>
            )}
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

            {observations ? (
              <div className="rounded-xl bg-[#F6F9FA] p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {observations}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No observations have been recorded.
              </p>
            )}

            {recommendations && (
              <div className="mt-5 rounded-xl bg-[#F6F9FA] p-5">
                <h3 className="font-bold text-[#17324D]">
                  Recommendations
                </h3>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {recommendations}
                </p>
              </div>
            )}
          </section>

          {/* MEDIA */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <FileImage
                size={21}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Viewing Media
              </h2>
            </div>

            <p className="mb-6 text-sm text-slate-500">
              Photographs and videos associated
              with this viewing report.
            </p>

            {mediaUrls.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {mediaUrls.map((url, index) => {
                  let safeUrl = null;

                  try {
                    const parsedUrl = new URL(url);

                    if (
                      parsedUrl.protocol === "https:"
                    ) {
                      safeUrl = parsedUrl.href;
                    }
                  } catch {
                    safeUrl = null;
                  }

                  return (
                    <div
                      key={`${url}-${index}`}
                      className="rounded-xl border border-slate-200 p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                        <FileImage size={24} />
                      </div>

                      <p className="mt-4 font-semibold text-[#17324D]">
                        Media {index + 1}
                      </p>

                      {safeUrl ? (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F] hover:underline"
                        >
                          View Media
                          <ExternalLink size={15} />
                        </a>
                      ) : (
                        <p className="mt-3 text-xs text-amber-700">
                          Media link unavailable.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-[#F6F9FA] p-6 text-center text-sm text-slate-500">
                No media files have been uploaded.
              </div>
            )}

            <p className="mt-5 text-xs leading-6 text-slate-500">
              Media access must be restricted
              to authorized users before production.
            </p>
          </section>
        </div>

        {/* =================================== */}
        {/* SIDEBAR */}
        {/* =================================== */}

        <div className="space-y-6">
          {/* REPORT MANAGEMENT */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-[#17324D]">
              Report Management
            </h2>

            <p className="mb-2 mt-5 text-sm font-semibold text-[#17324D]">
              Current Report Status
            </p>

            <StatusBadge
              status={statusLabels[status] || status}
            />

            <div className="mt-5">
              <label
                htmlFor="report-status"
                className="mb-2 block text-sm font-semibold text-[#17324D]"
              >
                Report Status
              </label>

              <select
                id="report-status"
                value={status}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              >
                {reportStatuses.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {statusLabels[item]}
                  </option>
                ))}
              </select>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                Status changes are managed through
                approval and delivery actions.
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <InfoRow
                label="Reviewed"
                value={
                  report.reviewedAt
                    ? "Yes"
                    : "Not yet"
                }
              />

              <InfoRow
                label="Review Date"
                value={formatDate(
                  report.reviewedAt
                )}
              />
            </div>

            {/* REPORT READINESS */}

            <div className="mt-5 rounded-xl bg-[#F6F9FA] p-4">
              <div className="flex items-center gap-2">
                {hasRequiredMaterials ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />
                ) : (
                  <AlertCircle
                    size={18}
                    className="text-amber-600"
                  />
                )}

                <p className="text-sm font-semibold text-[#17324D]">
                  Report Readiness
                </p>
              </div>

              <p className="mt-2 text-xs leading-6 text-slate-600">
                {hasRequiredMaterials
                  ? "Report summary is available. The report meets the content requirement for approval."
                  : "A report summary must be provided before approval."}
              </p>
            </div>

            {canEdit && !isEditing && (
              <button
                type="button"
                onClick={handleStartEditing}
                disabled={actionLoading || saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2A9D8F] px-5 py-3 text-sm font-semibold text-[#2A9D8F] disabled:opacity-50"
              >
                <Pencil size={17} />
                Edit Report
              </button>
            )}
          </section>

          {/* CUSTOMER DELIVERY */}

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
              label="Delivery Status"
              value={
                status === "DELIVERED"
                  ? "Delivered"
                  : "Not delivered"
              }
            />

            <InfoRow
              label="Delivery Method"
              value="Not recorded"
            />

            <InfoRow
              label="Recorded Delivery"
              value={formatDate(
                report.deliveredAt
              )}
            />

            {status === "APPROVED" && (
              <button
                type="button"
                onClick={() => {
                  setActionError("");
                  setDeliveryModalOpen(true);
                }}
                disabled={actionLoading || saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Send size={17} />
                Confirm Delivery
              </button>
            )}

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Confirm Delivery records an already
              completed delivery. It does not send
              the report to the customer.
            </p>
          </section>

          {/* QUALITY CHECK */}

          <div className="rounded-2xl bg-[#17324D] p-6 text-white">
            <AlertCircle
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Report Quality Check
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Before approving or delivering a report,
              verify that its content corresponds
              to the correct property and booking.
              Ensure that all information accurately
              reflects the completed inspection.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* DELIVERY CONFIRMATION MODAL */}
      {/* ===================================== */}

      <DeliveryConfirmationModal
        open={deliveryModalOpen}
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) {
            setDeliveryModalOpen(false);
          }
        }}
        onConfirm={handleConfirmDelivery}
      />
    </div>
  );
}

export default ReportDetails;
