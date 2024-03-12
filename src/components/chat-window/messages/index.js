import { useState, useEffect, useCallback } from "react";
import { Alert } from "rsuite";
import { useParams } from "react-router";
import { auth, db, storage } from "../../../misc/firebase";
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
    return () => {
      messagesRef.off('value');
    };

  }, [chatId]);


  const handleAdmin = useCallback(async (uid) => {
    const adminsRef = db.ref(`rooms/${chatId}/admins`);
    let alertMsg;
    await adminsRef.transaction(admins => {
      if (admins) {
        if (admins[uid]) {
          admins[uid] = null;
          alertMsg = "Admin Permission Removed!";
        } else {
          admins[uid] = true;
          alertMsg = 'Admin Permission Granted';
        }
      }
      return admins;
    });
    Alert.info(alertMsg, 4000);
  }, [chatId]);


  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const msgRef = db.ref(`/messages/${msgId}`);
    let alertMsg;
    await msgRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }

      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(async (msgId, file) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }
    const isLast = messages[messages.length - 1].id === msgId;
    const updates = {};
    updates[`/messages/${msgId}`] = null;

    if (isLast && messages.length > 1) {
      updates[`/rooms/${chatId}/lastMessage`] = {
        ...messages[messages.length - 2],
        msgId: messages[messages.length - 2].id
      };
    }

    if (isLast && messages.length === 1) {
      updates[`/rooms/${chatId}/lastMessage`] = null;

    }

    try {
      await db.ref().update(updates);
      Alert.info('Message has been deleted!');
    } catch (err) {
      return Alert.error(err.message);
    }

    if (file) {
      try {
        const fileRef = storage.refFromURL(file.url);
        await fileRef.delete();
      } catch (err) {
        Alert.error(err.message);
      }
    }


  }, [chatId, messages]);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem
        key={msg.id}
        message={msg}
        handleAdmin={handleAdmin}
        handleLike={handleLike}
        handleDelete={handleDelete}
      />)}
    </ul>
  );
}

export default Messages;