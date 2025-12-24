
"use client";

import { useEffect, useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase";
import {
  collection,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import type { User as AppUser } from "@/lib/types";

/**
 * Manages and reports user presence on a specific task.
 *
 * @param taskId The ID of the task to track presence for.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object containing the list of users currently viewing the task
 *          and a boolean indicating if the current user is present.
 */
export function useTaskPresence(taskId: string, currentUser: User | null) {
  const firestore = useFirestore();
  const [isPresent, setIsPresent] = useState(false);

  // Memoize the presence collection reference for the specific task
  const presenceColRef = useMemoFirebase(() => {
    if (!firestore || !taskId) return null;
    return collection(firestore, "presence", taskId, "users");
  }, [firestore, taskId]);
  
  // Fetch the list of user IDs present for this task
  const { data: presentUserIds } = useCollection<{ id: string }>(presenceColRef);

  // Memoize the query for all users in the 'users' collection
  const usersColRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "users");
  }, [firestore]);
  
  // Fetch all user profiles
  const { data: allUsers } = useCollection<AppUser>(usersColRef);

  // Filter all users to get the profiles of those who are currently present
  const viewingUsers = useMemo(() => {
    if (!presentUserIds || !allUsers) return [];
    const idSet = new Set(presentUserIds.map((u) => u.id));
    return allUsers.filter((user) => idSet.has(user.id));
  }, [presentUserIds, allUsers]);

  useEffect(() => {
    if (!firestore || !taskId || !currentUser) {
      return;
    }

    const userPresenceRef = doc(firestore, "presence", taskId, "users", currentUser.uid);

    // Function to set user presence
    const goOnline = async () => {
      try {
        await setDoc(userPresenceRef, {
          id: currentUser.uid,
          timestamp: serverTimestamp(),
        });
        setIsPresent(true);
      } catch (error) {
        console.error("Failed to set presence to online:", error);
      }
    };

    // Function to remove user presence
    const goOffline = async () => {
      try {
        await deleteDoc(userPresenceRef);
        setIsPresent(false);
      } catch (error) {
        // It's possible the document is already gone, so errors might not be critical
        console.warn("Could not set presence to offline:", error);
      }
    };
    
    goOnline();

    // Set up listeners for browser/tab closing to go offline
    window.addEventListener("beforeunload", goOffline);

    // Cleanup function to remove presence when the component unmounts or dependencies change
    return () => {
      goOffline();
      window.removeEventListener("beforeunload", goOffline);
    };
  }, [taskId, currentUser, firestore]);

  return { viewingUsers, isPresent };
}
