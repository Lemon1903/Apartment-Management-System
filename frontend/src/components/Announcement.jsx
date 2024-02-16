import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import TrashBin from "../assets/icons/trash-bin.svg?react";
import { Button } from "./ui/button";

function DeleteAlert({ setButtonHovered, announcementId }) {
  const [isLoading, setIsLoading] = useState(false);

  async function deleteAnnouncement(event) {
    event.stopPropagation();
    setIsLoading(true);
    try {
      await deleteDoc(doc(firestore, "announcements", announcementId));
      setIsLoading(false);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="h-5 w-5 border-none bg-transparent p-0"
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          disabled={isLoading}
        >
          <TrashBin className="fill-border hover:fill-accent" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the announcement from the database and all
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAnnouncement}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Announcement({ announcement }) {
  const [minimize, setMinimize] = useState(true);
  const [buttonHovered, setButtonHovered] = useState(false);
  const { admin } = useAuth();

  function formatDate(timestamp) {
    return timestamp.toDate().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  return (
    <div
      className={twMerge(
        "cursor-pointer rounded-2xl border-2 border-border bg-input p-4 text-primary-foreground",
        !buttonHovered && "hover:bg-input/80"
      )}
      onClick={() => setMinimize(!minimize)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-medium">{announcement.subject}</h2>
        <div className="flex gap-4">
          <p className="text-sm">{formatDate(announcement.date)}</p>
          {admin && <DeleteAlert setButtonHovered={setButtonHovered} announcementId={announcement.id} />}
        </div>
      </div>
      <p className={twMerge("overflow-hidden text-ellipsis", minimize && "line-clamp-3")}>{announcement.body}</p>
    </div>
  );
}
