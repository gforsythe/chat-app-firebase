import React from 'react'
import { Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';


function DashboardToggle() {
  const {isOpen, open, close} = useModalState();
  //note this custom hook is a boolean that is used in the jsx for the full attribute
  const isMobile = useMediaQuery('(max-width: 992px)');

  return (
    <>
      <Button onClick={open} block color='blue'> 
        <Icon icon={"dashboard"} /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
        <Dashboard/>
      </Drawer>
    </>
  )
}

export default DashboardToggle