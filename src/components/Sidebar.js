import React from 'react'
import DashboardToggle from './dashboard/DashboardToggle';
import CreateRoomBtnModal from './dashboard/CreateRoomBtnModal';

function Sidebar() {
  return (
    <div className='h-100 pt-2'>
      <div>
        <DashboardToggle/>
        <CreateRoomBtnModal/>
      </div>

      button 
    </div>
  )
}

export default Sidebar