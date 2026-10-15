
import { useMemo, useState } from "react";
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
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import {
  customerEnquiries,
  enquiryStatuses,
  enquiryCategories,
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

function Enquiries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customerEnquiries.filter((enquiry) => {
      const matchesSearch =
        !query ||
        [
          enquiry.id,
          enquiry.name,
          enquiry.email,
          enquiry.subject,
          enquiry.message,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        enquiry.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        enquiry.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [search, statusFilter, categoryFilter]);

  const total = customerEnquiries.length;

  const newCount = customerEnquiries.filter(
    (item) => item.status === "New"
  ).length;

  const inProgressCount = customerEnquiries.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolvedCount = customerEnquiries.filter(
    (item) => item.status === "Resolved"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
  };

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
          Customer Enquiries
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Review customer messages, track responses,
          and manage outstanding enquiries.
        </p>

        <p className="mt-2 text-xs font-semibold text-amber-700">
          Demo data — no live customer messages
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Enquiries"
          value={total}
          icon={MessagesSquare}
        />

        <SummaryCard
          title="New Enquiries"
          value={newCount}
          icon={Mail}
        />

        <SummaryCard
          title="In Progress"
          value={inProgressCount}
          icon={Clock3}
        />

        <SummaryCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
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

        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, subject, or enquiry ID..."
            aria-label="Search enquiries"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              <option value="All">All Statuses</option>

              {enquiryStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="enquiry-category-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Enquiry Category
            </label>

            <select
              id="enquiry-category-filter"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Categories</option>

              {enquiryCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ENQUIRIES DIRECTORY */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Enquiries Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredEnquiries.length} matching enquiries
          </p>
        </div>

        {filteredEnquiries.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Received</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#17324D]">
                          {enquiry.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {enquiry.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {enquiry.id}
                        </p>
                      </td>

                      <td className="max-w-[240px] px-6 py-4">
                        <p className="line-clamp-2">
                          {enquiry.subject}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {enquiry.category}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(enquiry.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={enquiry.status} />
                      </td>

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
                <div key={enquiry.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17324D]">
                        {enquiry.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {enquiry.id}
                      </p>
                    </div>

                    <StatusBadge status={enquiry.status} />
                  </div>

                  <p className="mt-4 font-semibold text-[#17324D]">
                    {enquiry.subject}
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>Category: {enquiry.category}</p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(enquiry.createdAt)}
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
