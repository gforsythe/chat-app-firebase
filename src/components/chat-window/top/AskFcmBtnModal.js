import { useParams } from "react-router";
import { IconButton, Icon, Modal, Button } from "rsuite";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useModalState } from "../../../misc/custom-hooks";
import { auth, db } from "../../../misc/firebase";

function AskFcmBtnModal() {
  const isRecievingFcm = useCurrentRoom((v) => v.isRecievingFcm);
  const { isOpen, open, close } = useModalState();
  const { chatId } = useParams();


  const onAccept = () => {
    db.ref(`/rooms/${chatId}/fcmUsers`).child(auth.currentUser.uid).set(true);

  };

  const onCancel = () => {
    db.ref(`/rooms/${chatId}/fcmUsers`).child(auth.currentUser.uid).remove();
  };


  return (
    <>
      <IconButton icon={<Icon icon="podcast" />} size="sm" circle color="blue" onClick={open} appearance={isRecievingFcm ? 'default' : 'ghost'} />
      <Modal show={isOpen} onHide={close} size="xs" backdrop="static" >
        <Modal.Header>
          <Modal.Title>Notifications Permission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isRecievingFcm ? <div className="text-center"><Icon className="text-green mb-3" icon="check-circle" size="5x" />
            <h6>You are subscribed to broadcast messages sent by admins of this room</h6>
          </div> : <div className="text-center">
            <Icon className="text-blue mb-3" icon="question-circle" size="5x" />
            <h6>Do you want to subscribe to messages sent by admin for this room? </h6>
          </div>}
          <p className=" text-red mt-2">To recieve notifications make sure you allow Notifications in your browser</p>
          <p>Permmision:{Notification.permission === "granted" ? <span className="text-green">Granted</span> : <span className="text-red">No Permmision</span>}</p>
        </Modal.Body>
        <Modal.Footer>
          {isRecievingFcm ? <Button color="green" onClick={onCancel}>I changed my mind</Button> : <Button color="green" onClick={onAccept}> Yes, I do!</Button>}
          <Button onClick={close}>Close</Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}

export default AskFcmBtnModal;