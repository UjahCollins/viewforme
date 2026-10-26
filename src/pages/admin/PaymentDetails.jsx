
import { useEffect, useState } from "react";
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
import { getAdminPaymentById, reconcileAdminPayment, } from "../../services/adminPaymentService";

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
  }).format(Number(amount ?? 0));

const formatDate = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(date);
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-5">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-all text-sm font-semibold text-[#17324D] sm:text-right">
        {value ?? "Not available"}
      </span>
    </div>
  );
}

function PaymentDetails() {
  const { id } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reconciling, setReconciling] = useState(false);
const [reconcileError, setReconcileError] = useState("");
const [reconcileMessage, setReconcileMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPayment() {
      try {
        setLoading(true);
        setError("");
        setPayment(null);

        const response = await getAdminPaymentById(id);

        if (!active) return;

        setPayment(response.data);
      } catch (err) {
        if (!active) return;

        console.error("Failed to load payment:", err);

        setError(
          err.message || "Unable to load payment details."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadPayment();
    } else {
      setLoading(false);
      setError("Payment ID is missing.");
    }

    return () => {
      active = false;
    };
  }, [id]);

  
async function handleReconcile() {
  if (!payment?.stripeCheckoutSessionId || reconciling) {
    return;
  }

  try {
    setReconciling(true);
    setReconcileError("");
    setReconcileMessage("");

    await reconcileAdminPayment(payment.id);

    const refreshed = await getAdminPaymentById(payment.id);

    setPayment(refreshed.data);

    setReconcileMessage(
      "Payment status refreshed from Stripe successfully."
    );
  } catch (err) {
    console.error("Payment reconciliation failed:", err);

    setReconcileError(
      err.message || "Unable to reconcile this payment."
    );
  } finally {
    setReconciling(false);
  }
}


  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <RefreshCw
          size={32}
          className="mx-auto animate-spin text-[#2A9D8F]"
        />

        <p className="mt-4 text-sm text-slate-600">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#17324D]">
          {error ? "Unable to Load Transaction" : "Transaction Not Found"}
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          {error || "The requested transaction could not be found."}
        </p>

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

  const status = statusMap[payment.status] ?? payment.status;

  const amount = Number(payment.amount ?? 0);
  const refundedAmount = Number(payment.refundedAmount ?? 0);

  const isSuccessful = [
    "SUCCEEDED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
  ].includes(payment.status);

  const netAmount = isSuccessful
    ? Math.max(0, amount - refundedAmount)
    : 0;

  const booking = payment.booking;
  const customer = booking?.customer;
  const service = booking?.service;

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
          <h1 className="break-all text-2xl font-extrabold text-[#17324D] sm:text-3xl">
            Transaction {payment.id}
          </h1>

          <StatusBadge status={status} />
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Payment information for booking{" "}
          {booking?.reference ?? "Not available"}
        </p>
      </div>

      {/* AMOUNT SUMMARY */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          {
            label: "Transaction Amount",
            value: formatCurrency(amount, payment.currency),
          },
          {
            label: "Refunded Amount",
            value: formatCurrency(
              refundedAmount,
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
              <Receipt size={22} className="text-[#2A9D8F]" />

              <h2 className="text-lg font-bold text-[#17324D]">
                Transaction Information
              </h2>
            </div>

            <InfoRow
              label="Transaction ID"
              value={payment.id}
            />

            <InfoRow
              label="Booking Reference"
              value={
                booking?.id ? (
                  <Link
                    to={`/admin/bookings/${booking.id}`}
                    className="text-[#2A9D8F] hover:underline"
                  >
                    {booking.reference}
                  </Link>
                ) : (
                  "Not available"
                )
              }
            />

            <InfoRow
              label="Booking Status"
              value={booking?.status}
            />

            <InfoRow
              label="Service"
              value={service?.name}
            />

            <InfoRow
              label="Customer"
              value={customer?.fullName}
            />

            <InfoRow
              label="Email"
              value={customer?.email}
            />

            <InfoRow
              label="Phone"
              value={customer?.phone}
            />

            <InfoRow
              label="Amount"
              value={formatCurrency(
                amount,
                payment.currency
              )}
            />

            <InfoRow
              label="Currency"
              value={payment.currency}
            />

            <InfoRow
              label="Payment Provider"
              value="Stripe"
            />

            <InfoRow
              label="Payment Method"
              value="Not recorded"
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
              <CreditCard size={22} className="text-[#2A9D8F]" />

              <h2 className="text-lg font-bold text-[#17324D]">
                Payment Provider References
              </h2>
            </div>

            <InfoRow
              label="Checkout Session"
              value={payment.stripeCheckoutSessionId}
            />

            <InfoRow
              label="Payment Intent"
              value={payment.stripePaymentIntentId}
            />

            <p className="mt-5 text-xs leading-6 text-slate-500">
              These references were recorded by the backend
              during the Stripe Checkout payment process.
              Payment status is maintained through trusted
              Stripe verification and reconciliation.
            </p>
          </section>

          {/* REFUND DETAILS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <RefreshCw size={22} className="text-[#2A9D8F]" />

              <h2 className="text-lg font-bold text-[#17324D]">
                Refund Information
              </h2>
            </div>

            <InfoRow
              label="Refunded Amount"
              value={formatCurrency(
                refundedAmount,
                payment.currency
              )}
            />

            <InfoRow
              label="Refund Date"
              value={formatDate(payment.refundedAt)}
            />

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Refunds must be processed through Stripe
              and verified by the backend before the
              payment record is updated.
            </p>
          </section>

          {/* FAILURE INFORMATION */}
          {payment.status === "FAILED" && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="text-lg font-bold text-red-800">
                Payment Failure
              </h2>

              <p className="mt-3 text-sm leading-7 text-red-700">
                No failure reason is currently recorded
                for this transaction.
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
              <StatusBadge status={status} />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Payment status is read-only and is derived
              from backend payment records maintained
              through Stripe verification.
            </p>

            <button
  type="button"
  onClick={handleReconcile}
  disabled={
    reconciling ||
    !payment.stripeCheckoutSessionId
  }
  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
>
  <RefreshCw
    size={17}
    className={reconciling ? "animate-spin" : ""}
  />

  {reconciling ? "Checking Stripe..." : "Refresh from Stripe"}
</button>

{reconcileMessage && (
  <p role="status" className="mt-3 text-sm text-green-700">
    {reconcileMessage}
  </p>
)}

{reconcileError && (
  <p role="alert" className="mt-3 text-sm text-red-600">
    {reconcileError}
  </p>
)}
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
              A successful payment must be verified
              by the backend using Stripe before
              the booking payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;
