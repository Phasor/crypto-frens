import React from 'react'

export default function ImageModal({ postURL, setShowModal, showModal }) {

  return (
    <div className='flex items-center justify-center p-4 rounded bg-white'>
        <div className='p-2'>
            <img src={postURL} className=" max-w-[1000px] max-h-[800px] object-cover cursor-pointer" alt="" onClick={() => setShowModal(!showModal)}/>
            <p className='text-yellow-800 text-5xl absolute top-0 right-0 p-2 z-80'>HELLLOLO</p>
        </div>
    </div>
  )
}
