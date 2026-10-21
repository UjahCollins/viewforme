
export function buildBookingPayload(serviceId, formData) {
  const fullName = [
    formData.firstName?.trim(),
    formData.lastName?.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  const additionalInstructions = [
    formData.specialInstructions,
    formData.scheduleNotes,
    formData.alternativeDate
      ? `Alternative date: ${formData.alternativeDate}`
      : "",
    formData.alternativeTime
      ? `Alternative time: ${formData.alternativeTime}`
      : "",
    ...(formData.checklistItems || []),
    ...(formData.customChecklistItems || []),
  ]
    .filter(Boolean)
    .join("\n");

  const accessNotes = [
    formData.accessInstructions,
    formData.propertyContactType
      ? `Contact type: ${formData.propertyContactType}`
      : "",
    formData.propertyContactEmail
      ? `Contact email: ${formData.propertyContactEmail}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    serviceId,

    customer: {
      fullName,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      notes: `Preferred contact method: ${formData.contactPreference}`,
    },

    property: {
      address: formData.propertyAddress.trim(),
      city: formData.city.trim(),
      postcode: formData.postcode.trim(),
    },

    schedule: {
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
    },

    specialInstructions: additionalInstructions.slice(0, 2000),

    access: {
      contactName: formData.propertyContactName?.trim() || "",
      contactPhone: formData.propertyContactPhone?.trim() || "",
      notes: accessNotes.slice(0, 2000),
    },
  };
}
