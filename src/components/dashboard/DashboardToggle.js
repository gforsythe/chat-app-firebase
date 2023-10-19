import React from 'react'
import { Button, Drawer, Icon } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';


function DashboardToggle() {
  const {isOpen, open, close} = useModalState();

  return (
    <>
      <Button onClick={open} block color='blue'> 
        <Icon icon={"dashboard"} /> Dashboard
      </Button>
      <Drawer show={isOpen} onHide={close} placement='left'>
        <Dashboard/>
      </Drawer>
    </>
  )
}

export default DashboardToggle