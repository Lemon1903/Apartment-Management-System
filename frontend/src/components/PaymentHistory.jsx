import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "./ui/skeleton";

export default function PaymentHistory({ roomNumber }) {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    async function getPaymentHistory() {
      // get the payment history of the tenant
      const historySnap = await getDoc(doc(firestore, "rooms", roomNumber));
      if (historySnap.exists()) {
        setPaymentHistory(historySnap.get("payment_history"));
      } else {
        console.log("No payment history found");
      }
    }
    getPaymentHistory();
  }, [user]);

  function formatDate(timestamp) {
    return timestamp.toDate().toLocaleString("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  return (
    <div
      className={twMerge(
        "h-[550px] w-screen max-w-2xl space-y-4",
        paymentHistory.length > 3 && "overflow-y-scroll pr-4"
      )}
    >
      {paymentHistory.length > 0
        ? paymentHistory.map((history, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-2xl border-2 border-border bg-input p-4 text-primary-foreground hover:bg-input/80"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-medium">{formatDate(history.date)}</h2>
                <p className="text-3xl font-medium">₱{history.amount}</p>
              </div>
              <p className="text-primary-foreground">From: {history.sender_name}</p>
              <p className="text-primary-foreground">Mode of Payment: {history.payment_mode}</p>
              <p className="text-primary-foreground">Ref. No: {history.reference_num}</p>
            </div>
          ))
        : Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
    </div>
  );
}
