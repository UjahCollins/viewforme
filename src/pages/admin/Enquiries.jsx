
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  MessagesSquare,
  Mail,
  Clock3,
  CheckCircle2,
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  CalendarDays,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminEnquiries } from "../../services/adminEnquiryApi.js";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const ENQUIRY_TYPES = [
  { value: "general", label: "General Enquiry" },
  { value: "booking", label: "New Booking Enquiry" },
  { value: "existing-booking", label: "Existing Booking" },
  { value: "property-agent", label: "Property Agent / Landlord" },
  { value: "viewer", label: "Become a Viewer" },
  { value: "partnership", label: "Business Partnership" },
  { value: "complaint", label: "Feedback or Complaint" },
  { value: "other", label: "Other" },
];

const EMPTY_STATS = {
  total: 0,
  new: 0,
  inProgress: 0,
  resolved: 0,
  closed: 0,
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
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(date);
};

const getStatusLabel = (status) => {
  const labels = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
  };

  return labels[status] || status || "Unknown";
};

const getEnquiryTypeLabel = (type) => {
  return (
    ENQUIRY_TYPES.find((item) => item.value === type)?.label ||
    type ||
    "Not specified"
  );
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

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce search requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch enquiries from backend
  useEffect(() => {
    let active = true;

    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminEnquiries({
          search: debouncedSearch,
          status: statusFilter,
        });

        if (!active) return;

        if (response?.success !== true) {
          throw new Error(
            response?.message || "Failed to fetch enquiries."
          );
        }

        setEnquiries(
          Array.isArray(response?.data?.enquiries)
            ? response.data.enquiries
            : []
        );

        setStats({
          ...EMPTY_STATS,
          ...(response?.data?.stats || {}),
        });
      } catch (err) {
        if (!active) return;

        setError(
          err?.message ||
            "Unable to load enquiries. Please try again."
        );
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    fetchEnquiries();

    return () => {
      active = false;
    };
  }, [debouncedSearch, statusFilter, reloadKey]);

  // Enquiry type filtering is client-side
  const filteredEnquiries = useMemo(() => {
    if (typeFilter === "ALL") {
      return enquiries;
    }

    return enquiries.filter(
      (enquiry) => enquiry.enquiryType === typeFilter
    );
  }, [enquiries, typeFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  };

  const refreshEnquiries = () => {
    setRefreshing(true);
    setReloadKey((previous) => previous + 1);
  };

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Customer Enquiries
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Review customer messages, track responses,
            and manage outstanding enquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshEnquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#17324D] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Enquiries"
          value={stats.total}
          icon={MessagesSquare}
        />

        <SummaryCard
          title="New Enquiries"
          value={stats.new}
          icon={Mail}
        />

        <SummaryCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock3}
        />

        <SummaryCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
        />
      </div>

      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter
              size={20}
              className="text-[#2A9D8F]"
            />

            <h2 className="text-lg font-bold text-[#17324D]">
              Search & Filter Enquiries
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

        {/* SEARCH */}
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, email, subject, or message..."
            aria-label="Search enquiries"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* STATUS FILTER */}
          <div>
            <label
              htmlFor="enquiry-status-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Enquiry Status
            </label>

            <select
              id="enquiry-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="ALL">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* ENQUIRY TYPE FILTER */}
          <div>
            <label
              htmlFor="enquiry-type-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Enquiry Type
            </label>

            <select
              id="enquiry-type-filter"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="ALL">All Enquiry Types</option>

              {ENQUIRY_TYPES.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={refreshEnquiries}
            className="text-sm font-semibold text-red-700 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ENQUIRIES DIRECTORY */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Enquiries Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading enquiries..."
              : `${filteredEnquiries.length} matching enquiries`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20">
            <Loader2
              size={35}
              className="animate-spin text-[#2A9D8F]"
            />

            <p className="text-sm text-slate-500">
              Loading customer enquiries...
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <AlertCircle
              size={35}
              className="mx-auto text-red-500"
            />

            <p className="mt-4 text-sm text-slate-600">
              Unable to display enquiries.
            </p>
          </div>
        ) : filteredEnquiries.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      Customer
                    </th>

                    <th className="px-6 py-4">
                      Subject
                    </th>

                    <th className="px-6 py-4">
                      Enquiry Type
                    </th>

                    <th className="px-6 py-4">
                      Received
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      {/* CUSTOMER */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#17324D]">
                          {enquiry.fullName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {enquiry.email}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                          {enquiry.id}
                        </p>
                      </td>

                      {/* SUBJECT */}
                      <td className="max-w-[240px] px-6 py-4">
                        <p className="line-clamp-2">
                          {enquiry.subject ||
                            "No subject"}
                        </p>
                      </td>

                      {/* TYPE */}
                      <td className="px-6 py-4">
                        {getEnquiryTypeLabel(
                          enquiry.enquiryType
                        )}
                      </td>

                      {/* DATE */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(
                          enquiry.createdAt
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={getStatusLabel(
                            enquiry.status
                          )}
                        />
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/enquiries/${enquiry.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2A9D8F] hover:underline"
                        >
                          View
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
              {filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17324D]">
                        {enquiry.fullName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {enquiry.email}
                      </p>

                      <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                        {enquiry.id}
                      </p>
                    </div>

                    <StatusBadge
                      status={getStatusLabel(
                        enquiry.status
                      )}
                    />
                  </div>

                  <p className="mt-4 font-semibold text-[#17324D]">
                    {enquiry.subject ||
                      "No subject"}
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>
                      Enquiry Type:{" "}
                      {getEnquiryTypeLabel(
                        enquiry.enquiryType
                      )}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(
                        enquiry.createdAt
                      )}
                    </p>
                  </div>

                  <Link
                    to={`/admin/enquiries/${enquiry.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F]"
                  >
                    View Enquiry
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
              No Enquiries Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No enquiries match your search and filters.
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

export default Enquiries;
