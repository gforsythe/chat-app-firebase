import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, fcmVapidKey, messaging, } from '../misc/firebase';
import firebase from 'firebase/app';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;

    const authUnsubscribe = auth.onAuthStateChanged(async authObj => {
      if (authObj) {
        userStatusRef = db.ref(`/status/${authObj.uid}`);

        userRef = db.ref(`/profiles/${authObj.uid}`);

        userRef.on('value', snapshot => {
          const { name, createdAt, avatar } = snapshot.val();
          const dataOfUser = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(dataOfUser);
          setIsLoading(false);
        });

        db.ref('.info/connected').on('value', snapshot => {
          if (!!snapshot.val() === false) {
            return;
          }

          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusRef.set(isOnlineForDatabase);
            });
        });



        if (messaging) {
          try {
            const currentToken = await messaging.getToken({
              vapidKey: fcmVapidKey
            });
            if (currentToken) {
              await db.ref(`/fcm_tokens/${currentToken}`).set(authObj.uid);

            }
          } catch (err) {
            console.log('an error occured while retrieving', err);
          }
        }
      } else {
        if (userRef) {
          userRef.off();
        }
        if (userStatusRef) {
          userStatusRef.off();
        }
      
        db.ref('.info/connected').off();
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsubscribe();
      db.ref('.info/connected').off();

      if (userRef) {
        userRef.off();
      }
      if (userStatusRef) {
        userStatusRef.off();
      }

    };
  }, []);
  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileHook = () => useContext(ProfileContext);
