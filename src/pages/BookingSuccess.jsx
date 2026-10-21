
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

import { getBookingPaymentStatus } from "../services/bookingApi.js";

function getPendingBooking() {
  try {
    const stored = sessionStorage.getItem(
      "viewforme_pending_booking"
    );

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function BookingSuccess() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const pendingBooking = getPendingBooking();

    if (
      !pendingBooking?.bookingId ||
      !pendingBooking?.bookingToken
    ) {
      setError(
        "We couldn't retrieve your booking details from this browser session. Please contact our team if you have completed payment."
      );
      setLoading(false);
      return;
    }

    async function verifyPayment() {
      const maxAttempts = 6;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (!active) return;

        try {
          const response = await getBookingPaymentStatus(
            pendingBooking.bookingId,
            pendingBooking.bookingToken
          );

          if (!active) return;

          setPayment(response.data);
          setError("");

          if (response.data.paymentStatus === "SUCCEEDED") {
            setLoading(false);
            return;
          }

          if (response.data.requiresAttention) {
            setLoading(false);
            return;
          }
        } catch (err) {
          if (!active) return;

          setError(
            err.message ||
              "Unable to verify your payment right now."
          );

          setLoading(false);
          return;
        }

        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );
        }
      }

      if (active) {
        setLoading(false);
      }
    }

    verifyPayment();

    return () => {
      active = false;
    };
  }, []);

  const isPaid = payment?.paymentStatus === "SUCCEEDED";

  const formattedAmount = payment
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: payment.currency || "GBP",
      }).format(Number(payment.amount))
    : null;

  return (
    <main className="min-h-[75vh] bg-[#F6F9FA] px-5 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-7 shadow-sm sm:p-12">
        {loading ? (
          <div className="text-center">
            <LoaderCircle
              size={54}
              className="mx-auto animate-spin text-[#2A9D8F]"
            />

            <h1 className="mt-6 text-2xl font-bold text-[#17324D]">
              Verifying Your Payment
            </h1>

            <p className="mt-4 text-slate-600">
              Please wait while we confirm your payment
              with our secure payment system.
            </p>
          </div>
        ) : isPaid ? (
          <div className="text-center">
            <CheckCircle2
              size={64}
              className="mx-auto text-[#2A9D8F]"
            />

            <h1 className="mt-6 text-3xl font-extrabold text-[#17324D]">
              Payment Successful!
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              Thank you for booking with ViewForMe.
              Your payment has been received successfully.
              Our team will review your booking and contact
              you regarding your viewing appointment.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl bg-[#F6F9FA] p-6 text-left">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Booking Reference
                </span>
                <span className="font-semibold text-[#17324D]">
                  {payment.bookingReference}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Amount Paid
                </span>
                <span className="font-semibold text-[#17324D]">
                  {formattedAmount}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Payment Status
                </span>
                <span className="font-semibold text-[#2A9D8F]">
                  Successful
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Booking Status
                </span>
                <span className="font-semibold text-[#17324D]">
                  {payment.bookingStatus
                    ?.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#F0FAF8] p-4 text-left">
              <Clock3
                size={20}
                className="mt-1 shrink-0 text-[#2A9D8F]"
              />

              <p className="text-sm leading-6 text-[#226E66]">
                Your viewing appointment is awaiting
                confirmation. Please keep your booking
                reference for future enquiries.
              </p>
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-8 py-3.5 font-semibold text-white transition hover:bg-[#238579]"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <AlertCircle
              size={60}
              className="mx-auto text-amber-500"
            />

            <h1 className="mt-6 text-2xl font-bold text-[#17324D]">
              Payment Not Yet Confirmed
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              {error ||
                "We haven't received final payment confirmation yet. Please don't make another payment until your current transaction has been verified."}
            </p>

            {payment?.bookingReference && (
              <p className="mt-4 text-sm text-slate-500">
                Booking reference:{" "}
                <strong>{payment.bookingReference}</strong>
              </p>
            )}

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#17324D] px-8 py-3.5 font-semibold text-white"
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default BookingSuccess;
