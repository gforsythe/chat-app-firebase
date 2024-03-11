import TimeAgo from "timeago-react";
import { memo } from "react";
import IconBtnControl from "./IconBtnControl";
import { Button } from "rsuite";
import ProfileAvatar from "../../ProfileAvatar";
import { auth } from "../../../misc/firebase";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";
import PresenceDot from "../../PresenceDot";
import { useHover, useMediaQuery } from "../../../misc/custom-hooks";
import { useCurrentRoom } from "../../../context/current-room.context";

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount } = message;
  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery(('max-width: 992px'));
  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);
  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;
  const canShowIcons = isMobile || isHovered;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);


  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`} ref={selfRef}>
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar src={author.avatar} name={author.name} className='ml-1' size="xs" />

        <ProfileInfoBtnModal appearence="link" profile={author} className="p-0 ml-1 text-black">
          {canGrantAdmin &&
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">{isMsgAuthorAdmin ? "Remove Admin Permmision?" : "Give Admin For This Room"}</Button>}
        </ProfileInfoBtnModal>
        <TimeAgo className='font-normal text-black-45 ml-2'
          datetime={createdAt}
        />
        <IconBtnControl {...(isLiked ? { color: "red" } : {})} isVisible={canShowIcons}
          iconName="heart" tooltip="like this message" onClick={() => handleLike(message.id)} badgeContent={likeCount} />
          {
            isAuthor && (
              <IconBtnControl  isVisible={canShowIcons}
              iconName="close" tooltip="delete this message" onClick={() => handleDelete(message.id)} />
            )
          }
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);