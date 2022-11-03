import React from 'react'
import SidebarRow from './SidebarRow'
import { UserPlusIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { NewspaperIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <div className='p-2 max-w-[600px] xl:min-w-[300px] bg-gray-100 border-r-2 border-gray-200'>
        <div className='mt-6'>
            <SidebarRow Icon={UserGroupIcon} title="Friends"/>
            <SidebarRow Icon={UserPlusIcon} title="Add Friends" />
            <SidebarRow Icon={NewspaperIcon} title="My Posts" />
        </div>
    </div>
  )
}
