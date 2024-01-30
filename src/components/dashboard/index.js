import React from 'react';
import { Button, Divider, Drawer } from 'rsuite';
import {useProfileHook } from '../../context/profile.context';
import EditableInput from '../EditableInput';

function Dashboard({onSignOut}) {
  const {profile} = useProfileHook();
  const onSave = async (newData) => {
    console.log("This is the new data:",newData);
  }
  return (
    <>
    <Drawer.Header>
      <Drawer.Title>
        Dashboard
      </Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>
      <h3>Hey {profile.name}</h3>
      <Divider/>
      <EditableInput name={"nickname"} initalValue={profile.name} onSave={onSave} label={<h6 className='mb-2'>Nickname</h6>}/>
    </Drawer.Body>
    <Drawer.Footer>
      <Button block color='red' onClick={onSignOut} >Sign Out</Button>
    </Drawer.Footer>
    </>
  )
}


export default Dashboard