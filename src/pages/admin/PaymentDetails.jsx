
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  Receipt,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

import { paymentTransactions } from "../../data/adminMockData";

const formatCurrency = (amount, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);

const formatDate = (value) => {
  if (!value) return "Not recorded";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-5">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-all text-sm font-semibold text-[#17324D] sm:text-right">
        {value || "Not available"}
      </span>
    </div>
  );
}

function PaymentDetails() {
  const { id } = useParams();

  const payment = paymentTransactions.find(
    (item) => item.id === id
  );

  if (!payment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          Transaction Not Found
        </h1>

        <Link
          to="/admin/payments"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-[#2A9D8F]"
        >
          <ArrowLeft size={17} />
          Back to Payments
        </Link>
      </div>
    );
  }

  const netAmount =
    ["Paid", "Refunded", "Partially Refunded"].includes(
      payment.status
    )
      ? payment.amount - payment.refundedAmount
      : 0;

  return (
    <div className="space-y-8">
      <Link
        to="/admin/payments"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2A9D8F]"
      >
        <ArrowLeft size={18} />
        Back to Payments
      </Link>

      {/* HEADER */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Transaction {payment.id}
          </h1>

          <StatusBadge status={payment.status} />
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Payment information for booking{" "}
          {payment.bookingId}
        </p>

        <p className="mt-2 text-xs font-semibold text-amber-700">
          Demo transaction — not verified by Stripe
        </p>
      </div>

      {/* AMOUNT SUMMARY */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          {
            label: "Transaction Amount",
            value: formatCurrency(
              payment.amount,
              payment.currency
            ),
          },
          {
            label: "Refunded Amount",
            value: formatCurrency(
              payment.refundedAmount,
              payment.currency
            ),
          },
          {
            label: "Net Amount Before Fees",
            value: formatCurrency(
              netAmount,
              payment.currency
            ),
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-sm text-slate-500">
              {item.label}
            </p>

            <p className="mt-3 text-2xl font-extrabold text-[#17324D]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* TRANSACTION DETAILS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <Receipt
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Transaction Information
              </h2>
            </div>

            <InfoRow
              label="Transaction ID"
              value={payment.id}
            />

            <InfoRow
              label="Booking ID"
              value={
                <Link
                  to={`/admin/bookings/${payment.bookingId}`}
                  className="text-[#2A9D8F] hover:underline"
                >
                  {payment.bookingId}
                </Link>
              }
            />

            <InfoRow
              label="Customer"
              value={payment.customer}
            />

            <InfoRow
              label="Email"
              value={payment.email}
            />

            <InfoRow
              label="Amount"
              value={formatCurrency(
                payment.amount,
                payment.currency
              )}
            />

            <InfoRow
              label="Currency"
              value={payment.currency}
            />

            <InfoRow
              label="Payment Method"
              value={payment.method}
            />

            <InfoRow
              label="Provider"
              value={payment.provider}
            />

            <InfoRow
              label="Created"
              value={formatDate(payment.createdAt)}
            />

            <InfoRow
              label="Paid"
              value={formatDate(payment.paidAt)}
            />
          </section>

          {/* STRIPE REFERENCES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <CreditCard
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Payment Provider References
              </h2>
            </div>

            <InfoRow
              label="Checkout Session"
              value={payment.stripeSessionId}
            />

            <InfoRow
              label="Payment Intent"
              value={payment.stripePaymentIntentId}
            />

            <p className="mt-5 text-xs leading-6 text-slate-500">
              These are fictional Stripe references.
              Production references will be generated
              and verified through the backend.
            </p>
          </section>

          {/* REFUND DETAILS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <RefreshCw
                size={22}
                className="text-[#2A9D8F]"
              />

              <h2 className="text-lg font-bold text-[#17324D]">
                Refund Information
              </h2>
            </div>

            <InfoRow
              label="Refunded Amount"
              value={formatCurrency(
                payment.refundedAmount,
                payment.currency
              )}
            />

            <InfoRow
              label="Refund Date"
              value={formatDate(payment.refundedAt)}
            />

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Refund requests will be managed
              through a secure backend workflow.
              No refund action is available
              in this frontend demonstration.
            </p>
          </section>

          {/* FAILURE INFORMATION */}
          {payment.status === "Failed" && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="text-lg font-bold text-red-800">
                Payment Failure
              </h2>

              <p className="mt-3 text-sm leading-7 text-red-700">
                {payment.failureReason ||
                  "No failure reason recorded."}
              </p>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-[#17324D]">
              Payment Status
            </h2>

            <div className="mt-5">
              <StatusBadge status={payment.status} />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Payment status is read-only.
              It must be derived from trusted
              backend payment records and
              Stripe verification.
            </p>
          </section>

          <div className="rounded-2xl bg-[#17324D] p-6 text-white">
            <ShieldCheck
              size={25}
              className="text-[#78D6C9]"
            />

            <h3 className="mt-4 text-lg font-bold">
              Payment Security
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Never confirm a booking payment
              solely because the customer
              reaches a success page.
              The backend must verify the
              payment with Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;