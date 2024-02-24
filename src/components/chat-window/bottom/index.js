import { useCallback } from "react";
import { useState } from "react";
import { Alert, Icon, Input, InputGroup } from "rsuite";
import firebase from "firebase/app";
import { useProfileHook } from "../../../context/profile.context";
import { useParams } from "react-router";
import { db } from "../../../misc/firebase";


function assembleMessage(profile, chatId) {
  return {
    roomID: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {})
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,

  };
}

function Bottom() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const { chatId } = useParams();
  const { profile } = useProfileHook();

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);


  const onSendClick = async () => {
    if (input.trim() === "") {
      return;
    }
    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};
    const messageId = db.ref('messages').push().key;
    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);

    try {
      await db.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
      Alert.error(error.message);
    }


  };

  const onKeyDown = (ev) =>{
    if(ev.keyCode === 13){
      ev.preventDefault();
      onSendClick();
    }
  }


  return (
    <div>
      <InputGroup>
        <Input placeholder="write a new message here..." value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
        <InputGroup.Button disabled={isLoading} color="blue" appearance="primary" onClick={onSendClick}>
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}

export default Bottom;