
import { api } from "./api";

// Fetch all available viewing services.
export async function getServices() {
  return api.get("/services");
}

// Create a new customer booking.
export async function createBooking(payload) {
  return api.post("/bookings", payload);
}

// Create or retrieve an existing Stripe Checkout Session.
export async function createCheckoutSession(bookingId, bookingToken) {
  return api.post(
    `/bookings/${bookingId}/checkout`,
    undefined,
    {
      headers: {
        "x-booking-token": bookingToken,
      },
    }
  );
}

// Retrieve the current payment status of a booking.
export async function getBookingPaymentStatus(bookingId, bookingToken) {
  return api.get(
    `/bookings/${bookingId}/payment-status`,
    {
      headers: {
        "x-booking-token": bookingToken,
      },
    }
  );
}

// Retrieve the booking summary.
export async function getBookingSummary(bookingId, bookingToken) {
  return api.get(
    `/bookings/${bookingId}/summary`,
    {
      headers: {
        "x-booking-token": bookingToken,
      },
    }
  );
}


export async function getBookingQuote(serviceId, property) {
  return api.post("/bookings/quote", {
    serviceId,
    property: {
      city: property.city,
      postcode: property.postcode,
    },
  });
}