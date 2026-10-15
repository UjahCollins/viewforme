
import { useState } from "react";
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





const handleChange = (event) => {
  const { name, value, type, checked } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: type === "checkbox" ? checked : value,
  }));
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
                  disabled={!selectedService}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2A9D8F] px-6 py-3.5 font-semibold text-white transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
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
  />
)}




        </div>

        {/* Help message */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Need assistance?{" "}
          <a
            href="mailto:viewforme@property.co.uk"
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
