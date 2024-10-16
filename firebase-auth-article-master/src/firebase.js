import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyB55ntL2FShS3XxkxZiWkPGXMGbiOv5qoo",
//   authDomain: "is4301-e3bc7.firebaseapp.com",
//   projectId: "is4301-e3bc7",
//   storageBucket: "is4301-e3bc7.appspot.com",
//   messagingSenderId: "427544806499",
//   appId: "1:427544806499:web:2a37812f0ee71e044c6456",
//   measurementId: "G-6ZRP1NFVKH"
// };

const firebaseConfig = {
  apiKey: "AIzaSyB55ntL2FShS3XxkxZiWkPGXMGbiOv5qoo",
  authDomain: "is4301-e3bc7.firebaseapp.com",
  projectId: "is4301-e3bc7",
  storageBucket: "is4301-e3bc7.appspot.com",
  messagingSenderId: "427544806499",
  appId: "1:427544806499:web:2a37812f0ee71e044c6456",
  measurementId: "G-6ZRP1NFVKH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
