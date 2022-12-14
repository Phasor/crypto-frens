import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Users from "./pages/Users";
import MyPosts from "./pages/MyPosts";
import Failed from "./pages/Failed";
import Settings from "./pages/Settings";
import UserDetail from "./pages/UserDetail";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
    return (
        <div className="h-screen bg-gray-100 overflow-hidden">
            <Router>
                <Routes>
                    {/* Open routes */}
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/signup" element={<SignUp />} />
                    <Route exact path="/login/failed" element={<Failed />} />

                    {/* Private routes */}
                    <Route element={<PrivateRoutes />}>
                        <Route exact path="/home" element={<Home />} />
                        <Route exact path="/users" element={<Users />} />
                        <Route
                            exact
                            path="/user/myposts"
                            element={<MyPosts />}
                        />
                        <Route exact path="/settings" element={<Settings />} />
                        <Route
                            exact
                            path="/user/:id"
                            element={<UserDetail />}
                        />
                    </Route>

                    {/* No match route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
