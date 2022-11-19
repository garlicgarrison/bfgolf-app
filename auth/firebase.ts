import "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "", // required
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

// if (!getApps().length) {
// }

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// console.log("hello", auth);

export const loginGoogle = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider);
};

export const loginEmail = (email: string, password: string) => {
  const auth = getAuth();

  return signInWithEmailAndPassword(auth, email, password);
};

export const signupEmail = (email: string, password: string) => {
  const auth = getAuth();

  return createUserWithEmailAndPassword(auth, email, password);
};

export const signout = () => {
  const auth = getAuth();

  return signOut(auth);
};
