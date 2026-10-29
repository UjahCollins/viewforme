import { useEffect, useState } from "react";

import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Bell,
  UserRound,
  ShieldCheck,
  Save,
  RotateCcw,
  Info,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import { getCurrentAdmin } from "../../services/adminAuthApi.js";

import {
  getAdminSettings,
  updateBusinessSettings,
  updateBookingSettings,
  updateNotificationSettings,
  getSettingsServices,
  updateSettingsService,
} from "../../services/adminSettings.js";

const sections = [
  {
    id: "business",
    label: "Business Information",
    icon: Building2,
  },
  {
    id: "services",
    label: "Services & Pricing",
    icon: BriefcaseBusiness,
  },
  {
    id: "booking",
    label: "Booking Preferences",
    icon: CalendarDays,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "administrator",
    label: "Administrator Profile",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Security & Integrations",
    icon: ShieldCheck,
  },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17324D] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#17324D]";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

const clone = (value) => structuredClone(value);

const defaultSettings = {
  business: {
    name: "",
    tagline: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  },

  booking: {
    minimumNoticeHours: 24,
    maximumAdvanceDays: 90,
    appointmentStartTime: "09:00",
    appointmentEndTime: "18:00",
    requirePaymentBeforeCoordination: true,
    requireAccessConfirmation: true,
    requireViewerConfirmation: true,
  },

  notifications: {
    newBooking: true,
    paymentReceived: true,
    newViewerApplication: true,
    newEnquiry: true,
    reportReady: true,
    bookingCancelled: true,
  },

  services: [],

  administrator: {
    name: "",
    email: "",
    role: "",
  },
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#17324D]">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 shrink-0 accent-[#2A9D8F]"
      />
    </label>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-7">
      <h2 className="text-xl font-extrabold text-[#17324D]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Settings() {
  const [activeSection, setActiveSection] =
    useState("business");

  const [settings, setSettings] = useState(
    clone(defaultSettings)
  );

  const [savedSettings, setSavedSettings] = useState(
    clone(defaultSettings)
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  const showNotice = (message, type = "info") => {
    setNotice(message);
    setNoticeType(type);
  };

  // =========================================
  // LOAD SETTINGS
  // =========================================

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        setLoading(true);

        const [
          settingsResponse,
          servicesResponse,
          adminResponse,
        ] = await Promise.all([
          getAdminSettings(),
          getSettingsServices(),
          getCurrentAdmin(),
        ]);

        if (cancelled) return;

        const platformData =
          settingsResponse?.data ?? {};

        const servicesData =
          servicesResponse?.data?.services ?? [];

        const adminData =
          adminResponse?.data?.admin ??
          adminResponse?.admin ??
          adminResponse?.data ??
          {};

        const loadedSettings = {
          business: {
            ...defaultSettings.business,
            ...(platformData.business ?? {}),
          },

          booking: {
            ...defaultSettings.booking,
            ...(platformData.booking ?? {}),
          },

          notifications: {
            ...defaultSettings.notifications,
            ...(platformData.notifications ?? {}),
          },

          services: Array.isArray(servicesData)
            ? servicesData
            : [],

          administrator: {
            name:
              adminData.fullName ??
              adminData.name ??
              "",
            email: adminData.email ?? "",
            role: adminData.role ?? "",
          },
        };

        setSettings(clone(loadedSettings));
        setSavedSettings(clone(loadedSettings));
        setNotice("");
      } catch (error) {
        if (cancelled) return;

        console.error("LOAD SETTINGS ERROR:", error);

        showNotice(
          error.message ||
            "Unable to load admin settings.",
          "error"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================
  // UPDATE LOCAL STATE
  // =========================================

  const updateBusiness = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      business: {
        ...previous.business,
        [field]: value,
      },
    }));

    setNotice("");
  };

  const updateBooking = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      booking: {
        ...previous.booking,
        [field]: value,
      },
    }));

    setNotice("");
  };

  const updateNotification = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      notifications: {
        ...previous.notifications,
        [field]: value,
      },
    }));

    setNotice("");
  };

  const updateService = (serviceId, field, value) => {
    setSettings((previous) => ({
      ...previous,

      services: previous.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: value,
            }
          : service
      ),
    }));

    setNotice("");
  };

  // =========================================
  // VALIDATION
  // =========================================

  const validateBusiness = () => {
    const business = settings.business;

    if (!business.name.trim()) {
      return "Business name is required.";
    }

    if (!business.email.trim()) {
      return "Support email is required.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(business.email)) {
      return "Enter a valid support email.";
    }

    if (business.website) {
      try {
        const url = new URL(business.website);

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
          return "Enter a valid website URL.";
        }
      } catch {
        return "Enter a valid website URL.";
      }
    }

    return null;
  };

  const validateBooking = () => {
    const booking = settings.booking;

    if (
      !Number.isInteger(booking.minimumNoticeHours) ||
      booking.minimumNoticeHours < 0
    ) {
      return "Minimum notice must be a valid non-negative number.";
    }

    if (
      !Number.isInteger(booking.maximumAdvanceDays) ||
      booking.maximumAdvanceDays < 1
    ) {
      return "Maximum advance booking must be at least one day.";
    }

    if (
      !booking.appointmentStartTime ||
      !booking.appointmentEndTime ||
      booking.appointmentStartTime >=
        booking.appointmentEndTime
    ) {
      return "Appointment end time must be later than start time.";
    }

    return null;
  };

  const validateServices = () => {
    for (const service of settings.services) {
      if (service.pricingType === "QUOTE") {
        continue;
      }

      const price = service.startingPrice;

      if (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0 ||
        Math.abs(price * 100 - Math.round(price * 100)) >
          0.000001
      ) {
        return `Enter a valid price for ${service.name}.`;
      }
    }

    return null;
  };

  // =========================================
  // SAVE SETTINGS
  // =========================================

  const handleSave = async () => {
    if (saving || loading) return;

    let validationError = null;

    if (activeSection === "business") {
      validationError = validateBusiness();
    }

    if (activeSection === "booking") {
      validationError = validateBooking();
    }

    if (activeSection === "services") {
      validationError = validateServices();
    }

    if (validationError) {
      showNotice(validationError, "error");
      return;
    }

    try {
      setSaving(true);
      setNotice("");

      if (activeSection === "business") {
        const response = await updateBusinessSettings(
          settings.business
        );

        const updatedBusiness =
          response?.data?.business ??
          settings.business;

        setSettings((previous) => ({
          ...previous,
          business: clone(updatedBusiness),
        }));

        setSavedSettings((previous) => ({
          ...previous,
          business: clone(updatedBusiness),
        }));
      }

      if (activeSection === "booking") {
        const response = await updateBookingSettings(
          settings.booking
        );

        const updatedBooking =
          response?.data?.booking ??
          settings.booking;

        setSettings((previous) => ({
          ...previous,
          booking: clone(updatedBooking),
        }));

        setSavedSettings((previous) => ({
          ...previous,
          booking: clone(updatedBooking),
        }));
      }

      if (activeSection === "notifications") {
        const response =
          await updateNotificationSettings(
            settings.notifications
          );

        const updatedNotifications =
          response?.data?.notifications ??
          settings.notifications;

        setSettings((previous) => ({
          ...previous,
          notifications: clone(updatedNotifications),
        }));

        setSavedSettings((previous) => ({
          ...previous,
          notifications: clone(updatedNotifications),
        }));
      }

      if (activeSection === "services") {
        const originalServices = savedSettings.services;

        const changedServices = settings.services.filter(
          (service) => {
            const original = originalServices.find(
              (item) => item.id === service.id
            );

            if (!original) return false;

            return (
              service.enabled !== original.enabled ||
              (service.pricingType !== "QUOTE" &&
                service.startingPrice !==
                  original.startingPrice)
            );
          }
        );

        if (changedServices.length === 0) {
          showNotice(
            "No service changes to save.",
            "info"
          );
          return;
        }

        const results = await Promise.allSettled(
          changedServices.map((service) => {
            const original = originalServices.find(
              (item) => item.id === service.id
            );

            const payload = {};

            if (service.enabled !== original.enabled) {
              payload.enabled = service.enabled;
            }

            if (
              service.pricingType !== "QUOTE" &&
              service.startingPrice !==
                original.startingPrice
            ) {
              payload.startingPrice =
                service.startingPrice;
            }

            return updateSettingsService(
              service.id,
              payload
            );
          })
        );

        // Reload services after updates, including partial success.
        const refreshedResponse =
          await getSettingsServices();

        const refreshedServices =
          refreshedResponse?.data?.services ?? [];

        setSettings((previous) => ({
          ...previous,
          services: clone(refreshedServices),
        }));

        setSavedSettings((previous) => ({
          ...previous,
          services: clone(refreshedServices),
        }));

        const failedCount = results.filter(
          (result) => result.status === "rejected"
        ).length;

        if (failedCount > 0) {
          showNotice(
            `${failedCount} service update(s) failed. Successfully saved changes have been reloaded.`,
            "error"
          );
          return;
        }
      }

      showNotice(
        "Settings saved successfully.",
        "success"
      );
    } catch (error) {
      console.error("SAVE SETTINGS ERROR:", error);

      showNotice(
        error.message ||
          "Failed to save settings. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // RESET UNSAVED CHANGES
  // =========================================

  const resetSettings = () => {
    if (saving) return;

    setSettings((previous) => ({
      ...previous,

      [activeSection]: clone(
        savedSettings[activeSection]
      ),
    }));

    showNotice(
      "Unsaved changes have been discarded.",
      "info"
    );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#2A9D8F] border-t-transparent" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading admin settings...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-extrabold text-[#17324D] sm:text-3xl">
          Admin Settings
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Manage business information, services,
          operational preferences, and platform settings.
        </p>
      </div>

      {/* NOTICE */}

      {notice && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            noticeType === "success"
              ? "border-green-200 bg-green-50"
              : noticeType === "error"
              ? "border-red-200 bg-red-50"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          {noticeType === "success" ? (
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-green-700"
            />
          ) : (
            <Info
              size={20}
              className={`mt-0.5 shrink-0 ${
                noticeType === "error"
                  ? "text-red-700"
                  : "text-blue-700"
              }`}
            />
          )}

          <p
            className={`text-sm leading-7 ${
              noticeType === "success"
                ? "text-green-800"
                : noticeType === "error"
                ? "text-red-800"
                : "text-blue-800"
            }`}
          >
            {notice}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* SETTINGS NAVIGATION */}

        <aside className="min-w-0">
          <nav
            aria-label="Settings sections"
            className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 lg:flex-col"
          >
            {sections.map((section) => {
              const Icon = section.icon;

              const isActive =
                activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setActiveSection(section.id);
                    setNotice("");
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition lg:w-full ${
                    isActive
                      ? "bg-[#E8F6F3] text-[#247F75]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={19} />

                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* SETTINGS CONTENT */}

        <div className="min-w-0">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            {/* =====================================
                BUSINESS INFORMATION
            ===================================== */}

            {activeSection === "business" && (
              <>
                <SectionHeading
                  title="Business Information"
                  description="Manage the public-facing details of the ViewForMe business."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Business Name">
                    <input
                      type="text"
                      value={settings.business.name}
                      onChange={(event) =>
                        updateBusiness(
                          "name",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Tagline">
                    <input
                      type="text"
                      value={settings.business.tagline}
                      onChange={(event) =>
                        updateBusiness(
                          "tagline",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Support Email">
                    <input
                      type="email"
                      value={settings.business.email}
                      onChange={(event) =>
                        updateBusiness(
                          "email",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Support Phone">
                    <input
                      type="tel"
                      value={settings.business.phone}
                      onChange={(event) =>
                        updateBusiness(
                          "phone",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Website">
                    <input
                      type="url"
                      value={settings.business.website}
                      onChange={(event) =>
                        updateBusiness(
                          "website",
                          event.target.value
                        )
                      }
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Business Location">
                    <input
                      type="text"
                      value={settings.business.address}
                      onChange={(event) =>
                        updateBusiness(
                          "address",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </>
            )}

            {/* =====================================
                SERVICES & PRICING
            ===================================== */}

            {activeSection === "services" && (
              <>
                <SectionHeading
                  title="Services & Pricing"
                  description="Manage available services and pricing. Fixed-price bookings must use prices calculated by the backend."
                />

                <div className="space-y-5">
                  {settings.services.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No services found.
                    </p>
                  )}

                  {settings.services.map((service) => {
                    const isQuote =
                      service.pricingType === "QUOTE";

                    return (
                      <div
                        key={service.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-[#17324D]">
                              {service.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {service.slug}
                            </p>
                          </div>

                          <label className="flex items-center gap-2 text-sm font-semibold text-[#17324D]">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                service.enabled
                              )}
                              onChange={(event) =>
                                updateService(
                                  service.id,
                                  "enabled",
                                  event.target.checked
                                )
                              }
                              className="h-5 w-5 accent-[#2A9D8F]"
                            />

                            Enabled
                          </label>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-slate-500">
                          {service.description ||
                            "No description available."}
                        </p>

                        {isQuote ? (
                          <div className="mt-5 rounded-xl bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-800">
                              Quotation-Based Service
                            </p>

                            <p className="mt-1 text-xs leading-6 text-amber-700">
                              Pricing is determined through
                              an individual quotation rather
                              than a fixed service price.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="mt-5 max-w-xs">
                              <Field label="Starting Price (GBP)">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    service.startingPrice ??
                                    ""
                                  }
                                  onChange={(event) =>
                                    updateService(
                                      service.id,
                                      "startingPrice",
                                      event.target.value ===
                                        ""
                                        ? null
                                        : Number(
                                            event.target.value
                                          )
                                    )
                                  }
                                  className={inputClass}
                                />
                              </Field>
                            </div>

                            <p className="mt-3 text-xs text-slate-500">
                              Current price:{" "}
                              {typeof service.startingPrice ===
                                "number" &&
                              Number.isFinite(
                                service.startingPrice
                              )
                                ? formatCurrency(
                                    service.startingPrice
                                  )
                                : "Invalid amount"}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* =====================================
                BOOKING PREFERENCES
            ===================================== */}

            {activeSection === "booking" && (
              <>
                <SectionHeading
                  title="Booking Preferences"
                  description="Configure booking rules and operational requirements for ViewForMe."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Minimum Notice (Hours)">
                    <input
                      type="number"
                      min="0"
                      value={
                        settings.booking
                          .minimumNoticeHours ?? ""
                      }
                      onChange={(event) =>
                        updateBooking(
                          "minimumNoticeHours",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Maximum Advance Booking (Days)">
                    <input
                      type="number"
                      min="1"
                      value={
                        settings.booking
                          .maximumAdvanceDays ?? ""
                      }
                      onChange={(event) =>
                        updateBooking(
                          "maximumAdvanceDays",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Appointment Window Starts">
                    <input
                      type="time"
                      value={
                        settings.booking
                          .appointmentStartTime
                      }
                      onChange={(event) =>
                        updateBooking(
                          "appointmentStartTime",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Appointment Window Ends">
                    <input
                      type="time"
                      value={
                        settings.booking
                          .appointmentEndTime
                      }
                      onChange={(event) =>
                        updateBooking(
                          "appointmentEndTime",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-7 border-t border-slate-100 pt-4">
                  <Toggle
                    label="Require Payment Before Coordination"
                    description="Do not begin the normal coordination workflow until payment is verified."
                    checked={
                      settings.booking
                        .requirePaymentBeforeCoordination
                    }
                    onChange={(value) =>
                      updateBooking(
                        "requirePaymentBeforeCoordination",
                        value
                      )
                    }
                  />

                  <Toggle
                    label="Require Property Access Confirmation"
                    description="Property access must be arranged before confirming the appointment."
                    checked={
                      settings.booking
                        .requireAccessConfirmation
                    }
                    onChange={(value) =>
                      updateBooking(
                        "requireAccessConfirmation",
                        value
                      )
                    }
                  />

                  <Toggle
                    label="Require Viewer Confirmation"
                    description="A viewer must be assigned and confirmed before the appointment is finalized."
                    checked={
                      settings.booking
                        .requireViewerConfirmation
                    }
                    onChange={(value) =>
                      updateBooking(
                        "requireViewerConfirmation",
                        value
                      )
                    }
                  />
                </div>

                <p className="mt-5 text-xs leading-6 text-amber-700">
                  These preferences are saved to the database.
                  The booking backend must enforce the
                  configured rules before they become
                  operational. Payment verification and other
                  mandatory security safeguards must remain
                  enforced regardless of these settings.
                </p>
              </>
            )}

            {/* =====================================
                NOTIFICATIONS
            ===================================== */}

            {activeSection === "notifications" && (
              <>
                <SectionHeading
                  title="Notification Preferences"
                  description="Choose which events should generate administrative notifications."
                />

                <Toggle
                  label="New Booking"
                  description="Notify administrators when a new booking is received."
                  checked={
                    settings.notifications.newBooking
                  }
                  onChange={(value) =>
                    updateNotification(
                      "newBooking",
                      value
                    )
                  }
                />

                <Toggle
                  label="Payment Received"
                  description="Notify administrators when a booking payment is verified."
                  checked={
                    settings.notifications
                      .paymentReceived
                  }
                  onChange={(value) =>
                    updateNotification(
                      "paymentReceived",
                      value
                    )
                  }
                />

                <Toggle
                  label="New Viewer Application"
                  description="Notify administrators when someone applies to become a viewer."
                  checked={
                    settings.notifications
                      .newViewerApplication
                  }
                  onChange={(value) =>
                    updateNotification(
                      "newViewerApplication",
                      value
                    )
                  }
                />

                <Toggle
                  label="New Customer Enquiry"
                  description="Notify administrators about new contact form submissions."
                  checked={
                    settings.notifications.newEnquiry
                  }
                  onChange={(value) =>
                    updateNotification(
                      "newEnquiry",
                      value
                    )
                  }
                />

                <Toggle
                  label="Report Ready"
                  description="Notify administrators when a report is ready for customer delivery."
                  checked={
                    settings.notifications.reportReady
                  }
                  onChange={(value) =>
                    updateNotification(
                      "reportReady",
                      value
                    )
                  }
                />

                <Toggle
                  label="Booking Cancellation"
                  description="Notify administrators when a booking is cancelled."
                  checked={
                    settings.notifications
                      .bookingCancelled
                  }
                  onChange={(value) =>
                    updateNotification(
                      "bookingCancelled",
                      value
                    )
                  }
                />

                <p className="mt-5 text-xs leading-6 text-amber-700">
                  Notification preferences are stored in the
                  database. Actual email or in-app
                  notifications will require integration with
                  the notification service.
                </p>
              </>
            )}

            {/* =====================================
                ADMINISTRATOR PROFILE
            ===================================== */}

            {activeSection === "administrator" && (
              <>
                <SectionHeading
                  title="Administrator Profile"
                  description="View the details of your authenticated administrator account."
                />

                <div className="flex items-center gap-4 rounded-2xl bg-[#F6F9FA] p-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F6F3] text-[#2A9D8F]">
                    <UserRound size={30} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#17324D]">
                      {settings.administrator.name ||
                        "Administrator"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {settings.administrator.role ||
                        "Admin"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Administrator Name">
                    <input
                      type="text"
                      readOnly
                      value={
                        settings.administrator.name
                      }
                      className={`${inputClass} bg-slate-50`}
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      type="email"
                      readOnly
                      value={
                        settings.administrator.email
                      }
                      className={`${inputClass} bg-slate-50`}
                    />
                  </Field>

                  <Field label="Role">
                    <input
                      type="text"
                      readOnly
                      value={
                        settings.administrator.role
                      }
                      className={`${inputClass} bg-slate-50`}
                    />
                  </Field>
                </div>

                <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm leading-7 text-blue-800">
                    Administrator information is retrieved
                    from your authenticated account.
                    Profile editing, password updates, and
                    role management will be implemented
                    through secure backend endpoints.
                  </p>
                </div>
              </>
            )}

            {/* =====================================
                SECURITY & INTEGRATIONS
            ===================================== */}

            {activeSection === "security" && (
              <>
                <SectionHeading
                  title="Security & Integrations"
                  description="Review platform integrations and security requirements."
                />

                <div className="space-y-4">
                  {[
                    {
                      label: "Stripe Payments",
                      status:
                        "Configured — not verified here",
                    },
                    {
                      label: "Email Service",
                      status: "Not verified",
                    },
                    {
                      label: "Database",
                      status: "Not verified",
                    },
                    {
                      label: "File Storage",
                      status: "Not required",
                    },
                  ].map((integration) => (
                    <div
                      key={integration.label}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                    >
                      <p className="text-sm font-semibold text-[#17324D]">
                        {integration.label}
                      </p>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {integration.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-2xl bg-[#17324D] p-6 text-white">
                  <LockKeyhole
                    size={27}
                    className="text-[#78D6C9]"
                  />

                  <h3 className="mt-4 text-lg font-bold">
                    Sensitive Credentials
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    Stripe secret keys, webhook secrets,
                    database credentials, email API keys,
                    and authentication secrets must remain
                    on the server. They should never be
                    exposed in React environment variables
                    or bundled frontend code.
                  </p>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#2A9D8F]"
                  />

                  <p className="text-sm leading-7 text-slate-600">
                    Production integration statuses should
                    come from authorized backend health
                    checks, not hardcoded frontend values.
                  </p>
                </div>
              </>
            )}

            {/* =====================================
                FOOTER ACTIONS
            ===================================== */}

            {![
              "administrator",
              "security",
            ].includes(activeSection) && (
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={resetSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={17} />

                  Reset Changes
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;