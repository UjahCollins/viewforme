
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyDetails from "../components/booking/PropertyDetails.jsx";
import {
  House,
  Building2,
  Warehouse,
  HardHat,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import ViewingSchedule from "../components/booking/ViewingSchedule.jsx";
import ViewingRequirements from "../components/booking/ViewingRequirements.jsx";
import CustomerDetails from "../components/booking/CustomerDetails.jsx";
import BookingReview from "../components/booking/BookingReview.jsx";

import { buildBookingPayload } from "../utils/buildBookingPayload.js";
import {
  getBookingSubmissionKey,
  getSavedBooking,
  savePendingBooking,
} from "../utils/bookingSubmission.js";
import {
  getServices,
  createBooking,
  createCheckoutSession,
  getBookingQuote,
  getBookingSummary,
} from "../services/bookingApi.js";


const services = [
  {
    id: "residential",
    title: "Residential Property Viewing",
    description:
      "Have someone visit a house or apartment on your behalf.",
    icon: House,
  },
  {
    id: "commercial",
    title: "Commercial Property Viewing",
    description:
      "Get a closer look at an office, shop, or business property.",
    icon: Building2,
  },
  {
    id: "storage",
    title: "Storage Unit Inspection",
    description:
      "Request a visual inspection of a storage space.",
    icon: Warehouse,
  },
  {
    id: "construction",
    title: "Construction Progress Inspection",
    description:
      "Receive visual updates from a construction site.",
    icon: HardHat,
  },
];

const serviceSlugMap = {
  residential: "residential-viewing",
  commercial: "commercial-viewing",
  storage: "storage-inspection",
  construction: "construction-inspection",
};

const bookingSteps = [
  "Service",
  "Property",
  "Schedule",
  "Requirements",
  "Your Details",
  "Review",
];

function Booking() {
  const [searchParams] = useSearchParams();

  const initialService = searchParams.get("service");

  const [selectedService, setSelectedService] = useState(
    services.some((service) => service.id === initialService)
      ? initialService
      : ""
  );

  const [step, setStep] = useState(1);

  
const [backendServices, setBackendServices] = useState([]);
const [servicesLoading, setServicesLoading] = useState(true);
const [servicesError, setServicesError] = useState("");
const [bookingQuote, setBookingQuote] = useState(null);
const [quoteLoading, setQuoteLoading] = useState(false);
const [quoteError, setQuoteError] = useState("");

useEffect(() => {
  let active = true;

  async function loadServices() {
    try {
      setServicesLoading(true);
      setServicesError("");

      const response = await getServices();

      if (active) {
        setBackendServices(response.data ?? []);
      }
    } catch (error) {
      if (active) {
        setServicesError(
          error.message || "Unable to load viewing services."
        );
      }
    } finally {
      if (active) {
        setServicesLoading(false);
      }
    }
  }

  loadServices();

  return () => {
    active = false;
  };
}, []);

  const handleContinue = () => {
    if (!selectedService) return;
    setStep(2);
  };

 


const [formData, setFormData] = useState({
  // Property details
  propertyAddress: "",
  city: "",
  postcode: "",
  propertyType: "",
  accessInstructions: "",

  // Viewing schedule
  preferredDate: "",
  preferredTime: "",
  alternativeDate: "",
  alternativeTime: "",
  scheduleNotes: "",

  // Viewing requirements
  checklistItems: [],
  customChecklistItems: [],
  specialInstructions: "",

  // Customer details
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  // Property contact
  propertyContactType: "",
  propertyContactName: "",
  propertyContactPhone: "",
  propertyContactEmail: "",

  // Communication preference
  contactPreference: "whatsapp",
  privacyConsent: false,
});

const selectedServiceRecord = useMemo(() => {
  const slug = serviceSlugMap[selectedService];

  return (
    backendServices.find(
      (service) => service.slug === slug
    ) ?? null
  );
}, [backendServices, selectedService]);

const canBookSelectedService =
  selectedServiceRecord?.pricingType === "FIXED";

useEffect(() => {
  if (
    step !== 6 ||
    !selectedServiceRecord ||
    selectedServiceRecord.pricingType !== "FIXED"
  ) {
    setBookingQuote(null);
    setQuoteError("");
    setQuoteLoading(false);
    return;
  }

  let active = true;

  async function loadQuote() {
    setQuoteLoading(true);
    setQuoteError("");
    setBookingQuote(null);

    try {
      const response = await getBookingQuote(
        selectedServiceRecord.id,
        {
          city: formData.city,
          postcode: formData.postcode,
        }
      );

      if (active) {
        setBookingQuote(response.data);
      }
    } catch (error) {
      if (active) {
        setQuoteError(
          error.message || "Unable to retrieve booking price."
        );
      }
    } finally {
      if (active) {
        setQuoteLoading(false);
      }
    }
  }

  loadQuote();

  return () => {
    active = false;
  };
}, [
  step,
  selectedServiceRecord?.id,
  selectedServiceRecord?.pricingType,
  formData.city,
  formData.postcode,
]);





const handleChange = (event) => {
  const { name, value, type, checked } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: type === "checkbox" ? checked : value,
  }));
};


const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");

const submissionLock = useRef(false);


const handleBookingPayment = async () => {
  if (submissionLock.current) return;

  submissionLock.current = true;
  setIsSubmitting(true);
  setSubmitError("");

  try {
    if (!selectedServiceRecord) {
      throw new Error("Please select a valid viewing service.");
    }

    if (selectedServiceRecord.pricingType !== "FIXED") {
      throw new Error(
        "This service requires a quotation rather than direct payment."
      );
    }

    if (!formData.privacyConsent) {
      throw new Error(
        "Please accept the privacy policy before continuing."
      );
    }

    const payload = buildBookingPayload(
      selectedServiceRecord.id,
      formData
    );

    const submissionKey = getBookingSubmissionKey(payload);

    // Reuse an existing booking only when the submitted
    // information matches the current form.
    let pendingBooking = getSavedBooking(submissionKey);

    if (!pendingBooking) {
      const bookingResponse = await createBooking(payload);

      if (
        !bookingResponse?.data?.id ||
        !bookingResponse?.data?.summaryToken
      ) {
        throw new Error(
          "The booking server returned an incomplete response."
        );
      }

      pendingBooking = {
        bookingId: bookingResponse.data.id,
        bookingToken: bookingResponse.data.summaryToken,
        bookingReference: bookingResponse.data.reference,
        submissionKey,
      };

      savePendingBooking(pendingBooking);
    }

    
const summaryResponse = await getBookingSummary(
  pendingBooking.bookingId,
  pendingBooking.bookingToken
);

const actualAmount = summaryResponse.data.amount;
const actualCurrency = summaryResponse.data.currency;

if (
  actualAmount !== bookingQuote?.amount ||
  actualCurrency !== bookingQuote?.currency
) {
  setBookingQuote({
    ...bookingQuote,
    amount: actualAmount,
    currency: actualCurrency,
  });

  throw new Error(
    "The booking price has changed. Please review the updated amount and click Proceed to Secure Payment again."
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

    // Redirect only to Stripe Checkout.
    const checkoutLocation = new URL(checkoutUrl);

    if (
      checkoutLocation.protocol !== "https:" ||
      checkoutLocation.hostname !== "checkout.stripe.com"
    ) {
      throw new Error("Invalid Stripe Checkout URL.");
    }

    window.location.assign(checkoutUrl);
  } catch (error) {
    setSubmitError(
      error.message ||
        "We couldn't prepare your payment. Please try again."
    );
  } finally {
    submissionLock.current = false;
    setIsSubmitting(false);
  }
};




  return (
    <div className="min-h-screen bg-[#F6F9FA]">
      {/* Page heading */}
      <section className="bg-[#17324D] px-5 py-14 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#78D6C9]">
            Book a Viewing
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Let's Arrange Your Property Viewing
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Tell us about the property you'd like viewed.
            We'll guide you through the booking process.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        {/* Progress */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#17324D]">
              Step {step} of {bookingSteps.length}
            </p>

            <p className="text-sm text-slate-500">
              {bookingSteps[step - 1]}
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#2A9D8F] transition-all duration-300"
              style={{
                width: `${(step / bookingSteps.length) * 100}%`,
              }}
            />
          </div>

          <div className="mt-5 hidden justify-between gap-2 sm:flex">
            {bookingSteps.map((label, index) => (
              <span
                key={label}
                className={`text-xs font-medium ${
                  index + 1 === step
                    ? "text-[#2A9D8F]"
                    : "text-slate-400"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Form container */}
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
          {step === 1 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-[#17324D] sm:text-3xl">
                  What Type of Viewing Do You Need?
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  Select the service that best matches your property
                  viewing requirements.
                </p>
              </div>

              {/* Service cards */}
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isSelected =
                    selectedService === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
  if (selectedService !== service.id) {
    setSelectedService(service.id);

    setFormData((previous) => ({
      ...previous,
      checklistItems: [],
    }));
  }
}}
                      aria-pressed={isSelected}
                      className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                        isSelected
                          ? "border-[#2A9D8F] bg-[#F0FAF8] shadow-sm"
                          : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2
                          size={22}
                          className="absolute right-5 top-5 text-[#2A9D8F]"
                        />
                      )}

                      <div
                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-[#2A9D8F] text-white"
                            : "bg-[#E8F6F3] text-[#2A9D8F]"
                        }`}
                      >
                        <Icon size={25} strokeWidth={1.8} />
                      </div>

                      <h3 className="pr-6 text-lg font-bold text-[#17324D]">
                        {service.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {service.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-7">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#17324D]"
                >
                  <ArrowLeft size={18} />
                  Back Home
                </a>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={
                    !selectedService ||
                    servicesLoading ||
                    !canBookSelectedService
                    }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3.5 font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>

              {servicesLoading && (
  <p className="mt-5 text-sm text-slate-500">
    Loading available viewing services...
  </p>
)}

{servicesError && (
  <p role="alert" className="mt-5 text-sm text-red-600">
    {servicesError}
  </p>
)}
            </>
          )}

          {step === 2 && (
  <PropertyDetails
    formData={formData}
    handleChange={handleChange}
    onBack={() => setStep(1)}
    onNext={() => setStep(3)}
  />
)}

{step === 3 && (
  <ViewingSchedule
    formData={formData}
    handleChange={handleChange}
    onBack={() => setStep(2)}
    onNext={() => setStep(4)}
  />
)}


{step === 4 && (
  <ViewingRequirements
    selectedService={selectedService}
    formData={formData}
    setFormData={setFormData}
    handleChange={handleChange}
    onBack={() => setStep(3)}
    onNext={() => setStep(5)}
  />
)}



{step === 5 && (
  <CustomerDetails
    formData={formData}
    handleChange={handleChange}
    onBack={() => setStep(4)}
    onNext={() => setStep(6)}
  />
)}



{step === 6 && (
  <BookingReview
    selectedService={selectedService}
    formData={formData}
    onEdit={(targetStep) => setStep(targetStep)}
    onBack={() => setStep(5)}
    onSubmit={handleBookingPayment}
    isSubmitting={isSubmitting}
    submitError={submitError}
    canPay={
      canBookSelectedService &&
      !quoteLoading &&
      !quoteError &&
      bookingQuote !== null
    }
    bookingQuote={bookingQuote}
    quoteLoading={quoteLoading}
    quoteError={quoteError}
  />
)}




        </div>

        {/* Help message */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Need assistance?{" "}
          <a
            href="mailto:support@viewforme.org"
            className="font-semibold text-[#2A9D8F] hover:underline"
          >
            Contact our team
          </a>
        </p>
      </div>
    </div>
  );
}

export default Booking;
