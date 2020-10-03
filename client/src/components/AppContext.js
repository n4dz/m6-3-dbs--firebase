import React, { createContext, useEffect, useState } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

require("dotenv").config();

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export const AppContext = createContext(null);

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState("");

  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  useEffect(() => {
    // if (user) console.log(user);
    if (user) {
      fetch(`/users`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);
  return (
    // <AppContext.Provider value={{ appUser, signInWithGoogle, handleSignOut }}>
    <AppContext.Provider
      value={{ appUser, signInWithGoogle, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

// export default AppProvider;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
  firebaseApp,
})(AppProvider);
