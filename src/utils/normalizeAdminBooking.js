
const bookingStatusLabels = {
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_RECEIVED: "Awaiting Confirmation",
  AWAITING_CONFIRMATION: "Awaiting Confirmation",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const paymentStatusLabels = {
  SUCCEEDED: "Paid",
  PENDING: "Pending",
  NOT_STARTED: "Unpaid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially Refunded",
};

export function normalizeAdminBooking(booking) {
  const payments = booking.payments ?? [];

  const payment =
    payments.find((item) => item.status === "SUCCEEDED") ??
    payments.find((item) => item.status === "PARTIALLY_REFUNDED") ??
    payments.find((item) => item.status === "REFUNDED") ??
    payments[0];

  return {
    id: booking.id,
    reference: booking.reference,

    customer: booking.customer?.fullName ?? "Unknown Customer",
    email: booking.customer?.email ?? "",
    phone: booking.customer?.phone ?? "",

    service: booking.service?.name ?? "Unknown Service",

    location: booking.propertyCity ?? "",
    propertyAddress: booking.propertyAddress ?? "",
    postcode: booking.propertyPostcode ?? "",

    date: booking.preferredDate
      ? booking.preferredDate.slice(0, 10)
      : "",

    time: booking.preferredTime ?? "",

    status:
      bookingStatusLabels[booking.status] ??
      booking.status,

    rawStatus: booking.status,

    paymentStatus: payment
      ? paymentStatusLabels[payment.status] ?? payment.status
      : "Unpaid",

    amount: Number(booking.amount ?? 0),
    currency: booking.currency ?? "GBP",
  };
}
