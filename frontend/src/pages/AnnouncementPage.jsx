import Announcement from "@/components/Announcement";
import { Skeleton } from "@/components/ui/skeleton";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function getAnnouncements() {
      // fetch announcements from database
      const q = query(collection(firestore, "announcements"), orderBy("date", "desc"));
      const announcementsSnap = await getDocs(q);
      setAnnouncements(announcementsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getAnnouncements();
  }, []);

  return (
    <div className="grid w-screen max-w-4xl gap-4 rounded-3xl border-b-[12px] border-l-[12px] border-border bg-popover p-4">
      {announcements.length > 0
        ? announcements.map((announcement, i) => <Announcement key={i} announcement={announcement} />)
        : Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
    </div>
  );
}
