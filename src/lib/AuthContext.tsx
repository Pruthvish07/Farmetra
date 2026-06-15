import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithUsername: (username: string, language: string, role?: 'Farmer' | 'Expert' | 'Admin') => Promise<void>;
  logout: () => Promise<void>;
  updateLanguageSetting: (lang: string) => Promise<void>;
  updateProfileData: (displayName: string, language: string, role?: 'Farmer' | 'Expert' | 'Admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronizes auth state and user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(true);
        const path = `users/${firebaseUser.uid}`;
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Check if this is the bootstrapped admin email
            const isAdminEmail = firebaseUser.email === "pruthvishbshetty45@gmail.com";
            const initialProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
              email: firebaseUser.email || "",
              role: isAdminEmail ? "Admin" : "Farmer",
              language: "en",
            };

            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (error) {
          console.error("Profile synchronization error", error);
          // Fallback to local profile to keep app fully operational
          const initialProfile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "Farmer Participant",
            email: firebaseUser.email || "",
            role: "Farmer",
            language: "en",
          };
          setProfile(initialProfile);
        } finally {
          setLoading(false);
        }
      } else {
        // Double check if there is an active local session to support fully robust sandbox previewing
        const savedOfflineUser = localStorage.getItem("offline_auth_user");
        const savedOfflineProfile = localStorage.getItem("offline_auth_profile");
        if (savedOfflineUser && savedOfflineProfile) {
          setUser(JSON.parse(savedOfflineUser));
          setProfile(JSON.parse(savedOfflineProfile));
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Authentication entry error:", error);
      throw error;
    }
  };

  const loginWithUsername = async (username: string, language: string, role: 'Farmer' | 'Expert' | 'Admin' = 'Farmer') => {
    try {
      const { signInAnonymously } = await import("firebase/auth");
      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const initialProfile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: username.trim(),
        email: `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@farmetra.net`,
        role,
        language,
      };

      await setDoc(userDocRef, initialProfile);
      setProfile(initialProfile);
      setUser(firebaseUser);
    } catch (error) {
      console.warn("Firebase Anonymous Sign-In failed or was disabled. Falling back to premium Offline-certified session mode:", error);
      
      // Fallback local auth state in case Firebase anonymous login has been disabled in console!
      const mockUid = "offline_user_" + Math.random().toString(36).substr(2, 9);
      const guestUser = {
        uid: mockUid,
        displayName: username.trim(),
        email: `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@farmetra.net`,
        emailVerified: true,
        isAnonymous: true,
        providerData: [],
      } as any;
      
      const guestProfile: UserProfile = {
        uid: mockUid,
        displayName: username.trim(),
        email: `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@farmetra.net`,
        role,
        language,
      };
      
      localStorage.setItem("offline_auth_user", JSON.stringify(guestUser));
      localStorage.setItem("offline_auth_profile", JSON.stringify(guestProfile));
      setUser(guestUser);
      setProfile(guestProfile);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("offline_auth_user");
      localStorage.removeItem("offline_auth_profile");
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Log out operation error:", error);
    }
  };

  const updateLanguageSetting = async (lang: string) => {
    const activeUser = auth.currentUser || user;
    if (!activeUser) return;
    const path = `users/${activeUser.uid}`;
    try {
      if (profile) {
        const newProfile = { ...profile, language: lang } as UserProfile;
        setProfile(newProfile);
        if (!activeUser.uid.startsWith("offline_user_")) {
          const userDocRef = doc(db, "users", activeUser.uid);
          await updateDoc(userDocRef, { language: lang });
        } else {
          localStorage.setItem("offline_auth_profile", JSON.stringify(newProfile));
        }
      }
    } catch (error) {
      console.error("Language sync issue:", error);
    }
  };

  const updateProfileData = async (displayName: string, language: string, role?: 'Farmer' | 'Expert' | 'Admin') => {
    const activeUser = auth.currentUser || user;
    if (!activeUser) return;
    
    const newProfile = {
      ...profile,
      uid: activeUser.uid,
      displayName: displayName.trim(),
      language,
      email: profile?.email || activeUser.email || `${displayName.toLowerCase().replace(/[^a-z0-9]/g, "")}@farmetra.net`,
      role: role || profile?.role || 'Farmer'
    } as UserProfile;
    
    setProfile(newProfile);
    
    if (!activeUser.uid.startsWith("offline_user_")) {
      const path = `users/${activeUser.uid}`;
      try {
        const userDocRef = doc(db, "users", activeUser.uid);
        await setDoc(userDocRef, newProfile, { merge: true });
      } catch (err) {
        console.error("Firestore user profile save failed:", err);
      }
    } else {
      localStorage.setItem("offline_auth_profile", JSON.stringify(newProfile));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithUsername, logout, updateLanguageSetting, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
