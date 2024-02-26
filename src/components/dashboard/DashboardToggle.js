import { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';
import { auth, db } from '../../misc/firebase';
import { isOfflineForDatabase } from '../../context/profile.context';


function DashboardToggle() {
  const { isOpen, open, close } = useModalState();
  //note this custom hook is a boolean that is used in the jsx for the full attribute
  const isMobile = useMediaQuery('(max-width: 992px)');
  const onSignOut = useCallback(() => {
    db.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(() => {
      auth.signOut();
      Alert.info('Signed Out', 4000);
      close();
    }).catch(err =>{
      Alert.error(err.message, 4000);
    });

  }, [close]);

  return (
    <>
      <Button onClick={open} block color='blue'>
        <Icon icon={"dashboard"} /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
}

export default DashboardToggle;