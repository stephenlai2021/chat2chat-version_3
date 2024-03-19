/* react */
import { useState } from 'react'

/* firebase */
import { firestore, auth } from "@/lib/firebase/client";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export const useFirebase = () => {
  const [users, setUsers] = useState("")

  const getUsers = () => {
    const usersRef = collection(firestore, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => users.push(doc.data()));
      setUsers(users);
      console.log("users: ", users);
    });
    return () => unsubscribe();
  };

  return {
    users,
    getUsers
  }
};
