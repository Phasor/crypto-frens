import React from 'react'
import PostList from './PostList'
import InputBox from './InputBox'

export default function Feed() {
  return (
    <div className='flex-grow h-screen pt-6 pb-6'>
        {/* New post box */}
        <InputBox/>

        {/* Posts */}
        <PostList/>
    </div>
  )
}
