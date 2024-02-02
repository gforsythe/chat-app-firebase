import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfileHook } from '../../context/profile.context';
import EditableInput from '../EditableInput';
import { db } from '../../misc/firebase';
import ProviderBlock from './ProviderBlock';

function Dashboard({ onSignOut }) {
  const { profile } = useProfileHook();
  const onSave = async (newData) => {
    const userNicknameRef = db.ref(`/profiles/${profile.uid}`).child('name');
    try {
      await userNicknameRef.set(newData)
      Alert.success("Nickname Updated!", 4000)
    } catch (error) {
      Alert.error(error.message, 4000)
      
    }
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>
          Dashboard
        </Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>Hey {profile.name}</h3>
        <ProviderBlock/>
        <Divider />
        <EditableInput name={"nickname"} initalValue={profile.name} onSave={onSave} label={<h6 className='mb-2'>Nickname</h6>} />
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color='red' onClick={onSignOut} >Sign Out</Button>
      </Drawer.Footer>
    </>
  );
}


export default Dashboard;