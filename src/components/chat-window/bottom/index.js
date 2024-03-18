/* eslint-disable */

import { useCallback } from "react";
import { useState } from "react";
import { Alert, Icon, Input, InputGroup } from "rsuite";
import firebase from "firebase/app";
import { useProfileHook } from "../../../context/profile.context";
import { useParams } from "react-router";
import { db } from "../../../misc/firebase";
import AttachmentBtnModal from "./AttachmentBtnModal";
import AudioMsgBtn from "./AudioMsgBtn";


function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {})
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,

  };
}

function Bottom() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(false);
      Alert.error(error.message);
    }


  };

  const onKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(async (files)=>{
    setIsLoading(true);
    const updates = {};
    files.forEach(file => {
      const msgData = assembleMessage(profile, chatId);
      msgData.file = file;
      const messageId = db.ref('messages').push().key;
    updates[`/messages/${messageId}`] = msgData;
    });

    const lastMsgId = Object.keys(updates).pop();
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...updates[lastMsgId],
      msgId: lastMsgId,
    };

    try {
      await db.ref().update(updates);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message);
    }

  },[chatId, profile])


  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload}/>
        <AudioMsgBtn afterUpload={afterUpload}/>
        <Input placeholder="write a new message here..." value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
        <InputGroup.Button disabled={isLoading} color="blue" appearance="primary" onClick={onSendClick}>
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}

export default Bottom;