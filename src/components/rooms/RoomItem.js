import TimeAgo from 'timeago-react';

function RoomItem({room}) {
  const {createdAt, name} = room
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo className='font-normal text-black-45'
          datetime={new Date(createdAt)}
          
        />
      </div>

      <div className="d-flex align-items-center text-black-70">
        <span>No Messages yet...</span>
      </div>
    </div>
  );
}

export default RoomItem;