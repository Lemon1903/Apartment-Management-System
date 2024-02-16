import Mail from "@/assets/icons/mail.svg?react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Home from "../assets/icons/home.svg?react";
import Logout from "../assets/icons/logout.svg?react";
import Megaphone from "../assets/icons/megaphone.svg?react";
import FormDialog from "./dialogs/FormDialog";
import ViewTenantDialog from "./dialogs/ViewTenantDialog";
import { Button } from "./ui/button";

export default function Navbar({ basePath, roomNumber }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, admin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    if (basePath === "/guest") {
      await auth.currentUser.delete();
    }

    signOut(auth)
      .then(() => {
        navigate("/");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <nav className="mb-4 flex items-center justify-between py-4">
      <h1 className="text-5xl font-black text-popover-foreground">TenAnts</h1>
      <div className="flex gap-6">
        <Button asChild size="icon" variant="icon">
          <Link to=".">
            <Home className={location.pathname === basePath ? "fill-accent" : "fill-border"} />
          </Link>
        </Button>
        {admin ? (
          <>
            <Button asChild size="icon" variant="icon">
              <Link to="announcement">
                <Megaphone className={location.pathname.includes("announcement") ? "fill-accent" : "fill-border"} />
              </Link>
            </Button>
            <FormDialog />
          </>
        ) : (
          !user?.isAnonymous && roomNumber && <ViewTenantDialog roomNumber={roomNumber} />
        )}
        {!admin && (
          <Button asChild size="icon" variant="icon">
            <a href="mailto:tenantapartments@gmail.com">
              <Mail className="mt-1 p-px text-border" size={24} />
            </a>
          </Button>
        )}
        <Button size="icon" variant="icon" disabled={isLoading} onClick={handleLogout}>
          <Logout className="fill-border" />
        </Button>
      </div>
    </nav>
  );
}
