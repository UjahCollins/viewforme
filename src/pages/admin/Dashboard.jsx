
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CalendarCheck,
  Clock3,
  Users,
  Wallet,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  MapPin,
  CalendarDays,
  UserRound,
  RefreshCw,
  FileCheck2,
} from "lucide-react";

import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";
import { getAdminDashboardOverview } from "../../services/adminDashboardService";

// ============================================
// FORMATTERS
// ============================================

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number(amount ?? 0));

const formatDate = (value) => {
  if (!value) return "Not available";

  const date =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T12:00:00Z`)
      : new Date(value);

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

const formatStatus = (status) => {
  const statusMap = {
    PENDING_PAYMENT: "Pending Payment",
    PAYMENT_RECEIVED: "Payment Received",
    AWAITING_CONFIRMATION: "Awaiting Confirmation",
    CONFIRMED: "Confirmed",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    PENDING: "Pending",
    SUCCEEDED: "Paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially Refunded",
  };

  return (
    statusMap[status] ||
    String(status ?? "Unknown")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

// ============================================
// DASHBOARD
// ============================================

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const loadDashboard = useCallback(
    async ({ signal, refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getAdminDashboardOverview();

        if (signal?.aborted) return;

        // Supports both an Axios response and
        // an API helper returning the JSON body.
        const payload =
          response?.data?.success !== undefined
            ? response.data
            : response;

        if (!payload?.success || !payload?.data) {
          throw new Error(
            payload?.message ||
              "Unable to fetch dashboard overview."
          );
        }

        setDashboard(payload.data);
      } catch (err) {
        if (signal?.aborted) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load dashboard."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    loadDashboard({
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [loadDashboard]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading && !dashboard) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Monitor bookings, viewers, and daily operations.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100 xl:col-span-2" />

          <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (!dashboard) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle
          size={42}
          className="text-red-500"
        />

        <h2 className="mt-4 text-xl font-bold text-[#17324D]">
          Unable to Load Dashboard
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-600">
          {error || "Dashboard data is unavailable."}
        </p>

        <button
          type="button"
          onClick={() => loadDashboard()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238579]"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const dashboardStats = dashboard.stats ?? {};

  const bookingActivity =
    dashboard.bookingActivity ?? [];

  const recentBookings =
    dashboard.recentBookings ?? [];

  const upcomingAppointments =
    dashboard.upcomingAppointments ?? [];

  const pendingViewerApplications =
    dashboard.pendingViewerApplications ?? [];

  const maxBookings = Math.max(
    1,
    ...bookingActivity.map(
      (item) => Number(item.bookings) || 0
    )
  );

  return (
    <div className="space-y-8">
      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Monitor bookings, viewers, and daily operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={refreshing}
            onClick={() =>
              loadDashboard({ refresh: true })
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#17324D] transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            to="/admin/bookings"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579]"
          >
            Manage Bookings
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* REFRESH ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle
            size={19}
            className="shrink-0 text-red-600"
          />

          <p className="text-sm text-red-700">
            {error}. Showing previously loaded data.
          </p>
        </div>
      )}

      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={dashboardStats.totalBookings ?? 0}
          icon={CalendarCheck}
          description="All booking requests"
        />

        <StatCard
          title="Pending Bookings"
          value={dashboardStats.pendingBookings ?? 0}
          icon={Clock3}
          description="Requests awaiting action"
        />

        <StatCard
          title="Active Viewers"
          value={dashboardStats.activeViewers ?? 0}
          icon={Users}
          description="Approved and active viewers"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            dashboardStats.totalRevenue
          )}
          icon={Wallet}
          description="GBP payments after refunds"
        />
      </div>

      {/* ======================================
          CHART + ACTION CENTRE
      ====================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* BOOKING ACTIVITY */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#17324D]">
                Booking Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly booking trends
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 rounded-full bg-[#2A9D8F]" />
              Bookings
            </div>
          </div>

          {bookingActivity.length > 0 ? (
            <div
              className="mt-10 flex h-64 items-end gap-3 border-b border-slate-200 pb-2 sm:gap-6"
              role="img"
              aria-label={`Monthly bookings: ${bookingActivity
                .map(
                  (item) =>
                    `${item.month} ${item.year}: ${item.bookings}`
                )
                .join(", ")}`}
            >
              {bookingActivity.map((item) => (
                <div
                  key={`${item.year}-${item.month}`}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-semibold text-[#17324D]">
                    {item.bookings}
                  </span>

                  <div
                    className="w-full max-w-16 rounded-t-lg bg-[#2A9D8F] transition hover:bg-[#238579]"
                    style={{
                      height: `${
                        (Number(item.bookings) /
                          maxBookings) *
                        80
                      }%`,
                    }}
                    title={`${item.month} ${item.year}: ${item.bookings} bookings`}
                  />

                  <span className="text-xs text-slate-500">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex h-64 items-center justify-center rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">
                No booking activity available.
              </p>
            </div>
          )}
        </section>

        {/* ACTION CENTRE */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#17324D]">
            Action Centre
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Items requiring attention
          </p>

          <div className="mt-7 space-y-4">
            {/* PENDING BOOKINGS */}

            <Link
              to="/admin/bookings"
              className="flex items-start gap-4 rounded-xl bg-amber-50 p-4 transition hover:bg-amber-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock3 size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.pendingBookings ?? 0} Pending Bookings
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Review requests awaiting action.
                </p>
              </div>

              <ArrowRight
                size={17}
                className="mt-1 text-slate-400"
              />
            </Link>

            {/* VIEWER APPLICATIONS */}

            <Link
              to="/admin/viewer-applications"
              className="flex items-start gap-4 rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ClipboardList size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.pendingApplications ?? 0} Viewer Applications
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Applications awaiting review.
                </p>
              </div>

              <ArrowRight
                size={17}
                className="mt-1 text-slate-400"
              />
            </Link>

            {/* PENDING REPORTS */}

            <Link
              to="/admin/reports"
              className="flex items-start gap-4 rounded-xl bg-purple-50 p-4 transition hover:bg-purple-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <FileCheck2 size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.pendingReports ?? 0} Pending Reports
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Reports awaiting review and approval.
                </p>
              </div>

              <ArrowRight
                size={17}
                className="mt-1 text-slate-400"
              />
            </Link>

            {/* UPCOMING APPOINTMENTS */}

            <div className="flex items-start gap-4 rounded-xl bg-[#F0FAF8] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.upcomingAppointments ?? 0} Upcoming Appointments
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Scheduled viewing activity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ======================================
          RECENT BOOKINGS
      ====================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-[#17324D]">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest property viewing requests
            </p>
          </div>

          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2A9D8F] hover:underline"
          >
            View All
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#F6F9FA]">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">
                  Booking ID
                </th>

                <th className="px-6 py-4">
                  Customer
                </th>

                <th className="px-6 py-4">
                  Service
                </th>

                <th className="px-6 py-4">
                  Location
                </th>

                <th className="px-6 py-4">
                  Date
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Payment
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#17324D]">
                      {booking.reference || booking.id}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {booking.customer}
                    </td>

                    <td className="px-6 py-4">
                      {booking.service}
                    </td>

                    <td className="px-6 py-4">
                      {booking.location}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {formatDate(booking.date)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={formatStatus(
                          booking.status
                        )}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={formatStatus(
                          booking.paymentStatus
                        )}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/bookings/${booking.id}`}
                        className="font-semibold text-[#2A9D8F] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No bookings available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================
          APPOINTMENTS + APPLICATIONS
      ====================================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* UPCOMING APPOINTMENTS */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#17324D]">
                Upcoming Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Scheduled viewings
              </p>
            </div>

            <CalendarCheck
              size={22}
              className="text-[#2A9D8F]"
            />
          </div>

          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(
                (appointment) => (
                  <Link
                    key={appointment.id}
                    to={`/admin/bookings/${appointment.id}`}
                    className="block rounded-xl border border-slate-200 p-4 transition hover:border-[#2A9D8F] hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#17324D]">
                          {appointment.service}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {appointment.reference ||
                            appointment.id}
                        </p>
                      </div>

                      <span className="rounded-lg bg-[#E8F6F3] px-3 py-1 text-xs font-semibold text-[#2A9D8F]">
                        {appointment.time || "TBC"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      <span className="flex items-center gap-2">
                        <MapPin
                          size={15}
                          className="shrink-0"
                        />

                        {appointment.location}
                      </span>

                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="shrink-0"
                        />

                        {formatDate(
                          appointment.date
                        )}
                      </span>

                      <span className="flex items-center gap-2 sm:col-span-2">
                        <UserRound
                          size={15}
                          className="shrink-0"
                        />

                        Viewer:{" "}
                        {appointment.viewer ||
                          "Not assigned"}
                      </span>
                    </div>
                  </Link>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
                <CalendarDays
                  size={32}
                  className="text-slate-300"
                />

                <p className="mt-3 font-semibold text-[#17324D]">
                  No Upcoming Appointments
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Confirmed future viewings will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PENDING VIEWER APPLICATIONS */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#17324D]">
                Pending Viewer Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Applicants awaiting review
              </p>
            </div>

            <Link
              to="/admin/viewer-applications"
              className="text-sm font-semibold text-[#2A9D8F] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {pendingViewerApplications.length > 0 ? (
              pendingViewerApplications.map(
                (applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F6F3] text-[#2A9D8F]">
                      <UserRound size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#17324D]">
                        {applicant.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {applicant.location}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Applied{" "}
                        {formatDate(
                          applicant.submitted
                        )}
                      </p>
                    </div>

                    <Link
                      to={`/admin/viewer-applications/${applicant.id}`}
                      className="shrink-0 text-sm font-semibold text-[#2A9D8F] hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
                <ClipboardList
                  size={32}
                  className="text-slate-300"
                />

                <p className="mt-3 font-semibold text-[#17324D]">
                  No Pending Applications
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  New viewer applications will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
