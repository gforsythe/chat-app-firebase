import { useCallback } from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';
import { auth } from '../../misc/firebase';


function DashboardToggle() {
  const {isOpen, open, close} = useModalState();
  //note this custom hook is a boolean that is used in the jsx for the full attribute
  const isMobile = useMediaQuery('(max-width: 992px)');
  const onSignOut = useCallback(()=>{
      auth.signOut()
      Alert.info('Signed Out', 4000);
      close();
  }, [close])

  return (
    <>
      <Button onClick={open} block color='blue'> 
        <Icon icon={"dashboard"} /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
        <Dashboard onSignOut={onSignOut}/>
      </Drawer>
    </>
  )
}

export default DashboardToggle