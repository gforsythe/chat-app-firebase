import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../misc/firebase";

const ProfileContext = createContext();




export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    const authUnsubscribe = auth.onAuthStateChanged(authObj => {
      if (authObj) {

       userRef =  db.ref(`/profiles/${authObj.uid}`);
       
       userRef.on('value', (snapshot) => {
          const { name, createdAt } = snapshot.val();
          const dataOfUser = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(dataOfUser);
          setIsLoading(false);
        });
      } else {
        if(userRef){
          userRef.off();
        }
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsubscribe();
      if(userRef){
        userRef.off()
      }

    };

  }, []);
  return <ProfileContext.Provider value={{ isLoading, profile }}>
    {children}
  </ProfileContext.Provider>;
};


export const useProfileHook = () => useContext(ProfileContext);