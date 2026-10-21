
export function getBookingSubmissionKey(payload) {
  return JSON.stringify(payload);
}

export function getSavedBooking(submissionKey) {
  try {
    const stored = sessionStorage.getItem(
      "viewforme_pending_booking"
    );

    if (!stored) return null;

    const saved = JSON.parse(stored);

    if (
      saved.submissionKey !== submissionKey ||
      !saved.bookingId ||
      !saved.bookingToken
    ) {
      return null;
    }

    return saved;
  } catch {
    return null;
  }
}

export function savePendingBooking(booking) {
  sessionStorage.setItem(
    "viewforme_pending_booking",
    JSON.stringify(booking)
  );
}
