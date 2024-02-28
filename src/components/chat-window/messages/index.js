import { useState, useEffect, useCallback } from "react";
import { Alert } from "rsuite";
import { useParams } from "react-router";
import { db } from "../../../misc/firebase";
import { transformToArrayWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";

function Messages() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = db.ref('/messages');

    messagesRef
    .orderByChild('roomId')
    .equalTo(chatId)
    .on('value', snap => {
      const data = transformToArrayWithId(snap.val());
      setMessages(data);
     
    });
  return () =>{
    messagesRef.off('value');
  }
    
  }, [chatId])


  const handleAdmin = useCallback( async (uid) => {
    const adminsRef = db.ref(`rooms/${chatId}/admins`)
    let alertMsg;
     await adminsRef.transaction(admins => {
      if (admins) {
        if (admins[uid]) {
          admins[uid] = null;
          alertMsg = "Admin Permission Removed!"
        } else {
          admins[uid] = true
          alertMsg = 'Admin Permission Granted'
        }
      }
      return admins;
     })
     Alert.info(alertMsg,4000)
   }, [chatId])
  
  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin}/>)}
    </ul>
  )
}

export default Messages