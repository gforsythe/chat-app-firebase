import { useState, useEffect, useCallback, useRef } from "react";
import { Alert, Button } from "rsuite";
import { useParams } from "react-router";
import { auth, db, storage } from "../../../misc/firebase";
import { groupByDate, transformToArrayWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";


const PAGE_SIZE = 15;
const messagesRef = db.ref('/messages');

function shouldScrollToBtm(node, threshold = 30){
  const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

function Messages() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef()
  
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMsgs = useCallback((limitToLast) => {
    const node = selfRef.current;

    messagesRef.off();

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .limitToLast(limitToLast || PAGE_SIZE)
      .on('value', snap => {
        const data = transformToArrayWithId(snap.val());
        setMessages(data);


        if(shouldScrollToBtm(node)){
          node.scrollTop = node.scrollHeight;
        }

      });
    setLimit(p => p + PAGE_SIZE);
  }, [chatId]);

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMsgs(limit);
    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMsgs, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMsgs();

    setTimeout(()=>{
      node.scrollTop = node.scrollHeight;

    },200)

    return () => {
      messagesRef.off('value');
    };

  }, [loadMsgs]);


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

  const renderMessages = () => {
    const groups = groupByDate(messages, (item) => new Date(item.createdAt).toDateString());

    const items = [];
    Object.keys(groups).forEach((date) => {
      items.push(<li key={date} className="text-center mb-1 padded">{date}</li>);
      const msgs = groups[date].map(msg => (<MessageItem
        key={msg.id}
        message={msg}
        handleAdmin={handleAdmin}
        handleLike={handleLike}
        handleDelete={handleDelete}
      />
      ));
      items.push(...msgs);
    });
    return items;
  };

  return (
    <ul  ref={selfRef} className="msg-list custom-scroll">
      {messages &&  messages.length  >= PAGE_SIZE && <li className="text-center mt-2 mb-2"><Button color="green" onClick={onLoadMore}>load more</Button></li>}
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
}

export default Messages;