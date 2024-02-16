import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementPage from "./AnnouncementPage";

export default function TenantPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomNumber, setRoomNumber] = useState("");

  useEffect(() => {
    if (user) {
      //invalid sign in of guest
      if (user.isAnonymous) navigate("/");

      // get the tenant document and getthe room number
      async function getRoomNumber() {
        const tenantSnap = await getDoc(doc(firestore, "users", user.uid));
        if (tenantSnap.exists()) {
          setRoomNumber(tenantSnap.get("room"));
        } else {
          console.log("Tenant does not exist");
        }
      }
      getRoomNumber();
    }
  }, [user]);

  return (
    <div>
      <Navbar basePath="/tenant" roomNumber={roomNumber} />
      <AnnouncementPage />
    </div>
  );
}
