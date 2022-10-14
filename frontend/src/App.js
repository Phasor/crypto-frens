import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import CreatePost from './pages/CreatePost';


function App() {
  return (
    <Router>
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/signup" element={<SignUp/>}/>
            <Route exact path="/post/create" element={<CreatePost/>}/>
            {/* No match route */}
            <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
    </Router>
  );
}

export default App;
