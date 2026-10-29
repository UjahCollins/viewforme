
import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Booking from "./pages/Booking.jsx";
import About from "./pages/About.jsx";
import Services from "./components/Services.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import BecomeViewer from "./pages/BecomeAViewer.jsx";
import Contact from "./pages/Contact.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import CookiesPolicy from "./pages/CookiesPolicy.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Bookings from "./pages/admin/Bookings.jsx";
import BookingDetails from "./pages/admin/BookingDetails.jsx";
import ViewerDetails from "./pages/admin/ViewerDetails.jsx";
import Viewers from "./pages/admin/Viewers.jsx";
import ViewerApplicationDetails from "./pages/admin/ViewerApplicationDetails.jsx";
import ViewerApplications from "./pages/admin/ViewerApplications.jsx";
import Reports from "./pages/admin/Reports.jsx";
import ReportDetails from "./pages/admin/ReportDetails.jsx";
import PaymentDetails from "./pages/admin/PaymentDetails.jsx";
import Payments from "./pages/admin/Payments.jsx";
import EnquiryDetails from "./pages/admin/EnquiryDetails.jsx";
import Enquiries from "./pages/admin/Enquiries.jsx";
import Settings from "./pages/admin/Settings.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import BookingCancel from "./pages/BookingCancel.jsx";

function App() {
  // Wake up the hosted Render backend when the website loads
  useEffect(() => {
    const wakeServer = async () => {
      try {
        const response = await fetch(
          "https://api.viewforme.org/api/health"
        );

        if (!response.ok) {
          console.warn(
            "ViewForMe backend health check failed:",
            response.status
          );
          return;
        }

        console.log("ViewForMe backend is active");
      } catch (error) {
        console.error(
          "ViewForMe backend is unavailable:",
          error
        );
      }
    };

    wakeServer();
  }, []);

  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Booking />} />

            <Route
              path="/booking/success"
              element={<BookingSuccess />}
            />

            <Route
              path="/booking/cancel"
              element={<BookingCancel />}
            />

            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />

            <Route
              path="/how-it-works"
              element={<HowItWorksPage />}
            />

            <Route
              path="/become-a-viewer"
              element={<BecomeViewer />}
            />

            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            <Route
              path="/terms"
              element={<TermsAndConditions />}
            />

            <Route
              path="/refund-policy"
              element={<RefundPolicy />}
            />

            <Route
              path="/cookies"
              element={<CookiesPolicy />}
            />
          </Route>

          {/* ADMIN LOGIN */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* PROTECTED ADMIN ROUTES */}

          <Route element={<ProtectedAdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={
                  <Navigate to="dashboard" replace />
                }
              />

              <Route
                path="dashboard"
                element={<Dashboard />}
              />

              <Route
                path="bookings"
                element={<Bookings />}
              />

              <Route
                path="bookings/:id"
                element={<BookingDetails />}
              />

              <Route
                path="viewers"
                element={<Viewers />}
              />

              <Route
                path="viewers/:id"
                element={<ViewerDetails />}
              />

              <Route
                path="viewer-applications"
                element={<ViewerApplications />}
              />

              <Route
                path="viewer-applications/:id"
                element={<ViewerApplicationDetails />}
              />

              <Route
                path="reports"
                element={<Reports />}
              />

              <Route
                path="reports/:id"
                element={<ReportDetails />}
              />

              <Route
                path="payments"
                element={<Payments />}
              />

              <Route
                path="payments/:id"
                element={<PaymentDetails />}
              />

              <Route
                path="enquiries"
                element={<Enquiries />}
              />

              <Route
                path="enquiries/:id"
                element={<EnquiryDetails />}
              />

              <Route
                path="settings"
                element={<Settings />}
              />
            </Route>
          </Route>

          {/* FALLBACK */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
