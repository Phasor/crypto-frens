import React, { useState } from 'react'
import PostList from './PostList'
import InputBox from './InputBox'

export default function Feed() {
const [refreshFeed, setRefreshFeed] = useState(true);

  return (
    <div className='flex-grow h-screen pt-6 pb-6 bg-gray-100 overflow-y-auto scrollbar-hide'>
        <div className='mx-auto max-w-md md:max-w-lg lg:max-w-2xl'>
            {/* New post box */}
            <InputBox setRefreshFeed={setRefreshFeed} refreshFeed={refreshFeed}/>

            {/* Posts */}
            <PostList refreshFeed={refreshFeed}/>
        </div>
    </div>
  )
}