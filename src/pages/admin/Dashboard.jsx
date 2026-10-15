
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
  BarChart3,
} from "lucide-react";

import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";

import {
  dashboardStats,
  bookingActivity,
  recentBookings,
  upcomingAppointments,
  pendingViewerApplications,
} from "../../data/adminMockData";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));

function Dashboard() {
  const maxBookings = Math.max(
    1,
    ...bookingActivity.map((item) => item.bookings)
  );

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Monitor bookings, viewers, and daily operations.
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-700">
            Demo data — not live business records
          </p>
        </div>

        <Link
          to="/admin/bookings"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238579]"
        >
          Manage Bookings
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={dashboardStats.totalBookings}
          icon={CalendarCheck}
          description="All booking requests"
        />

        <StatCard
          title="Pending Bookings"
          value={dashboardStats.pendingBookings}
          icon={Clock3}
          description="Requests awaiting action"
        />

        <StatCard
          title="Active Viewers"
          value={dashboardStats.activeViewers}
          icon={Users}
          description="Approved and active viewers"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            dashboardStats.totalRevenue
          )}
          icon={Wallet}
          description="Illustrative successful payments"
        />
      </div>

      {/* CHART + ACTION CENTRE */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* BOOKING ACTIVITY */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#17324D]">
                Booking Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sample monthly booking trends
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 rounded-full bg-[#2A9D8F]" />
              Bookings
            </div>
          </div>

          <div
            className="mt-10 flex h-64 items-end gap-3 border-b border-slate-200 pb-2 sm:gap-6"
            role="img"
            aria-label={`Sample monthly bookings: ${bookingActivity
              .map(
                (item) =>
                  `${item.month} ${item.bookings}`
              )
              .join(", ")}`}
          >
            {bookingActivity.map((item) => (
              <div
                key={item.month}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-semibold text-[#17324D]">
                  {item.bookings}
                </span>

                <div
                  className="w-full max-w-16 rounded-t-lg bg-[#2A9D8F] transition hover:bg-[#238579]"
                  style={{
                    height: `${
                      (item.bookings / maxBookings) * 80
                    }%`,
                  }}
                  title={`${item.month}: ${item.bookings} bookings`}
                />

                <span className="text-xs text-slate-500">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
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
            <Link
              to="/admin/bookings"
              className="flex items-start gap-4 rounded-xl bg-amber-50 p-4 transition hover:bg-amber-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock3 size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.pendingBookings} Pending Bookings
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

            <Link
              to="/admin/viewer-applications"
              className="flex items-start gap-4 rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ClipboardList size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.pendingApplications} Viewer Applications
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

            <div className="flex items-start gap-4 rounded-xl bg-[#F0FAF8] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F3] text-[#2A9D8F]">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="font-bold text-[#17324D]">
                  {dashboardStats.upcomingAppointments} Upcoming Appointments
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Scheduled viewing activity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RECENT BOOKINGS */}
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
          <table className="w-full min-w-225 text-left">
            <thead className="bg-[#F6F9FA]">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#17324D]">
                    {booking.id}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {booking.customer}
                  </td>

                  <td className="px-6 py-4">
                    {booking.service}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {booking.location}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {formatDate(booking.date)}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={booking.paymentStatus}
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* APPOINTMENTS + APPLICATIONS */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* UPCOMING APPOINTMENTS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#17324D]">
                Upcoming Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sample scheduled viewings
              </p>
            </div>

            <CalendarCheck
              size={22}
              className="text-[#2A9D8F]"
            />
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#17324D]">
                      {appointment.service}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {appointment.id}
                    </p>
                  </div>

                  <span className="rounded-lg bg-[#E8F6F3] px-3 py-1 text-xs font-semibold text-[#2A9D8F]">
                    {appointment.time}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                  <span className="flex items-center gap-2">
                    <MapPin size={15} />
                    {appointment.location}
                  </span>

                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    {formatDate(appointment.date)}
                  </span>

                  <span className="flex items-center gap-2 sm:col-span-2">
                    <UserRound size={15} />
                    Viewer: {appointment.viewer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VIEWER APPLICATIONS */}
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
            {pendingViewerApplications.map((applicant) => (
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
                    Applied {formatDate(applicant.submitted)}
                  </p>
                </div>

                <Link
                  to="/admin/viewer-applications"
                  className="shrink-0 text-sm font-semibold text-[#2A9D8F] hover:underline"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* INFORMATION NOTICE */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <AlertCircle
          size={21}
          className="mt-0.5 shrink-0 text-blue-700"
        />

        <div>
          <h3 className="text-sm font-bold text-blue-900">
            Frontend Demonstration
          </h3>

          <p className="mt-1 text-sm leading-7 text-blue-800">
            This dashboard currently displays fictional
            sample data. Booking records, payment totals,
            viewer information, and activity statistics
            will be retrieved from the backend API
            after integration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
