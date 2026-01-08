'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase/provider';

export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
}

/**
 * Hook for accessing the authenticated user's state.
 * It waits for Firebase's initial authentication check to complete.
 *
 * @returns {UseUserResult} Object with user and loading state.
 */
export function useUser(): UseUserResult {
  const auth = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // Start loading

  useEffect(() => {
    if (!auth) {
      // Should not happen if used within FirebaseProvider
      setIsUserLoading(false);
      return;
    }

    // This listener handles the initial auth state and subsequent changes.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false); // Auth check is complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading };
}
