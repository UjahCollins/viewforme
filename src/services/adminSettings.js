import { api } from "./api.js";

// ========================================
// GET ALL PLATFORM SETTINGS
// ========================================

export const getAdminSettings = () => {
  return api.get("/admin/settings");
};

// ========================================
// UPDATE BUSINESS INFORMATION
// ========================================

export const updateBusinessSettings = (data) => {
  return api.patch("/admin/settings/business", data);
};

// ========================================
// UPDATE BOOKING PREFERENCES
// ========================================

export const updateBookingSettings = (data) => {
  return api.patch("/admin/settings/booking", data);
};

// ========================================
// UPDATE NOTIFICATION PREFERENCES
// ========================================

export const updateNotificationSettings = (data) => {
  return api.patch("/admin/settings/notifications", data);
};

// ========================================
// GET SERVICES
// ========================================

export const getSettingsServices = () => {
  return api.get("/admin/settings/services");
};

// ========================================
// UPDATE SERVICE
// ========================================

export const updateSettingsService = (serviceId, data) => {
  return api.patch(
    `/admin/settings/services/${serviceId}`,
    data
  );
};