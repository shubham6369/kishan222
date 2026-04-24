'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  fullName: string;
  phone: string;
  membershipId?: string;
  membershipCardUnlocked?: boolean;
  registrationDate?: string;
  photoUrl?: string;
  photoBase64?: string;
  village?: string;
  district?: string;
  state?: string;
  crops?: string;
  landSize?: string;
  isAdmin?: boolean;
  walletBalance?: number;
  referralCode?: string;
  referredBy?: string;
  stats?: {
    earnings: number;
    totalReferrals: number;
    activeListings: number;
  };
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    }
  };

  const logout = async () => {
    if (!auth || !auth.app) {
      console.warn('Firebase Auth not initialized. Skipping logout.');
      return;
    }
    await signOut(auth);
  };

  useEffect(() => {
    if (!auth || !auth.app) {
      console.warn('Firebase Auth not initialized. Skipping auth listener.');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        if (db && db.type === 'firestore') { // Simple check for initialized Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            setUserData(null);
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, refreshUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
