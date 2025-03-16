import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "merakifest-d9822"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "merakifest-d9822",  
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "merakifest-d9822"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Using provided admin SDK email for Firestore
  clientEmail: "firebase-adminsdk-fbsvc@merakifest-d9822.iam.gserviceaccount.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Type for auth state change callback
type AuthStateCallback = (user: User | null) => void;

// Handle auth state changes
export const onAuthChange = (callback: AuthStateCallback) => {
  return onAuthStateChanged(auth, callback);
};

// Sign in with email/password for admin
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Failed to sign in. Please check your credentials.");
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Check if user is admin
export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const token = await user.getIdTokenResult();
    return !!token.claims.admin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export default app;
