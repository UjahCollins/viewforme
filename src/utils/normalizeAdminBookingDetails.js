
const bookingStatusMap = {
  PENDING_PAYMENT: "Pending",
  PAYMENT_RECEIVED: "Pending",
  AWAITING_CONFIRMATION: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const paymentStatusMap = {
  PENDING: "Unpaid",
  SUCCEEDED: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially Refunded",
};

export function normalizeAdminBookingDetails(data) {
  const payments = data.payments ?? [];

  const successfulPayment = payments.find(
    (payment) => payment.status === "SUCCEEDED"
  );

  const latestPayment = [...payments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )[0];

  const payment = successfulPayment ?? latestPayment;

  const dateOnly = (value) =>
    value ? value.slice(0, 10) : "";

  return {
    id: data.id,
    reference: data.reference,

    // Customer
    customer: data.customer?.fullName ?? "",
    email: data.customer?.email ?? "",
    phone: data.customer?.phone ?? "",
    customerNotes: data.customer?.notes ?? "",

    // Service
    serviceId: data.serviceId,
    service: data.service?.name ?? "Unknown Service",

    // Property
    propertyAddress: data.propertyAddress ?? "",
    propertyCity: data.propertyCity ?? "",
    propertyPostcode: data.propertyPostcode ?? "",

    location:
      [data.propertyCity, data.propertyPostcode]
        .filter(Boolean)
        .join(", ") || data.propertyAddress,

    specialInstructions:
      data.specialInstructions ?? "",

    // Appointment
    date: dateOnly(data.preferredDate),
    time: data.preferredTime ?? "",

    confirmedAt: data.confirmedAt ?? null,

    // Access
    accessContactName:
      data.accessContactName ?? "",

    accessContactPhone:
      data.accessContactPhone ?? "",

    accessNotes: data.accessNotes ?? "",

    // Booking
    status:
      bookingStatusMap[data.status] ??
      data.status,

    rawStatus: data.status,

    amount: Number(data.amount ?? 0),
    currency: data.currency ?? "GBP",

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,

    // Payment
    paymentStatus:
      paymentStatusMap[payment?.status] ??
      "Unpaid",

    rawPaymentStatus:
      payment?.status ?? "UNPAID",

    paidAt: successfulPayment?.paidAt ?? null,

    payments,

    // Assignment and reports
    assignments: data.assignments ?? [],
    reports: data.reports ?? [],

    confirmedBy: data.confirmedBy ?? null,
  };
}
