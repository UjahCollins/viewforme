
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  MapPin,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";


import {
  getAdminViewerApplicationById,
  markViewerApplicationUnderReview,
  approveViewerApplication,
  rejectViewerApplication,
} from "../../services/adminViewerApplicationService.js";

const applicationStatuses = [
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

const formatStatus = (status) => ({
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
}[status] || status);

const formatAvailability = (value) => ({
  weekdays: "Weekdays",
  weekends: "Weekends",
  both: "Weekdays and Weekends",
  flexible: "Flexible",
}[value] || "Not provided");

const formatTransport = (value) => ({
  "own-vehicle": "Own Vehicle",
  "public-transport": "Public Transport",
  "walking-cycling": "Walking / Cycling",
  other: "Other Arrangements",
}[value] || "Not provided");


const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

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

function ViewerApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [reviewNotes, setReviewNotes] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  
useEffect(() => {
  let cancelled = false;

  async function loadApplication() {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await getAdminViewerApplicationById(id);

      if (cancelled) return;

      if (!response.success || !response.data) {
        throw new Error("Application could not be loaded.");
      }

      setApplication(response.data);
      setStatus(response.data.status);
      setReviewNotes(response.data.reviewNotes || "");
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Unable to load application.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadApplication();

  return () => {
    cancelled = true;
  };
}, [id]);


const updateStatus = (nextStatus) => {
  if (saving) return;

  setStatus(nextStatus);
  setNotice("");
  setError("");
};


if (loading) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
      <p className="text-sm font-medium text-slate-600">
        Loading application details...
      </p>
    </div>
  );
}

if (!application) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
      <AlertCircle
        size={40}
        className="mx-auto text-amber-500"
      />

      <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
        Application Unavailable
      </h1>

      <p className="mt-3 text-sm text-slate-600">
        {error || "The requested application could not be found."}
      </p>

      <Link
        to="/admin/viewer-applications"
        className="mt-6 inline-flex items-center gap-2 font-semibold text-[#2A9D8F]"
      >
        <ArrowLeft size={17} />
        Back to Applications
      </Link>
    </div>
  );
}

  
const handleValidate = async () => {
  if (saving || !application) return;

  // Prevent changing applications with final decisions
  if (["APPROVED", "REJECTED"].includes(application.status)) {
    setError("This application has already received a final decision.");
    return;
  }

  // Ensure the admin has selected a different status
  if (status === application.status) {
    setError("Please select a different application status.");
    return;
  }

  // Prevent returning an application to Pending
  if (status === "PENDING") {
    setError("An application cannot be returned to Pending.");
    return;
  }

  // A rejection must include an explanation
  if (status === "REJECTED" && reviewNotes.trim().length < 5) {
    setError("Please provide a rejection reason of at least 5 characters.");
    return;
  }

  // Prevent unsupported status transitions
  if (!["UNDER_REVIEW", "APPROVED", "REJECTED"].includes(status)) {
    setError("Invalid application status.");
    return;
  }

  // Confirmation before making changes
  const actionLabels = {
    UNDER_REVIEW: "mark this application as Under Review",
    APPROVED: "approve this application and create an active viewer",
    REJECTED: "reject this application",
  };

  const confirmed = window.confirm(
    `Are you sure you want to ${actionLabels[status]}?`
  );

  if (!confirmed) return;

  
setSaving(true);
setError("");
setNotice("");

try {
  let response;

  if (status === "UNDER_REVIEW") {
    response = await markViewerApplicationUnderReview(
      id,
      reviewNotes.trim()
    );
  } else if (status === "APPROVED") {
    response = await approveViewerApplication(
      id,
      reviewNotes.trim()
    );
  } else if (status === "REJECTED") {
    response = await rejectViewerApplication(
      id,
      reviewNotes.trim()
    );
  }

  if (!response?.success) {
    throw new Error(response?.message || "Unable to save decision.");
  }

  const updatedResponse = await getAdminViewerApplicationById(id);

  if (!updatedResponse.success || !updatedResponse.data) {
    throw new Error("Decision saved, but application refresh failed.");
  }

  setApplication(updatedResponse.data);
  setStatus(updatedResponse.data.status);
  setReviewNotes(updatedResponse.data.reviewNotes || "");

  setNotice(
    `Application successfully updated to ${formatStatus(
      updatedResponse.data.status
    )}.`
  );
} catch (err) {
  setError(err.message || "Unable to save application decision.");
} finally {
  setSaving(false);
}

};




  return (
    <div className="space-y-8">
      <Link
        to="/admin/viewer-applications"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Applications
      </Link>

      {/* HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F]">
            <UserRound size={38} />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#17324D]">
                {application.fullName}
              </h1>

              <StatusBadge status={formatStatus(application.status)} />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {application.id} • Submitted{" "}
              {formatDate(application.createdAt)}
            </p>

           
          </div>
        </div>
      </section>

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


{error && (
  <div
    role="alert"
    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
  >
    <AlertCircle
      size={20}
      className="mt-0.5 shrink-0 text-red-600"
    />

    <p className="text-sm leading-7 text-red-700">
      {error}
    </p>
  </div>
)}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* LEFT CONTENT */}
        <div className="space-y-6 xl:col-span-2">
          {/* APPLICANT DETAILS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Applicant Information
            </h2>

            <InfoRow
              label="Full Name"
              value={application.fullName}
            />

            <InfoRow
              label="Email Address"
              value={
                <a
                  href={`mailto:${application.email}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {application.email}
                </a>
              }
            />

            <InfoRow
              label="Phone Number"
              value={
                <a
                  href={`tel:${application.phone}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {application.phone}
                </a>
              }
            />

            <InfoRow
              label="Primary Location"
              value={application.city}
            />

            <InfoRow
              label="Availability"
              value={formatAvailability(application.availability)}
            />

            <InfoRow
              label="Transport"
              value={formatTransport(application.transport)}
            />
          </section>

          {/* COVERAGE AREAS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <MapPin
                size={21}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Coverage Areas
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(application.coverageAreas || []).map((area) => (
                <span
                  key={area}
                  className="rounded-xl bg-[#E8F6F3] px-4 py-2 text-sm font-semibold text-[#2A9D8F]"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList
                size={21}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Experience & Motivation
              </h2>
            </div>

            <h3 className="text-sm font-semibold text-[#17324D]">
              Relevant Experience
            </h3>

            <p className="mt-3 rounded-xl bg-[#F6F9FA] p-4 text-sm leading-7 text-slate-600">
              {application.experience}
            </p>

            <h3 className="mt-6 text-sm font-semibold text-[#17324D]">
              Why They Want to Join
            </h3>

            <p className="mt-3 rounded-xl bg-[#F6F9FA] p-4 text-sm leading-7 text-slate-600">
              {application.motivation}
            </p>
          </section>

          {/* REVIEW NOTES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Internal Review Notes
            </h2>

            <label
              htmlFor="review-notes"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Administrator's Assessment
            </label>

            
<textarea
  id="review-notes"
  rows={6}
  value={reviewNotes}
  onChange={(event) => {
    setReviewNotes(event.target.value);
    setNotice("");
    setError("");
  }}
  disabled={
    saving ||
    ["APPROVED", "REJECTED"].includes(application.status)
  }
  placeholder="Record your assessment and reason for the decision..."
  className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
/>


            <p className="mt-3 text-xs leading-6 text-slate-500">
              These notes are for internal administration.
              They are not automatically shared with applicants.
            </p>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* DECISION PANEL */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-[#17324D]">
              Application Review
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              Review the applicant's information before
              recording a decision.
            </p>

            <label
              htmlFor="review-status"
              className="mb-2 mt-6 block text-sm font-semibold text-[#17324D]"
            >
              Application Status
            </label>

          
<select
  id="review-status"
  value={status}
  onChange={(event) => updateStatus(event.target.value)}
  disabled={
    saving ||
    ["APPROVED", "REJECTED"].includes(application.status)
  }
  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2A9D8F] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
>

              {applicationStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* QUICK DECISION BUTTONS */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
  type="button"
  onClick={() => updateStatus("APPROVED")}
  disabled={
    saving ||
    ["APPROVED", "REJECTED"].includes(application.status)
  }
  className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm font-semibold text-green-800 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
>
                <CheckCircle2 size={17} />
                Approve
              </button>

              
<button
  type="button"
  onClick={() => updateStatus("REJECTED")}
  disabled={
    saving ||
    ["APPROVED", "REJECTED"].includes(application.status)
  }
  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
>

                <XCircle size={17} />
                Reject
              </button>
            </div>

           
<button
  type="button"
  onClick={handleValidate}
  disabled={
    saving ||
    ["APPROVED", "REJECTED"].includes(application.status)
  }
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
>
  <Save size={18} />
  {saving ? "Saving Decision..." : "Validate Decision"}
</button>


          </section>

          {/* ONBOARDING NOTE */}
          
{/* VIEWER ACTIVATION INFORMATION */}
<section className="rounded-2xl bg-[#17324D] p-6 text-white">
  <CheckCircle2
    size={25}
    className="text-[#78D6C9]"
  />

  <h3 className="mt-4 text-lg font-bold">
    Viewer Approval & Activation
  </h3>

  <p className="mt-3 text-sm leading-7 text-slate-200">
    Approving an application automatically creates an
    active viewer account in the ViewForMe system.
  </p>

  <p className="mt-3 text-sm leading-7 text-slate-200">
    Approved viewers can be managed through the
    Viewers section of the admin dashboard.
    Applications that are pending or under review
    do not create viewer accounts.
  </p>

  {application.status === "APPROVED" && (
    <div className="mt-5 rounded-xl border border-teal-400/30 bg-teal-400/10 p-4">
      <p className="text-sm font-semibold text-[#78D6C9]">
        Application Approved
      </p>

      <p className="mt-2 text-xs leading-6 text-slate-200">
        A viewer record has been created successfully.
        You can manage this viewer from the admin
        dashboard.
      </p>
    </div>
  )}
</section>

        </div>
      </div>
    </div>
  );
}

export default ViewerApplicationDetails;
