import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import FriendsList from "../components/FriendsList";
import MyPostList from "../components/MyPostList";
import { useLocation } from "react-router-dom";

export default function MyPosts() {
  const location = useLocation();

  const setDataFromUrl = async () => {
    if (location.search) {
      // there is a query string, hence this is a Google auth login, not a local auth login
      const rawData = location.search.split("=")[1];
      const firstElem = rawData.split("&")[0];
      const tokenValue = firstElem.replace("%20", " ");
      // console.log(`tokenValue: ${tokenValue}`);
      // setTokenGoog(tokenValue);
      localStorage.setItem("token", tokenValue);
      const userIDValue = location.search.split("=")[3];
      localStorage.setItem("userID", userIDValue);
    }
  };

  return (
    <div>
      <div>
        <NavBar setDataFromUrl={setDataFromUrl} />
        <div className="w-full h-screen flex justify-center">
          <Sidebar setDataFromUrl={setDataFromUrl} />
          <MyPostList />
          <FriendsList />
        </div>
      </div>
    </div>
  );
}
