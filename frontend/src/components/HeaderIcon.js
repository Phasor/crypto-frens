import React from 'react'

export default function HeaderIcon({ Icon, active }) {
  return (
    <div className='flex items-center rounded-xl cursor-pointer px-4 md:px-10 h-14
     md:hover:bg-gray-100 active:border-b-2 active:border-blue-300
     group
     '>
        <Icon className={`h-7 mx-auto group-hover:text-blue-500 text-center text-gray-500 ${active && 'text-blue-500'} `}/>
    </div>
  )
}
