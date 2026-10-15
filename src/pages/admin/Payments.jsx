
import { useMemo, useState } from "react";
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

import {
  paymentTransactions,
  paymentStatuses,
} from "../../data/adminMockData";

const formatCurrency = (amount, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);

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
  const [endDate, setEndDate] = useState("");

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return paymentTransactions.filter((payment) => {
      const matchesSearch =
        !query ||
        [
          payment.id,
          payment.bookingId,
          payment.customer,
          payment.email,
          payment.stripePaymentIntentId,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" ||
        payment.method === methodFilter;

      const matchesStartDate =
        !startDate || payment.createdAt >= startDate;

      const matchesEndDate =
        !endDate || payment.createdAt <= endDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    search,
    statusFilter,
    methodFilter,
    startDate,
    endDate,
  ]);

  const successfulAmount = paymentTransactions
    .filter((payment) =>
      ["Paid", "Refunded", "Partially Refunded"].includes(
        payment.status
      )
    )
    .reduce((total, payment) => total + payment.amount, 0);

  const refundedAmount = paymentTransactions.reduce(
    (total, payment) =>
      total + payment.refundedAmount,
    0
  );

  const pendingAmount = paymentTransactions
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  const failedAmount = paymentTransactions
    .filter((payment) => payment.status === "Failed")
    .reduce((total, payment) => total + payment.amount, 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setStartDate("");
    setEndDate("");
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

        <p className="mt-2 text-xs font-semibold text-amber-700">
          Demo transactions — not actual revenue
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Successful Payments (Gross)"
          value={formatCurrency(successfulAmount)}
          icon={CircleCheck}
        />

        <SummaryCard
          title="Pending Payments"
          value={formatCurrency(pendingAmount)}
          icon={Clock3}
        />

        <SummaryCard
          title="Refunded Amount"
          value={formatCurrency(refundedAmount)}
          icon={RefreshCw}
        />

        <SummaryCard
          title="Failed Attempts"
          value={formatCurrency(failedAmount)}
          icon={CircleAlert}
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

      {/* TRANSACTIONS */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Payment Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredPayments.length} matching transactions
          </p>
        </div>

        {filteredPayments.length > 0 ? (
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
      </section>
    </div>
  );
}

export default Payments;
