import Call from "@/assets/icons/call.svg?react";
import CreateNote from "@/assets/icons/create-note.svg?react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import SimpleForm from "../SimpleForm";

export default function FormDialog() {
  const { user, admin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function postAnnouncement(values) {
    setIsLoading(true);
    try {
      await addDoc(collection(firestore, "announcements"), { ...values, date: new Date() });
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="icon">
          {admin ? <CreateNote className="fill-border" /> : <Call className="fill-border" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen max-w-2xl gap-8 px-8 text-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-4xl font-black text-background">Announcement</DialogTitle>
        </DialogHeader>
        <SimpleForm onSubmit={postAnnouncement} />
        <DialogFooter className="gap-8 sm:justify-center">
          {admin ? (
            <Button disabled={isLoading} type="submit" form="simple-form" key="post" size="lg" className="w-64">
              Post Announcement
            </Button>
          ) : (
            <>
              {user?.isAnonymous && (
                <Button key="apply" size="lg" className="w-64">
                  Apply
                </Button>
              )}
              <Button form="simple-form" key="inquire" size="lg" className="w-64">
                Send to Admin
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
