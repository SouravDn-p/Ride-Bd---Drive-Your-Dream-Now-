import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";
import axios from "axios";

export const AuthContexts = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [couponData, setCouponData] = useState(null);
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const user = { email: currentUser.email };
        axios
          .post("https://ride-bd-server-side.vercel.app/jwt", user, {
            withCredentials: true,
          })
          .then((res) => console.log("login token", res.data));
      } else {
        axios
          .post(
            "https://ride-bd-server-side.vercel.app/logout",
            {},
            { withCredentials: true }
          )
          .then((res) => console.log("logout", res.data))
          .catch((err) => console.error("Error logging out:", err));
      }
    });

    fetch("coupon.json")
      .then((res) => res.json())
      .then((coupon) => setCouponData(coupon));
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    signOutUser,
    user,
    setUser,
  };
  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
