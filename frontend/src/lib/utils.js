import { clsx } from "clsx";
import { doc, getDoc } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { firestore } from "./firebase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function isAdmin(uid) {
  const docSnap = await getDoc(doc(firestore, "users", uid));
  if (docSnap.exists()) {
    return docSnap.get("isAdmin");
  } else {
    console.log("No such user!");
    return false;
  }
}
