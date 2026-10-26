import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  CreditCard,
  CircleCheck,
  Clock3,
  RefreshCw,
  CircleAlert,
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminPayments, getAdminPaymentSummary } from "../../services/adminPaymentService";

const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
  "Partially Refunded",
];

const statusMap = {
  PENDING: "Pending",
  SUCCEEDED: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially Refunded",
};

const formatCurrency = (amount, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
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

      <h3 className="mt-4 text-2xl font-extrabold text-[#17324D]">
        {value}
      </h3>
    </div>
  );
}

function Payments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const [debouncedSearch, setDebouncedSearch] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentTransactions, setPaymentTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [paymentSummary, setPaymentSummary] = useState(null);
const [summaryLoading, setSummaryLoading] = useState(true);
const [summaryError, setSummaryError] = useState("");


useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 400);

  return () => clearTimeout(timer);
}, [search]);


useEffect(() => {
  let active = true;

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPayments({
  page,
  limit: 20,
  status:
    statusFilter === "All"
      ? undefined
      : {
          Pending: "PENDING",
          Paid: "SUCCEEDED",
          Failed: "FAILED",
          Refunded: "REFUNDED",
          "Partially Refunded": "PARTIALLY_REFUNDED",
        }[statusFilter],
  search: debouncedSearch,
  startDate,
  endDate,
});

      if (!active) return;

      const records = response.data ?? [];

      const formattedPayments = records.map((payment) => ({
        ...payment,

        amount: Number(payment.amount ?? 0),
        refundedAmount: Number(payment.refundedAmount ?? 0),

        status: statusMap[payment.status] ?? payment.status,

        bookingId:
          payment.booking?.reference ?? payment.bookingId,

        customer:
          payment.booking?.customer?.fullName ?? "Unknown Customer",

        email:
          payment.booking?.customer?.email ?? "Not available",

        method: "Stripe",

        provider: "Stripe",
      }));

      setPaymentTransactions(formattedPayments);
      setPagination(response.pagination);
    } catch (err) {
      if (!active) return;

      console.error("Failed to load payments:", err);
      setError(err.message || "Unable to load payment transactions.");
    } finally {
      if (active) setLoading(false);
    }
  }

  loadPayments();

  return () => {
    active = false;
  };
}, [
   page,
  statusFilter,
  debouncedSearch,
  startDate,
  endDate,
]);

useEffect(() => {
  setPage(1);
}, [statusFilter, debouncedSearch, startDate, endDate]);


useEffect(() => {
  let active = true;

  async function loadSummary() {
    try {
      setSummaryLoading(true);
      setSummaryError("");

      const response = await getAdminPaymentSummary();

      if (!active) return;

      setPaymentSummary(response.data);
    } catch (err) {
      if (!active) return;

      console.error("Failed to load payment summary:", err);

      setSummaryError(
        err.message || "Unable to load payment summary."
      );
    } finally {
      if (active) {
        setSummaryLoading(false);
      }
    }
  }

  loadSummary();

  return () => {
    active = false;
  };
}, []);


  const filteredPayments = paymentTransactions;

const successfulAmount = paymentSummary?.grossSuccessful ?? 0;
const pendingAmount = paymentSummary?.pendingAmount ?? 0;
const refundedAmount = paymentSummary?.refundedAmount ?? 0;
const failedAmount = paymentSummary?.failedAmount ?? 0;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
          Payments Management
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Monitor booking payments, payment attempts,
          refunds, and transaction records.
        </p>

        <p className="mt-2 text-xs font-medium text-slate-500">
  Stripe payment transactions recorded in ViewForMe.
</p>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
       <SummaryCard
  title="Successful Payments (Gross)"
  value={
    summaryLoading
      ? "Loading..."
      : summaryError
        ? "Unavailable"
        : formatCurrency(successfulAmount)
  }
  icon={CircleCheck}
/>

<SummaryCard
  title="Pending Payments"
  value={
    summaryLoading
      ? "Loading..."
      : summaryError
        ? "Unavailable"
        : formatCurrency(pendingAmount)
  }
  icon={Clock3}
/>

<SummaryCard
  title="Refunded Amount"
  value={
    summaryLoading
      ? "Loading..."
      : summaryError
        ? "Unavailable"
        : formatCurrency(refundedAmount)
  }
  icon={RefreshCw}
/>

<SummaryCard
  title="Failed Attempts"
  value={
    summaryLoading
      ? "Loading..."
      : summaryError
        ? "Unavailable"
        : formatCurrency(failedAmount)
  }
  icon={CircleAlert}
/>

{summaryError && (
  <p role="alert" className="text-sm text-red-600">
    {summaryError}
  </p>
)}
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
              Search & Filter Payments
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
            placeholder="Search by transaction ID, booking ID, customer, or Stripe reference..."
            aria-label="Search payments"
            className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label
              htmlFor="payment-status-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Payment Status
            </label>

            <select
              id="payment-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Statuses</option>

              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-method-filter"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              Payment Method
            </label>

            <select
              id="payment-method-filter"
              value={methodFilter}
              onChange={(event) =>
                setMethodFilter(event.target.value)
              }
              className={selectClass}
            >
              <option value="All">All Methods</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-start-date"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              From Date
            </label>

            <input
              id="payment-start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) =>
                setStartDate(event.target.value)
              }
              className={selectClass}
            />
          </div>

          <div>
            <label
              htmlFor="payment-end-date"
              className="mb-2 block text-sm font-semibold text-[#17324D]"
            >
              To Date
            </label>

            <input
              id="payment-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) =>
                setEndDate(event.target.value)
              }
              className={selectClass}
            />
          </div>
        </div>
      </section>

      {loading && (
  <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
    Loading payment transactions...
  </div>
)}

{error && (
  <div
    role="alert"
    className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
  >
    {error}
  </div>
)}

      {/* TRANSACTIONS */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Payment Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {pagination.total} matching transactions
          </p>
        </div>

        {!loading && !error && filteredPayments.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F6F9FA]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#17324D]">
                          {payment.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {payment.bookingId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-[#17324D]">
                          {payment.customer}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {payment.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#17324D]">
                        {formatCurrency(
                          payment.amount,
                          payment.currency
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {payment.method}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={payment.status} />
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/payments/${payment.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2A9D8F] hover:underline"
                        >
                          Details
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
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17324D]">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Booking {payment.bookingId}
                      </p>
                    </div>

                    <StatusBadge status={payment.status} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#17324D]">
                    {payment.customer}
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>
                      Amount:{" "}
                      {formatCurrency(
                        payment.amount,
                        payment.currency
                      )}
                    </p>

                    <p>Method: {payment.method}</p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <Link
                    to={`/admin/payments/${payment.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F]"
                  >
                    View Transaction
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
              No Transactions Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No transactions match your search and filters.
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

        {!loading && !error && pagination.totalPages > 1 && (
  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-5">
    <p className="text-sm text-slate-500">
      Page {pagination.page} of {pagination.totalPages}
      {" · "}
      {pagination.total} transactions
    </p>

    <div className="flex gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => setPage((current) => current - 1)}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <button
        type="button"
        disabled={page >= pagination.totalPages}
        onClick={() => setPage((current) => current + 1)}
        className="rounded-lg bg-[#2A9D8F] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
)}
      </section>
    </div>
  );
}

export default Payments;
