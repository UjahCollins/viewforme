
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FileImage,
  Clock3,
  ClipboardCheck,
  Send,
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  MapPin,
  CalendarDays,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import {
  viewingReports,
  reportStatuses,
} from "../../data/adminMockData";

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
};

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

function Reports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  const services = [
    ...new Set(viewingReports.map((report) => report.service)),
  ].sort();

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return viewingReports.filter((report) => {
      const matchesSearch =
        !query ||
        [
          report.id,
          report.bookingId,
          report.customer,
          report.viewer,
          report.location,
          report.service,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

      const matchesService =
        serviceFilter === "All" ||
        report.service === serviceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService
      );
    });
  }, [search, statusFilter, serviceFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setServiceFilter("All");
  };

  const totalReports = viewingReports.length;

  const awaitingReports = viewingReports.filter(
    (report) => report.status === "Awaiting Materials"
  ).length;

  const readyReports = viewingReports.filter(
    (report) => report.status === "Ready"
  ).length;

  const deliveredReports = viewingReports.filter(
    (report) => report.status === "Delivered"
  ).length;

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
          Reports Management
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Track viewing reports, submitted materials,
          administrative reviews, and customer delivery.
        </p>

        <p className="mt-2 text-xs font-semibold text-amber-700">
          Demo data — no real reports or media files
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Reports"
          value={totalReports}
          icon={FileImage}
        />

        <SummaryCard
          title="Awaiting Materials"
          value={awaitingReports}
          icon={Clock3}
        />

        <SummaryCard
          title="Ready for Delivery"
          value={readyReports}
          icon={ClipboardCheck}
        />

        <SummaryCard
          title="Delivered"
          value={deliveredReports}
          icon={Send}
        />
      </div>

      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[#2A9D8F]" />

            <h2 className="text-lg font-bold text-[#17324D]">
              Search & Filter Reports
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
            placeholder="Search by report ID, booking ID, customer, or viewer..."
            aria-label="Search reports"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="report-status-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Report Status
            </label>

            <select
              id="report-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Statuses</option>

              {reportStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="report-service-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Service Type
            </label>

            <select
              id="report-service-filter"
              value={serviceFilter}
              onChange={(event) =>
                setServiceFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Services</option>

              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* REPORTS DIRECTORY */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Viewing Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredReports.length} matching reports
          </p>
        </div>

        {filteredReports.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">Report</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Viewer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Viewing Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#17324D]">
                          {report.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {report.bookingId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {report.customer}
                      </td>

                      <td className="px-6 py-4">
                        {report.viewer}
                      </td>

                      <td className="px-6 py-4">
                        {report.service}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(report.viewingDate)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={report.status} />
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/reports/${report.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2A9D8F] hover:underline"
                        >
                          View Report
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
              {filteredReports.map((report) => (
                <div key={report.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17324D]">
                        {report.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Booking {report.bookingId}
                      </p>
                    </div>

                    <StatusBadge status={report.status} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#17324D]">
                    {report.service}
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>Customer: {report.customer}</p>
                    <p>Viewer: {report.viewer}</p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {report.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(report.viewingDate)}
                    </p>
                  </div>

                  <Link
                    to={`/admin/reports/${report.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F]"
                  >
                    View Report
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
              No Reports Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No reports match the selected filters.
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

export default Reports;
