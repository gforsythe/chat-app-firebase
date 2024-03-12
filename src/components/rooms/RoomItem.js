import TimeAgo from 'timeago-react';
import ProfileAvatar from '../ProfileAvatar';

function RoomItem({ room }) {
  const { createdAt, name, lastMessage } = room;
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo className='font-normal text-black-45'
          datetime={lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)}
        />
      </div>

      <div className="d-flex align-items-center text-black-70">
        {
          lastMessage ? <>
            <div className='d-flex align-items-center'>
              <ProfileAvatar src={lastMessage.author.avatar} name={lastMessage.author.name} size="sm" />
              <div className='text-disappear ml-2'>
                <div className='italic'>{lastMessage.author.name}</div>
                <span>{lastMessage.text || lastMessage.file.name}</span>
              </div>
            </div>
          </> : <span>No Messages yet...</span>
        }

      </div>
    </div>
  );
}

export default RoomItem;