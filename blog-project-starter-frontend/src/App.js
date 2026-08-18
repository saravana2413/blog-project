import Home from "./components/Home";
import Blogs from "./components/Blogs";
import Navbar from "./components/common/Navbar";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
  <AuthProvider>
   <div className="px-10  bg-white border rounded-md">
    <BrowserRouter>
    <Navbar/>
    <Routes>
     <Route
    path="/home"
    element={
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    }
/>
  <Route
    path="/blogs"
    element={
        <ProtectedRoute>
            <Blogs />
        </ProtectedRoute>
    }
/>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
    </Routes>

    </BrowserRouter>
   </div>
  </AuthProvider>
  );
}

export default App;
