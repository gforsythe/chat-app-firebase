import { memo } from 'react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { ButtonToolbar, Icon } from 'rsuite';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../misc/custom-hooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import FcmBtnModal from './FcmBtnModal';
import AskFcmBtnModal from './AskFcmBtnModal';

function Top() {
  const name = useCurrentRoom(v => v.name);
  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const isMobile = useMediaQuery('(max-width: 992px)');
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='text-disappear d-flex align-items-center'>
          <Icon componentClass={Link} to="/" icon="arrow-circle-left" size="2x" className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled' : 'd-none'} />
          <span className='text-disappear'>{name}</span>
        </h4>
        <ButtonToolbar className='ws-nowrap'>
          <AskFcmBtnModal/>
          {isAdmin && <EditRoomBtnDrawer/>}
          </ButtonToolbar>

      </div>
      <div className='d-flex justify-content-between align-items-center'>
        {isAdmin && <FcmBtnModal/> }
        
        <RoomInfoBtnModal/>
      </div>
    </div>
  );
}

export default memo(Top);