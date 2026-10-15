
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Users,
  UserCheck,
  UserX,
  MapPin,
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  Mail,
  CalendarDays,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";
import { viewerProfiles } from "../../data/adminMockData";

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

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

function Viewers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");

  const locations = [
    ...new Set(
      viewerProfiles.flatMap((viewer) => viewer.coverageAreas)
    ),
  ].sort();

  const filteredViewers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return viewerProfiles.filter((viewer) => {
      const matchesSearch =
        !query ||
        [
          viewer.id,
          viewer.name,
          viewer.email,
          viewer.location,
          ...viewer.coverageAreas,
        ].some((value) =>
          value.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        viewer.status === statusFilter;

      const matchesLocation =
        locationFilter === "All" ||
        viewer.coverageAreas.includes(locationFilter);

      const matchesAvailability =
        availabilityFilter === "All" ||
        viewer.availability === availabilityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesAvailability
      );
    });
  }, [
    search,
    statusFilter,
    locationFilter,
    availabilityFilter,
  ]);

  const totalViewers = viewerProfiles.length;

  const activeViewers = viewerProfiles.filter(
    (viewer) => viewer.status === "Active"
  ).length;

  const inactiveViewers = viewerProfiles.filter(
    (viewer) => viewer.status === "Inactive"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setLocationFilter("All");
    setAvailabilityFilter("All");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
          Viewer Management
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Manage registered viewers, coverage areas,
          and operational availability.
        </p>

        <p className="mt-2 text-xs font-semibold text-amber-700">
          Demo data — no live viewer records
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Viewers"
          value={totalViewers}
          icon={Users}
        />

        <SummaryCard
          title="Active Viewers"
          value={activeViewers}
          icon={UserCheck}
        />

        <SummaryCard
          title="Inactive Viewers"
          value={inactiveViewers}
          icon={UserX}
        />

        <SummaryCard
          title="Coverage Areas"
          value={locations.length}
          icon={MapPin}
        />
      </div>

      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter
              size={20}
              className="text-[#2A9D8F]"
            />

            <h2 className="text-lg font-bold text-[#17324D]">
              Search & Filter Viewers
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
            placeholder="Search by name, email, viewer ID, or location..."
            aria-label="Search viewers"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="viewer-status-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Account Status
            </label>

            <select
              id="viewer-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="viewer-location-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Coverage Area
            </label>

            <select
              id="viewer-location-filter"
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

          <div>
            <label
              htmlFor="viewer-availability-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              General Availability
            </label>

            <select
              id="viewer-availability-filter"
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
      </section>

      {/* VIEWER DIRECTORY */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Viewer Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredViewers.length} matching viewers
          </p>
        </div>

        {filteredViewers.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">Viewer</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Coverage</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4">Completed</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredViewers.map((viewer) => (
                    <tr
                      key={viewer.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F6F3] font-bold text-[#2A9D8F]">
                            {viewer.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div>
                            <p className="font-semibold text-[#17324D]">
                              {viewer.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {viewer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {viewer.location}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex max-w-64 flex-wrap gap-1.5">
                          {viewer.coverageAreas.map((area) => (
                            <span
                              key={area}
                              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {viewer.availability}
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#17324D]">
                        {viewer.completedViewings}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={viewer.status} />
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/viewers/${viewer.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2A9D8F] hover:underline"
                        >
                          View Profile
                          <ArrowRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {filteredViewers.map((viewer) => (
                <div key={viewer.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F6F3] font-bold text-[#2A9D8F]">
                      {viewer.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#17324D]">
                        {viewer.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {viewer.id}
                      </p>
                    </div>

                    <StatusBadge status={viewer.status} />
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {viewer.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {viewer.availability}
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail size={16} />
                      <span className="break-all">
                        {viewer.email}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {viewer.coverageAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600">
                      <strong>{viewer.completedViewings}</strong>{" "}
                      completed
                    </p>

                    <Link
                      to={`/admin/viewers/${viewer.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#2A9D8F]"
                    >
                      View Profile
                      <ArrowRight size={16} />
                    </Link>
                  </div>
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
              No Viewers Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No viewers match the selected filters.
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

export default Viewers;
