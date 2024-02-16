import FormContextProvider from "@/contexts/FormContext";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import ViewRoomDialog from "./dialogs/ViewRoomDialog";
import ViewTenantDialog from "./dialogs/ViewTenantDialog";

export default function Room({ roomNumber, width, height }) {
  const [hasTenants, setHasTenants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getHasTenants() {
      const roomDoc = await getDoc(doc(firestore, "rooms", roomNumber));
      if (roomDoc.exists()) {
        setHasTenants(roomDoc.get("tenants").length > 0);
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    }
    getHasTenants();
  }, []);

  return (
    <FormContextProvider>
      <div
        className={twMerge(
          "overflow-hidden rounded-3xl",
          !hasTenants && "border-b-8 border-l-8 border-border bg-secondary",
          isLoading && "cursor-not-allowed"
        )}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {isLoading && <Loader2 className="m-auto h-full animate-spin" />}
        {hasTenants ? <ViewTenantDialog roomNumber={roomNumber} /> : <ViewRoomDialog roomNumber={roomNumber} />}
      </div>
    </FormContextProvider>
  );
}
