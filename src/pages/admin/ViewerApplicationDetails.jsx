
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
  viewerApplications,
  applicationStatuses,
} from "../../data/adminMockData";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));

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

  const application = viewerApplications.find(
    (item) => item.id === id
  );

  const [status, setStatus] = useState(
    application?.status || "Pending"
  );

  const [reviewNotes, setReviewNotes] = useState(
    application?.reviewNotes || ""
  );

  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!application) return;

    setStatus(application.status);
    setReviewNotes(application.reviewNotes || "");
    setNotice("");
  }, [id]);

  if (!application) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Application Not Found
        </h1>

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

  const updateStatus = (nextStatus) => {
    setStatus(nextStatus);
    setNotice("");
  };

  const handleValidate = () => {
    if (
      ["Approved", "Rejected"].includes(status) &&
      !reviewNotes.trim()
    ) {
      setNotice(
        "Please provide a review note explaining the decision."
      );
      return;
    }

    setNotice(
      `Demo decision: ${status}. The review is only stored in this page's React state. No database record has been updated, and no notification has been sent.`
    );
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
                {application.name}
              </h1>

              <StatusBadge status={status} />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {application.id} • Submitted{" "}
              {formatDate(application.submittedAt)}
            </p>

            <p className="mt-2 text-xs font-semibold text-amber-700">
              Demo application — not a real applicant
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
              value={application.name}
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
              value={application.location}
            />

            <InfoRow
              label="Availability"
              value={application.availability}
            />

            <InfoRow
              label="Transport"
              value={application.transport}
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
              {application.coverageAreas.map((area) => (
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
              }}
              placeholder="Record your assessment and reason for the decision..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
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
              onChange={(event) =>
                updateStatus(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
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
                onClick={() => updateStatus("Approved")}
                className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm font-semibold text-green-800 hover:bg-green-100"
              >
                <CheckCircle2 size={17} />
                Approve
              </button>

              <button
                type="button"
                onClick={() => updateStatus("Rejected")}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-800 hover:bg-red-100"
              >
                <XCircle size={17} />
                Reject
              </button>
            </div>

            <button
              type="button"
              onClick={handleValidate}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
            >
              <Save size={18} />
              Validate Decision
            </button>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              This is a frontend demonstration.
              No application decision is saved or sent.
            </p>
          </section>

          {/* ONBOARDING NOTE */}
          <section className="rounded-2xl bg-[#17324D] p-6 text-white">
            <CheckCircle2
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Approval Is Not Activation
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Approved applicants must complete
              any required identity, availability,
              and operational onboarding checks
              before they become active viewers
              eligible for assignments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ViewerApplicationDetails;
