import User from "@/assets/icons/user.svg?react";
import TenantCarousel from "@/components/TenantCarousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "@/contexts/FormContext";
import { firestore } from "@/lib/firebase";
import { GFORM_PAYMENT } from "@/lib/room-links";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PaymentHistory from "../PaymentHistory";
import TenantForm from "../TenantForm";
import { Skeleton } from "../ui/skeleton";

export default function ViewTenantDialog({ roomNumber }) {
  const [action, setAction] = useState("viewTenants");
  const [isOpen, setIsOpen] = useState(false);
  const [tenants, setTenants] = useState([]);
  const { admin, user } = useAuth();
  const { handleSubmit } = useForm();

  useEffect(() => {
    async function getTenants() {
      const tenants = [];
      const rooms = await getDoc(doc(firestore, "rooms", roomNumber));
      const tenantsRef = rooms.get("tenants");
      tenantsRef.forEach(async (tenantRef) => {
        const tenant = await getDoc(tenantRef);
        tenants.push({ id: tenant.id, ...tenant.data() });
      });
      setTenants(tenants);
    }
    getTenants();
  }, []);

  function handleOpenChange(open) {
    if (!open) setAction("viewTenants");
    setIsOpen(open);
  }

  async function confirmEdit(values) {
    values.forEach(async (value) => {
      try {
        await updateDoc(doc(firestore, "users", value.id), {
          name: value.name,
          email: value.email,
          contact_num: value.contact_num,
          alt_contact_num: value.alt_contact_num,
          emergency_num: value.emergency_num,
          alt_emergency_num: value.alt_emergency_num,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }

      window.location.reload();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {admin || user?.isAnonymous ? (
          <Button
            key="room"
            className="relative grid h-full w-full place-items-center border-none bg-accent text-base hover:bg-gray-600"
            disabled={!admin}
          >
            <span className="absolute left-4 top-2 text-white">{roomNumber}</span>
            <User className="fill-secondary" size={60} />
          </Button>
        ) : (
          <Button size="icon" variant="icon">
            <User className="fill-border" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={["gap-8 px-8 text-primary-foreground", action === "editTenants" ? "w-screen max-w-xl" : "max-w-fit"]}
      >
        <DialogHeader>
          <DialogTitle className="text-4xl font-black text-background">Room {roomNumber}</DialogTitle>
        </DialogHeader>
        {action === "viewHistory" && <PaymentHistory roomNumber={roomNumber} />}
        {action === "viewTenants" &&
          (tenants.length === 0 ? <Skeleton className="h-80 w-[574px]" /> : <TenantCarousel tenants={tenants} />)}
        {action === "editTenants" && <TenantForm tenants={tenants} />}
        {action !== "viewHistory" && (
          <DialogFooter className="items-center gap-8 sm:justify-center">
            {action === "viewTenants" && (
              <>
                <Button size="lg" className="w-64" onClick={() => setAction("viewHistory")}>
                  Payment History
                </Button>
                {admin ? (
                  <Button key="edit" size="lg" className="w-64" onClick={() => setAction("editTenants")}>
                    Edit Tenant Details
                  </Button>
                ) : (
                  <Button asChild key="add" size="lg" className="w-64">
                    <a href={GFORM_PAYMENT} target="_blank">
                      Add Payment
                    </a>
                  </Button>
                )}
              </>
            )}
            {action === "editTenants" && (
              <Button type="submit" form="tenant-form" size="lg" className="w-64" onClick={handleSubmit(confirmEdit)}>
                Confirm
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
