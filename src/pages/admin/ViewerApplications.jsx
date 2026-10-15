
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  MapPin,
  CalendarDays,
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

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
          <Icon size={21} />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-extrabold text-[#17324D]">
        {value}
      </h3>
    </div>
  );
}

function ViewerApplications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const locations = [
    ...new Set(
      viewerApplications.map((item) => item.location)
    ),
  ].sort();

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return viewerApplications.filter((application) => {
      const matchesSearch =
        !query ||
        [
          application.id,
          application.name,
          application.email,
          application.location,
        ].some((value) =>
          value.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const matchesLocation =
        locationFilter === "All" ||
        application.location === locationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation
      );
    });
  }, [search, statusFilter, locationFilter]);

  const total = viewerApplications.length;

  const pending = viewerApplications.filter(
    (item) =>
      item.status === "Pending" ||
      item.status === "Under Review"
  ).length;

  const approved = viewerApplications.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejected = viewerApplications.filter(
    (item) => item.status === "Rejected"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setLocationFilter("All");
  };

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
          Viewer Applications
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Review and manage applications from prospective
          ViewForMe property viewers.
        </p>

        <p className="mt-2 text-xs font-semibold text-amber-700">
          Demo data — no live applications
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Applications"
          value={total}
          icon={ClipboardList}
        />

        <SummaryCard
          title="Awaiting Decision"
          value={pending}
          icon={Clock3}
        />

        <SummaryCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Rejected"
          value={rejected}
          icon={XCircle}
        />
      </div>

      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[#2A9D8F]" />

            <h2 className="text-lg font-bold text-[#17324D]">
              Search & Filter Applications
            </h2>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F] hover:underline"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by applicant name, email, or application ID..."
            aria-label="Search viewer applications"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="application-status"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Application Status
            </label>

            <select
              id="application-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Statuses</option>

              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="application-location"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Primary Location
            </label>

            <select
              id="application-location"
              value={locationFilter}
              onChange={(event) =>
                setLocationFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Locations</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* APPLICATION DIRECTORY */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Application Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredApplications.length} matching applications
          </p>
        </div>

        {filteredApplications.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#17324D]">
                          {application.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {application.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {application.email}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {application.location}
                      </td>

                      <td className="px-6 py-4">
                        {application.availability}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(application.submittedAt)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={application.status}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/viewer-applications/${application.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2A9D8F] hover:underline"
                        >
                          Review
                          <ArrowRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17324D]">
                        {application.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {application.id}
                      </p>
                    </div>

                    <StatusBadge
                      status={application.status}
                    />
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {application.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      Applied {formatDate(application.submittedAt)}
                    </p>

                    <p>
                      Availability: {application.availability}
                    </p>
                  </div>

                  <Link
                    to={`/admin/viewer-applications/${application.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F]"
                  >
                    Review Application
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="px-6 py-20 text-center">
            <Search
              size={35}
              className="mx-auto text-[#2A9D8F]"
            />

            <h3 className="mt-5 text-lg font-bold text-[#17324D]">
              No Applications Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No applications match your search and filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default ViewerApplications;
