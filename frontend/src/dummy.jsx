import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import "./App.css";
import { firestore } from "./lib/firebase";

export function App() {
  async function getDocuments() {
    // const rooms = collection(firestore, "rooms");
    // const roomsSnap = await getDocs(rooms);
    // roomsSnap.forEach((room) => {
    //   console.log(room.id, " => ", room.data());
    // });

    // const docRef = doc(firestore, "rooms", "room3");
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {

    // } else {
    //   console.log("No such document!");
    // }

    const rooms = await getDoc(doc(firestore, "rooms", "room3"));
    const tenants = rooms.get("tenants");
    tenants.forEach(async (tenantRef) => {
      const tenant = await getDoc(tenantRef);
      console.log(tenant.get("name"));
    });
  }

  async function addDocument() {
    // Add a new document with a generated id.
    await addDoc(doc(firestore, "messages"), {
      message: "Hello world!",
    });
  }

  async function addCollection() {
    await addDoc(collection(firestore, "testing1"), {
      name: "Tokyo",
    });
  }

  return (
    <button onClick={getDocuments}>Get Documents</button>
    // <AuthPage />
  );
}

export default App;
