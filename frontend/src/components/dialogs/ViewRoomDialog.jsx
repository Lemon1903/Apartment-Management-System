import AddMore from "@/assets/icons/add-more.svg?react";
import Import from "@/assets/icons/import.svg?react";
import TenantForm from "@/components/TenantForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "@/contexts/FormContext";
import { firestore } from "@/lib/firebase";
import { GFORM_LIKKS } from "@/lib/room-links";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import RoomDetails from "../RoomDetails";

export default function ViewRoomDialog({ roomNumber }) {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("viewRoom");
  const [isOpen, setIsOpen] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const { admin } = useAuth();
  const form = useForm();

  useEffect(() => {
    async function getRoomDetails() {
      const roomSnap = await getDoc(doc(firestore, "rooms", roomNumber));
      if (roomSnap.exists()) {
        setRoomDetails(roomSnap.data());
      } else {
        console.log("No such room!");
      }
    }
    getRoomDetails();
  }, []);

  function importData() {
    // Automatic fillup from imported datasheet
  }

  async function createUser(email, password) {
    try {
      const response = await fetch("http://localhost:3001/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("UID generated: ", data);
      return data;
    } catch (error) {
      console.log("creating user error:", error);
    }
  }

  async function addTenants(tenants) {
    // Add tenant/s to room in database
    const response = await fetch("http://localhost:3001/listUsers");
    const users = await response.json();

    tenants.forEach(async (tenant) => {
      users.forEach((user) => {
        // checks if user already exists
        if (user.email === tenant.email) {
          throw new Error("User already exists. It should be unique");
        }
      });
      const { uid } = await createUser(tenant.email, "123123");
      try {
        // create a user document
        await setDoc(doc(firestore, "users", uid), {
          isAdmin: false,
          email: tenant.email,
          name: tenant.name,
          sex: "Male",
          contact_num: tenant.contact_num,
          alt_contact_num: tenant.alt_contact_num,
          emergency_num: tenant.emergency_num,
          alt_emergency_num: tenant.alt_emergency_num,
          date_joined: new Date(),
          room: roomNumber,
        });
      } catch (error) {
        console.log("adding user document error:", error);
      }

      try {
        // update room document
        await updateDoc(doc(firestore, "rooms", roomNumber), {
          tenants: arrayUnion(doc(firestore, "users", uid)),
        });
      } catch (error) {
        console.log("room uopdate error:", error);
      }
    });
  }

  function handleSubmit(values) {
    setIsLoading(true);
    addTenants(values)
      .then(() => {
        setIsLoading(false);
        setAction("viewRoom");
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleOpenChange(open) {
    if (!open) {
      setAction("viewRoom");
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="relative grid h-full w-full place-items-center border-none text-base hover:bg-primary"
        >
          <span className="absolute left-4 top-4">{roomNumber}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen max-w-xl gap-8 px-8 text-primary-foreground">
        <DialogHeader className="flex-row gap-4">
          <DialogTitle className="text-4xl font-black text-background">Room {roomNumber}</DialogTitle>
        </DialogHeader>
        {action === "viewRoom" && <RoomDetails details={roomDetails} />}
        {action === "addTenants" && <TenantForm onSubmit={handleSubmit} />}
        <DialogFooter className="relative items-center gap-8 sm:justify-center">
          {action === "addTenants" && (
            <>
              <Button
                size="icon"
                variant="icon"
                className="z-10 h-14 w-14 border-none bg-transparent hover:bg-transparent"
                disabled={isLoading}
              >
                <Import className="fill-border hover:text-accent" />
              </Button>
              <Button key="add" form="tenant-form" type="submit" size="lg" className="w-64" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Save Tenant/s"}
              </Button>
              <Button
                size="icon"
                variant="icon"
                className="h-14 w-14 border-none bg-transparent hover:bg-transparent"
                disabled={isLoading}
                onClick={form.handleAdd}
              >
                <AddMore className="fill-border hover:fill-accent" />
              </Button>
            </>
          )}
          {action === "viewRoom" &&
            (admin ? (
              <Button key="assign" size="lg" className="w-64" onClick={() => setAction("addTenants")}>
                Assign Tenant
              </Button>
            ) : (
              <Button asChild key="apply" size="lg" className="w-64">
                <a href={GFORM_LIKKS[roomNumber]} target="_blaak">
                  Apply
                </a>
              </Button>
            ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
