
import { useEffect, useState } from "react";
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
  getAdminReports,
  getAdminReportSummary,
} from "../../services/adminReportService";

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Awaiting Review" },
  { value: "APPROVED", label: "Ready for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
];

const statusLabels = {
  DRAFT: "Draft",
  SUBMITTED: "Awaiting Review",
  APPROVED: "Ready",
  DELIVERED: "Delivered",
};

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
    timeZone: "Europe/London",
  }).format(date);
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
  const [reports, setReports] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    delivered: 0,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  const [services, setServices] = useState([]);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState("");
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        setSummaryLoading(true);
        setSummaryError("");

        const response = await getAdminReportSummary();

        if (active) {
          setSummary(response.data);
        }
      } catch (err) {
        if (active) {
          setSummaryError(
            err.message || "Unable to load report statistics."
          );
        }
      } finally {
        if (active) setSummaryLoading(false);
      }
    }

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminReports({
          page,
          limit: 20,
          search: debouncedSearch,
          status: statusFilter,
          serviceId: serviceFilter,
        });

        if (!active) return;

        const items = response.data || [];

        setReports(items);

        setPagination(
          response.pagination || {
            page,
            limit: 20,
            total: items.length,
            totalPages: 1,
          }
        );

        // Collect service options from retrieved reports.
        setServices((previous) => {
          const serviceMap = new Map(
            previous.map((service) => [service.id, service])
          );

          items.forEach((report) => {
            const service = report.booking?.service;

            if (service?.id) {
              serviceMap.set(service.id, service);
            }
          });

          return Array.from(serviceMap.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        });
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load reports.");
          setReports([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, [page, debouncedSearch, statusFilter, serviceFilter]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("All");
    setServiceFilter("All");
    setPage(1);
  };

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
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Reports"
          value={summaryLoading ? "..." : summary.total}
          icon={FileImage}
        />

        <SummaryCard
          title="Awaiting Review"
          value={summaryLoading ? "..." : summary.submitted}
          icon={Clock3}
        />

        <SummaryCard
          title="Ready for Delivery"
          value={summaryLoading ? "..." : summary.approved}
          icon={ClipboardCheck}
        />

        <SummaryCard
          title="Delivered"
          value={summaryLoading ? "..." : summary.delivered}
          icon={Send}
        />
      </div>

      {summaryError && (
        <p role="alert" className="text-sm text-red-600">
          {summaryError}
        </p>
      )}

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
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by report title, booking reference, customer, or viewer..."
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
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="All">All Statuses</option>

              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              onChange={(event) => {
                setServiceFilter(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="All">All Services</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
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
            {loading
              ? "Loading reports..."
              : `${pagination.total} matching reports`}
          </p>
        </div>

        {error && (
          <div role="alert" className="p-6 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading viewing reports...
          </div>
        ) : reports.length > 0 ? (
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
                  {reports.map((report) => {
                    const booking = report.booking;
                    const viewer =
                      booking?.assignments?.[0]?.viewer;

                    return (
                      <tr
                        key={report.id}
                        className="text-sm text-slate-600 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#17324D]">
                            {report.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {booking?.reference || report.id}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          {booking?.customer?.fullName || "Not available"}
                        </td>

                        <td className="px-6 py-4">
                          {viewer?.fullName || "Not assigned"}
                        </td>

                        <td className="px-6 py-4">
                          {booking?.service?.name || "Not available"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          {formatDate(booking?.preferredDate)}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={
                              statusLabels[report.status] || report.status
                            }
                          />
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {reports.map((report) => {
                const booking = report.booking;
                const viewer =
                  booking?.assignments?.[0]?.viewer;

                return (
                  <div key={report.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#17324D]">
                          {report.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Booking {booking?.reference || "Not available"}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          statusLabels[report.status] || report.status
                        }
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#17324D]">
                      {booking?.service?.name || "Not available"}
                    </p>

                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p>
                        Customer: {booking?.customer?.fullName || "Not available"}
                      </p>

                      <p>
                        Viewer: {viewer?.fullName || "Not assigned"}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} />
                        {[
                          booking?.propertyAddress,
                          booking?.propertyCity,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Not available"}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatDate(booking?.preferredDate)}
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
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-6">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#17324D] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl bg-[#2A9D8F] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : !error ? (
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
        ) : null}
      </section>
    </div>
  );
}

export default Reports;
