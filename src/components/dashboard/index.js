import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfileHook } from '../../context/profile.context';
import EditableInput from '../EditableInput';
import { db } from '../../misc/firebase';
import ProviderBlock from './ProviderBlock';
import AvatarUploadBtn from './AvatarUploadBtn';
import { getUserUpdates } from '../../misc/helpers';

function Dashboard({ onSignOut }) {
  const { profile } = useProfileHook();
  const onSave = async (newData) => {
   // const userNicknameRef = db.ref(`/profiles/${profile.uid}`).child('name');
    try {
      //old way to do it but we need to update all info in realtime
      // await userNicknameRef.set(newData)
      const updates = await getUserUpdates(profile.uid, 'name', newData, db);
      await db.ref().update(updates);
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
        <AvatarUploadBtn/>
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color='red' onClick={onSignOut} >Sign Out</Button>
      </Drawer.Footer>
    </>
  );
}


export default Dashboard;