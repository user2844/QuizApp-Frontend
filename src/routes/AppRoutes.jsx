import { Routes, Route } from "react-router-dom";

import Login from "../pages/User/Login/Login.jsx";
import SignUp from "../pages/User/Signup/SignUp.jsx";
//for user layout pages
import Quiz from "../pages/User/Quiz/QuizQuestion.jsx";
import Dashboard from "../pages/User/Dashboard/Dashboard.jsx";
import UserLayout from "../layouts/User/User.jsx";

//for admin layout pages
import AdminLayout from "../layouts/Admin/AdminLayout.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard/Dashboard.jsx";
import ManageQuiz from "../pages/Admin/ManageQuiz/ManageQuiz.jsx";

//utils
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx'
import AdminProtectedRoute from "../components/AdminProtectedRoute/AdminProtectedRoute.jsx";

export default function AppRoutes() {


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      {/* User */}
      <Route element={
        <ProtectedRoute>
          <UserLayout/>
        </ProtectedRoute>
        } >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
     </Route>
     
     {/* Admin */}
     <Route element={
      <AdminProtectedRoute>
        <AdminLayout/>
      </AdminProtectedRoute>
     }>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/questions" element={<ManageQuiz/>}/>
     </Route>
    </Routes>
  );
}
