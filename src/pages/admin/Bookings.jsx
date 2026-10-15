
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Filter,
  CalendarCheck,
  Clock3,
  CheckCircle2,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  CalendarDays,
  MapPin,
  UserRound,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";
import { allBookings } from "../../data/adminMockData";

const ITEMS_PER_PAGE = 5;

const statusOptions = [
  "All Statuses",
  "Pending",
  "Assigned",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];

const paymentOptions = [
  "All Payments",
  "Paid",
  "Unpaid",
  "Refunded",
];

const serviceOptions = [
  "All Services",
  "Residential Viewing",
  "Commercial Viewing",
  "Storage Inspection",
  "Construction Inspection",
];

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
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

function Bookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");
  const [paymentFilter, setPaymentFilter] =
    useState("All Payments");
  const [serviceFilter, setServiceFilter] =
    useState("All Services");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allBookings.filter((booking) => {
      const matchesSearch =
        !query ||
        [
          booking.id,
          booking.customer,
          booking.email,
          booking.location,
          booking.propertyAddress,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All Statuses" ||
        booking.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All Payments" ||
        booking.paymentStatus === paymentFilter;

      const matchesService =
        serviceFilter === "All Services" ||
        booking.service === serviceFilter;

      const matchesStartDate =
        !startDate || booking.date >= startDate;

      const matchesEndDate =
        !endDate || booking.date <= endDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesService &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    search,
    statusFilter,
    paymentFilter,
    serviceFilter,
    startDate,
    endDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedBookings = filteredBookings.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const updateFilter = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Statuses");
    setPaymentFilter("All Payments");
    setServiceFilter("All Services");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const totalBookings = allBookings.length;

  const pendingBookings = allBookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedBookings = allBookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const completedBookings = allBookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Booking Management
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Review and manage property viewing requests.
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-700">
            Demo data — no live bookings
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <CalendarCheck
            size={18}
            className="text-[#2A9D8F]"
          />
          {totalBookings} Sample Bookings
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Bookings"
          value={totalBookings}
          icon={CalendarCheck}
        />

        <SummaryCard
          title="Pending"
          value={pendingBookings}
          icon={Clock3}
        />

        <SummaryCard
          title="Confirmed"
          value={confirmedBookings}
          icon={ClipboardList}
        />

        <SummaryCard
          title="Completed"
          value={completedBookings}
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
              Search & Filter
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
              updateFilter(setSearch, event.target.value)
            }
            placeholder="Search by booking ID, customer, email, or location..."
            aria-label="Search bookings"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        {/* FILTER GRID */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label
              htmlFor="booking-status"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Booking Status
            </label>

            <select
              id="booking-status"
              value={statusFilter}
              onChange={(event) =>
                updateFilter(
                  setStatusFilter,
                  event.target.value
                )
              }
              className={selectClass}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-status"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Payment Status
            </label>

            <select
              id="payment-status"
              value={paymentFilter}
              onChange={(event) =>
                updateFilter(
                  setPaymentFilter,
                  event.target.value
                )
              }
              className={selectClass}
            >
              {paymentOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="service-type"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Service Type
            </label>

            <select
              id="service-type"
              value={serviceFilter}
              onChange={(event) =>
                updateFilter(
                  setServiceFilter,
                  event.target.value
                )
              }
              className={selectClass}
            >
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="start-date"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              From Date
            </label>

            <input
              id="start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) =>
                updateFilter(setStartDate, event.target.value)
              }
              className={selectClass}
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              To Date
            </label>

            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) =>
                updateFilter(setEndDate, event.target.value)
              }
              className={selectClass}
            />
          </div>
        </div>
      </section>

      {/* BOOKINGS TABLE */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-[#17324D]">
              All Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredBookings.length} matching bookings
            </p>
          </div>
        </div>

        {paginatedBookings.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Booking</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-bold text-[#17324D]">
                        {booking.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#17324D]">
                          {booking.customer}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {booking.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {booking.service}
                      </td>

                      <td className="px-5 py-4">
                        {booking.location}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {formatDate(booking.date)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={booking.paymentStatus}
                        />
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#17324D]">
                        {formatCurrency(booking.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/bookings/${booking.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2A9D8F] hover:underline"
                        >
                          View
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
              {paginatedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17324D]">
                        {booking.id}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {booking.service}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <UserRound size={16} />
                      {booking.customer}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {booking.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(booking.date)}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={booking.paymentStatus}
                      />

                      <span className="text-sm font-bold text-[#17324D]">
                        {formatCurrency(booking.amount)}
                      </span>
                    </div>

                    <Link
                      to={`/admin/bookings/${booking.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#2A9D8F]"
                    >
                      Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-5">
              <p className="text-sm text-slate-500">
                Page {safePage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 p-2 text-[#17324D] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={19} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 p-2 text-[#17324D] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F6F3] text-[#2A9D8F]">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#17324D]">
              No Bookings Found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
              No bookings match your current search
              and filter selections.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Bookings;
