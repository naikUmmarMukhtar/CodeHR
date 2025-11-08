//@ts-nocheck
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const admins = await getFromFirebase("/admins/");
          let isAdmin = false;

          if (admins) {
            const adminList = Object.values(admins);
            isAdmin = adminList.some(
              (admin) => admin.email === firebaseUser.email && admin.isAdmin
            );
          }

          setUser({
            ...firebaseUser,
            isAdmin,
          });
        } catch (err) {
          console.error("Error checking admin status:", err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
