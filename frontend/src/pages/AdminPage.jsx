import Floor from "@/components/Floor";
import Navbar from "@/components/Navbar";
import NotFound from "@/components/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AnnouncementPage from "./AnnouncementPage";

export default function AdminPage() {
  const { user, admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && admin !== null) {
      if (!admin || user?.isAnonymous) {
        navigate("/");
      }
    }
  }, [user, admin]);

  return (
    <div>
      <Navbar basePath="/admin" />
      <Routes>
        <Route path="/" element={<Floor />} />
        <Route path="/announcement" element={<AnnouncementPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
