
import { useState } from "react";
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

import {
  viewerProfiles,
  viewerAssignmentHistory,
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

  const viewer = viewerProfiles.find(
    (item) => item.id === id
  );

  const [status, setStatus] = useState(
    viewer?.status || "Inactive"
  );

  const [notes, setNotes] = useState(
    viewer?.notes || ""
  );

  const [notice, setNotice] = useState("");

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

  const assignments = viewerAssignmentHistory.filter(
    (assignment) => assignment.viewerId === viewer.id
  );

  const handleValidate = () => {
    setNotice(
      "Demo changes are held in this page's React state only. No viewer record has been updated on a server."
    );
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

            <p className="mt-2 text-xs font-semibold text-amber-700">
              Demo profile — not a real registered viewer
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
            value: viewer.completedViewings,
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
                            to={`/admin/bookings/${assignment.id}`}
                            className="font-semibold text-[#2A9D8F] hover:underline"
                          >
                            {assignment.id}
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
                No assignment history in the demo dataset.
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

            <p className="mt-3 text-xs text-slate-500">
              Demo only. Do not enter real confidential information.
            </p>
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

            <p className="mt-4 text-xs leading-6 text-slate-500">
              In production, account status changes
              will require backend validation and
              should not erase assignment history.
            </p>

            <button
              type="button"
              onClick={handleValidate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
            >
              <Save size={18} />
              Validate Changes
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
