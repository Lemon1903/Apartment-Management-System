import FormContextProvider from "@/contexts/FormContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import AuthContextProvider from "./contexts/AuthContext";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import GuestPage from "./pages/GuestPage";
import TenantPage from "./pages/TenantPage";

export default function App() {
  return (
    <AuthContextProvider>
      <FormContextProvider>
        <BrowserRouter>
          <div className="flex h-full w-fit items-start">
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/tenant" element={<TenantPage />} />
              <Route path="/guest" element={<GuestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </FormContextProvider>
    </AuthContextProvider>
  );
}
