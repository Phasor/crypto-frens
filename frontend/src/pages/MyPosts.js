import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import FriendsList from '../components/FriendsList';
import MyPostList from '../components/MyPostList';

export default function MyPosts() {

  return (
    <div>
    <div>
        <NavBar/>
        <div className='w-full h-screen flex justify-center'>
            <Sidebar/>
            <MyPostList/>
            <FriendsList />
        </div>
    </div>
</div>
  )
}
