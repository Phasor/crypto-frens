import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Users from './pages/Users';
import MyPosts from "./pages/MyPosts";
import Failed from './pages/Failed';
import Settings from './pages/Settings';


function App() {
    
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
        <Router>
            <Routes>
                <Route exact path="/home" element={<Home/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
                <Route exact path="/post/create" element={<CreatePost/>}/>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/users" element={<Users/>}/>
                <Route exact path="/user/myposts" element={<MyPosts/>}/>
                <Route exact path="/settings" element={<Settings/>}/>
                <Route exact path="/login/failed" element={<Failed/>}/>
                {/* No match route */}
                <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>
        </Router>
    </div> 
  );
}

export default App;
