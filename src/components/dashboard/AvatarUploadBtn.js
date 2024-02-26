import { Alert, Button, Modal } from "rsuite";
import { useModalState } from "../../misc/custom-hooks";
import { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import { db, storage } from "../../misc/firebase";
import { useProfileHook } from "../../context/profile.context";
import ProfileAvatar from "../ProfileAvatar";
import { getUserUpdates } from "../../misc/helpers";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const getBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File Process Error'));
      }
    });
  });
};

function AvatarUploadBtn() {
  const { isOpen, open, close } = useModalState();
  const { profile } = useProfileHook();
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarEditorRef = useRef();

  const onFileInputChange = (ev) => {
    const currentFiles = ev.target.files;

    if (currentFiles.length === 1) {
      const file = currentFiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong File Type Bro: ${file.type}`, 4000);
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age-${3600 * 24 * 3}`
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      const updates = await getUserUpdates(profile.uid, 'avatar', downloadUrl, db);
      await db.ref().update(updates);

      // old way updated on line 57
      // const userAvatarRef = db.ref(`/profiles/${profile.uid}`).child('avatar');
     // userAvatarRef.set(downloadUrl);
      setIsLoading(false);
      Alert.info('Avatar has been uploaded', 4000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
      console.log(error.message);

    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge" />
      <div>
        <label htmlFor="avatar-upload" className="d-block cursor-pointer padded">
          Select New Avatar
          <input onChange={onFileInputChange} id="avatar-upload" type="file" className="d-none" accept={fileInputTypes} />
        </label>
        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>
              Adjust and upload new avatar
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img &&
                <AvatarEditor image={img}
                  ref={avatarEditorRef}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onUploadClick} block appearance="ghost" disabled={isLoading}>Upload new avatar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AvatarUploadBtn;