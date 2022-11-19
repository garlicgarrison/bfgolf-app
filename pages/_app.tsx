import "../styles/globals.css";
import type { AppProps } from "next/app";
// import initAuth from "../auth/init";
import { withAuthUser } from "next-firebase-auth";
import { getApps, initializeApp } from "firebase/app";
// import { auth } from "../auth/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// initAuth();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "", // required
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

if (!getApps().length) {
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.currentUser;

const AuthContext = createContext<User | null>(null);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  console.log(user);

  auth.onIdTokenChanged((user) => {
    setUser(user);
  });

  useEffect(() => {
    authGuard();
  }, [user]);

  const authGuard = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (router.route === "/login" || router.route === "/signup") {
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={user}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}
