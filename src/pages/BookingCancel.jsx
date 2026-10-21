
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import {
  getBookingPaymentStatus,
  createCheckoutSession,
} from "../services/bookingApi.js";

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

function BookingCancel() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  const retryLock = useRef(false);

  const pendingBooking = getPendingBooking();

  useEffect(() => {
    let active = true;

    async function checkPayment() {
      if (
        !pendingBooking?.bookingId ||
        !pendingBooking?.bookingToken
      ) {
        setError(
          "Your booking session could not be found. Please contact our team if you have already made a payment."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await getBookingPaymentStatus(
          pendingBooking.bookingId,
          pendingBooking.bookingToken
        );

        if (active) {
          setPayment(response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Unable to check payment status."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkPayment();

    return () => {
      active = false;
    };
  }, []);

  const isPaid = payment?.paymentStatus === "SUCCEEDED";

  const handleRetryPayment = async () => {
    if (
      retryLock.current ||
      !pendingBooking?.bookingId ||
      !pendingBooking?.bookingToken
    ) {
      return;
    }

    retryLock.current = true;
    setRetrying(true);
    setError("");

    try {
      // Recheck immediately before attempting checkout.
      const statusResponse = await getBookingPaymentStatus(
        pendingBooking.bookingId,
        pendingBooking.bookingToken
      );

      const latestStatus = statusResponse.data;
      setPayment(latestStatus);

      if (latestStatus.paymentStatus === "SUCCEEDED") {
        throw new Error(
          "This booking has already been paid. No additional payment is required."
        );
      }

     if (latestStatus.requiresAttention) {
  throw new Error(
    "This payment requires attention. Please contact support."
  );
}

const canContinuePayment =
  latestStatus.paymentStatus === "PENDING" ||
  latestStatus.canRetryPayment;

if (!canContinuePayment) {
  throw new Error(
    "Payment cannot be continued at the moment. Please contact support."
  );
}

      const checkoutResponse = await createCheckoutSession(
        pendingBooking.bookingId,
        pendingBooking.bookingToken
      );

      const checkoutUrl = checkoutResponse?.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error(
          "The payment server did not return a checkout URL."
        );
      }

      const checkoutLocation = new URL(checkoutUrl);

      if (
        checkoutLocation.protocol !== "https:" ||
        checkoutLocation.hostname !== "checkout.stripe.com"
      ) {
        throw new Error("Invalid Stripe Checkout URL.");
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(
        err.message || "Unable to restart payment."
      );
    } finally {
      retryLock.current = false;
      setRetrying(false);
    }
  };

  return (
    <main className="min-h-[75vh] bg-[#F6F9FA] px-5 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm sm:p-12">
        {loading ? (
          <>
            <LoaderCircle
              size={54}
              className="mx-auto animate-spin text-[#2A9D8F]"
            />

            <h1 className="mt-6 text-2xl font-bold text-[#17324D]">
              Checking Payment Status
            </h1>
          </>
        ) : isPaid ? (
          <>
            <CheckCircle2
              size={64}
              className="mx-auto text-[#2A9D8F]"
            />

            <h1 className="mt-6 text-3xl font-bold text-[#17324D]">
              Your Payment Was Successful
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              This booking has already been paid.
              You do not need to make another payment.
            </p>

            <Link
              to="/booking/success"
              className="mt-8 inline-flex rounded-xl bg-[#2A9D8F] px-8 py-3.5 font-semibold text-white"
            >
              View Booking Confirmation
            </Link>
          </>
        ) : (
          <>
            <AlertCircle
              size={64}
              className="mx-auto text-amber-500"
            />

            <h1 className="mt-6 text-3xl font-bold text-[#17324D]">
              Payment Not Completed
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              Your booking payment has not been confirmed.
              If you cancelled checkout, you can try again
              when payment is available.
            </p>

            {payment?.bookingReference && (
              <p className="mt-5 text-sm text-slate-500">
                Booking reference:{" "}
                <strong>{payment.bookingReference}</strong>
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-5 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-[#17324D]"
              >
                <ArrowLeft size={18} />
                Back Home
              </Link>

              <button
                type="button"
                onClick={handleRetryPayment}
               disabled={
  retrying ||
  loading ||
  !payment ||
  payment.paymentStatus === "SUCCEEDED" ||
  payment.requiresAttention ||
  !(
    payment.paymentStatus === "PENDING" ||
    payment.canRetryPayment
  )
}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {retrying ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <CreditCard size={18} />
                )}

                {retrying
                  ? "Preparing Checkout..."
                  : "Retry Payment"}
              </button>
            </div>

            {!payment?.canRetryPayment && (
              <p className="mt-5 text-sm text-slate-500">
                Payment retry is currently unavailable.
                If you need assistance, please{" "}
                <Link
                  to="/contact"
                  className="font-semibold text-[#2A9D8F]"
                >
                  contact our team
                </Link>.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default BookingCancel;
