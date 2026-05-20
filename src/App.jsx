import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SecureRoute from "./components/SecureRoute";
import Layout from "./components/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import PublicRoute from "./components/PublicRoute";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import OnBoarding from "./pages/OnBoarding";
import Otpverification from "./pages/Otpverification";
import ResetPassword from "./pages/Reset-Password";
import DashboardEventCreator from "./pages/DashboardEventCreator";
import DashboardUser from "./pages/DashboardUser";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import ChatBot from "./components/chatbot/ChatBot";

function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <SecureRoute>
              <Layout />
            </SecureRoute>
          }
        >
          <Route path="/creatordashboard" element={<DashboardEventCreator />} />
          <Route path="/userdashboard" element={<DashboardUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>


        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <SecureRoute>
              <OnBoarding />
            </SecureRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/otpverification"
          element={
            <PublicRoute>
              <Otpverification />
            </PublicRoute>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

      </Routes>

      <ChatBot />

    </>
  );
}

export default App;
