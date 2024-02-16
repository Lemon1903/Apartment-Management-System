import { auth } from "@/lib/firebase";
import { isAdmin } from "@/lib/utils";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a <AuthContextProvider />");
  }
  return context;
}

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("email: ", user.email);
        setUser(user);
      } else {
        console.log("No user is signed in.");
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      isAdmin(user.uid)
        .then((val) => setAdmin(val))
        .catch((error) => console.log(error));
    } else {
      setAdmin(null);
    }
  }, [user]);

  return <AuthContext.Provider value={{ user, admin }}>{children}</AuthContext.Provider>;
}
