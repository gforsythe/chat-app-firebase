import TimeAgo from "timeago-react";
import ProfileAvatar from "../../ProfileAvatar";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";
import PresenceDot from "../../PresenceDot";
import { useHover } from "../../../misc/custom-hooks";

const  MessageItem = ({message}) => {
  const {author, createdAt, text} = message;
  const [selfRef, isHovered] = useHover()
  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02':''}`} ref={selfRef}>
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid}/>
      <ProfileAvatar src={author.avatar} name={author.name} className='ml-1' size="xs"/>
      <ProfileInfoBtnModal appearence="link" profile={author} className="p-0 ml-1 text-black"/>
      <TimeAgo className='font-normal text-black-45 ml-2'
        datetime={createdAt}
        />

      </div> 
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  )
}

export default MessageItem