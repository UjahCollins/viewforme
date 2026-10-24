
import { useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Car,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminViewerById, updateAdminViewer, updateAdminViewerStatus,} from "../../services/adminViewerService";


const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};


function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-words text-sm font-semibold text-[#17324D] sm:text-right">
        {value}
      </span>
    </div>
  );
}

function ViewerDetails() {
  const { id } = useParams();

 
const [viewer, setViewer] = useState(null);
const [status, setStatus] = useState("Active");
const [notes, setNotes] = useState("");
const [notice, setNotice] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

useEffect(() => {
  let cancelled = false;

  const fetchViewer = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminViewerById(id);

      if (cancelled) return;

      if (!response.success || !response.data) {
        throw new Error("Unable to retrieve viewer details.");
      }

      const data = response.data;

      const formattedViewer = {
        ...data,
        name: data.fullName || "Unknown Viewer",
        location: data.city || "Not provided",
        coverageAreas: data.coverageAreas || [],
        availability: ({
          weekdays: "Weekdays",
          weekends: "Weekends",
          both: "Weekdays and Weekends",
          flexible: "Flexible",
        })[data.availability?.toLowerCase()] || "Not provided",
        transport: ({
          "own-vehicle": "Own Vehicle",
          "public-transport": "Public Transport",
          "walking-cycling": "Walking / Cycling",
          other: "Other Arrangements",
        })[data.transport?.toLowerCase()] || "Not provided",
        joinedAt: data.createdAt,
        
totalAssignments: data._count?.assignments ?? 0,

completedViewings: Array.isArray(data.assignments)
  ? data.assignments.filter(
      (assignment) => assignment.status === "COMPLETED"
    ).length
  : 0,

assignments: Array.isArray(data.assignments)
  ? data.assignments.map((assignment) => ({
      id: assignment.id,
      bookingId: assignment.booking?.id,
      reference: assignment.booking?.reference ?? "N/A",
      service: assignment.booking?.service?.name ?? "Unknown Service",
      location: [
        assignment.booking?.propertyAddress,
        assignment.booking?.propertyCity,
      ]
        .filter(Boolean)
        .join(", "),
      date: assignment.assignedAt,
      preferredDate: assignment.booking?.preferredDate,
      status: assignment.status,
      completedAt: assignment.completedAt,
    }))
  : [],

      };

      setViewer(formattedViewer);

      setStatus(
        data.status
          ? data.status.charAt(0).toUpperCase() +
              data.status.slice(1).toLowerCase()
          : "Inactive"
      );

      setNotes(data.notes || "");
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Unable to load viewer.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchViewer();

  return () => {
    cancelled = true;
  };
}, [id]);


if (loading) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600">
      Loading viewer details...
    </div>
  );
}


  if (!viewer) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={38}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Viewer Not Found
        </h1>

        {error && (
  <p className="mt-3 text-sm text-red-600">
    {error}
  </p>
)}

        <Link
          to="/admin/viewers"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F]"
        >
          <ArrowLeft size={17} />
          Back to Viewers
        </Link>
      </div>
    );
  }

const assignments = viewer.assignments ?? [];
console.log("VIEWER ASSIGNMENTS:", assignments);

  
const handleValidate = async () => {
  if (!viewer || saving) return;

  const nextStatus = status.toUpperCase();
  const currentStatus = viewer.status?.toUpperCase();

  const statusChanged = nextStatus !== currentStatus;
  const notesChanged = notes !== (viewer.notes ?? "");

  if (!statusChanged && !notesChanged) {
    setNotice("No changes to save.");
    return;
  }

  if (
    !window.confirm(
      "Are you sure you want to save these viewer changes?"
    )
  ) {
    return;
  }

  setSaving(true);
  setNotice("");

  try {
    if (notesChanged) {
      await updateAdminViewer(viewer.id, {
        notes: notes.trim() || null,
      });
    }

    if (statusChanged) {
      await updateAdminViewerStatus(
        viewer.id,
        nextStatus
      );
    }

    const response = await getAdminViewerById(viewer.id);

    if (!response.success || !response.data) {
      throw new Error("Unable to refresh viewer details.");
    }

    const updatedViewer = response.data;

    setViewer((previous) => ({
      ...previous,
      ...updatedViewer,
    }));

    setStatus(
      updatedViewer.status.charAt(0).toUpperCase() +
        updatedViewer.status.slice(1).toLowerCase()
    );

    setNotes(updatedViewer.notes ?? "");
    setNotice("Viewer changes saved successfully.");
  } catch (error) {
    setNotice(
      error.message ||
        "Unable to save viewer changes. Please try again."
    );
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="space-y-8">
      <Link
        to="/admin/viewers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Viewers
      </Link>

      {/* PROFILE HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F]">
            <UserRound size={38} />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#17324D]">
                {viewer.name}
              </h1>

              <StatusBadge status={status} />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {viewer.id} • {viewer.location}
            </p>
          </div>
        </div>
      </section>

      {/* NOTICE */}
      {notice && (
        <div
          role="status"
          className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
        >
          {notice}
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          {
            label: "Total Assignments",
            value: viewer.totalAssignments,
          },
          {
  label: "Completed Viewings",
  value: "—",
},
          {
            label: "Coverage Areas",
            value: viewer.coverageAreas.length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-sm text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-extrabold text-[#17324D]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* PERSONAL INFORMATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Viewer Information
            </h2>

            <InfoRow
              label="Full Name"
              value={viewer.name}
            />

            <InfoRow
              label="Email"
              value={
                <a
                  href={`mailto:${viewer.email}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {viewer.email}
                </a>
              }
            />

            <InfoRow
              label="Phone"
              value={
                <a
                  href={`tel:${viewer.phone}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {viewer.phone}
                </a>
              }
            />

            <InfoRow
              label="Primary Location"
              value={viewer.location}
            />

            <InfoRow
              label="Availability"
              value={viewer.availability}
            />

            <InfoRow
              label="Transport"
              value={viewer.transport}
            />

            <InfoRow
              label="Joined"
              value={formatDate(viewer.joinedAt)}
            />
          </section>

          {/* COVERAGE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Coverage Areas
            </h2>

            <div className="flex flex-wrap gap-2">
              {viewer.coverageAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-xl bg-[#E8F6F3] px-4 py-2 text-sm font-semibold text-[#2A9D8F]"
                >
                  {area}
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              These areas represent the viewer's
              stated geographical coverage.
              Individual appointment availability
              must still be confirmed.
            </p>
          </section>

          {/* ASSIGNMENT HISTORY */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-lg font-bold text-[#17324D]">
                Assignment History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sample bookings associated with this viewer
              </p>
            </div>

            {assignments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-[#F6F9FA]">
                    <tr className="text-xs font-semibold uppercase text-slate-500">
                      <th className="px-5 py-4">Booking</th>
                      <th className="px-5 py-4">Service</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {assignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        className="text-sm text-slate-600"
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/admin/bookings/${assignment.bookingId}`}
                            className="font-semibold text-[#2A9D8F] hover:underline"
                          >
                            {assignment.reference}
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          {assignment.service}
                        </td>

                        <td className="px-5 py-4">
                          {assignment.location}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {formatDate(assignment.date)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={assignment.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="p-6 text-sm text-slate-500">
                No assignments have been recorded for this viewer yet.
              </p>
            )}
          </section>

          {/* NOTES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Internal Notes
            </h2>

            <textarea
              rows={5}
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setNotice("");
              }}
              placeholder="Add internal notes about this viewer..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
            />
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#17324D]">
              Account Management
            </h2>

            <label
              htmlFor="viewer-account-status"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Account Status
            </label>

            <select
              id="viewer-account-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setNotice("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            
<button
  type="button"
  onClick={handleValidate}
  disabled={saving}
  className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Saving Changes..." : "Save Changes"}
</button>

          </section>

          <div className="rounded-2xl bg-[#17324D] p-6 text-white">
            <CheckCircle2
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Viewer Coordination
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Before assigning a viewer, confirm
              that they are active, cover the
              requested location, and are
              available for the appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewerDetails;
