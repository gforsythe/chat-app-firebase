import React from 'react';
import { Button, Drawer } from 'rsuite';
import {useProfileHook } from '../../context/profile.context';

function Dashboard({onSignOut}) {
  const {profile} = useProfileHook();
  return (
    <>
    <Drawer.Header>
      <Drawer.Title>
        Dashboard
      </Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>
      <h3>Hey {profile.name}</h3>
    </Drawer.Body>
    <Drawer.Footer>
      <Button block color='red' onClick={onSignOut} >Sign Out</Button>
    </Drawer.Footer>
    </>
  )
}


export default Dashboard