import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from "rsuite";
import { useParams } from "react-router";
import { useCallback, useRef, useState } from "react";
import { useModalState } from "../../../misc/custom-hooks";
import { functions } from "../../../misc/firebase";

const { StringType } = Schema.Types;

const model = Schema.Model({
  title: StringType().isRequired('Title name is required'),
  message: StringType().isRequired('Message body is required'),
});

const INITIAL_FORM = {
  title: "",
  message: "",
};

function FcmBtnModal() {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();


  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);

    try {
      const sendFcm = functions.httpsCallable('sendFcm');
      await sendFcm({ chatId, ...formValue });
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close()
      Alert.info('Notification has been sent!', 4000)
    } catch (err) {
      Alert.error(err.message,4000)
    }

  };
  return (
    <>
      <Button appearance="primary" size="xs" onClick={open}>
        <Icon icon="podcast" /> Broadcast Message
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>
            Send Notification to Room Users
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef} >
            {/* Name of Room */}
            <FormGroup>
              <ControlLabel>
                Title
              </ControlLabel>
              <FormControl name="title" placeholder="Enter Message Title..." />
            </FormGroup>
            {/* Room Description */}
            <FormGroup>
              <ControlLabel>
                Message
              </ControlLabel>
              <FormControl componentClass="textarea" rows={5} name="message" placeholder="Enter notification message..." />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>Publish Message</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FcmBtnModal;