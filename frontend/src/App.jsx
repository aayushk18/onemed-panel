import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import { Home, Loader } from "lucide-react";
import Faculty from "./components/admin/FacultyLayout";
import WebsiteLayout from "./components/admin/WebsiteLayout";
import WebsitePanel from "./components/admin/website/WebsitePanel";
import WebsiteHome from "./components/admin/website/WebsiteHome";
import WebsiteAbout from "./components/admin/website/WebsiteAbout";
import AcademicLayout from "./components/admin/AcademicLayout";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./utils/useAuthStore";
import Login from "./pages/Login";
import AdmissionsLayout from "./components/admin/AdmissionsLayout";
import ReportsLayout from "./components/admin/ReportsLayout";
import WebsiteResourcesLayout from "./components/admin/website/WebsiteResourcesLayout";
import AddResources from "./components/admin/website/resources/AddResources";
import WebsiteResourcesTable from "./components/admin/website/resources/WebsiteResourcesTable";
import Signup from "./pages/Signup";

function App() {
  const [count, setCount] = useState(0);
  const { authUser, userType, checkAuth, isCheckAuth } = useAuthStore();



  useEffect(() => {
    checkAuth()
  }, [checkAuth])


  if (isCheckAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-20 animate-spin' />
    </div>
  )






  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            userType ? (
              userType == "admin" ? (
                <Navigate to="/admin" />
              ) : userType == "staff" ? (
                <Navigate to="/staff" />
              ) : userType == "student" ? (
                <Navigate to="/student" />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={!userType ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!userType ? <Signup /> : <Navigate to="/" />}
        />

        <Route path='/admin' element={userType == 'admin' ? <AdminLayout /> : <Navigate to='/login' />} >
          <Route index element={<AdminDashboard />} />
          <Route path="home" element={<Home />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="website" element={<WebsiteLayout />}>
            <Route index element={<WebsiteHome />} />
            <Route path="panel" element={<WebsitePanel />} />
            <Route path="resources" element={<WebsiteResourcesLayout />} >
              <Route index element={<WebsiteResourcesTable />} />
              <Route path="add-materials" element={<AddResources />} />
              {/* <Route path="resources" element={<WebsiteResources />} /> */}

            </Route>
            {/* <Route path="blogs" element={<WebsiteBlogs />} /> */}
            <Route path="about" element={<WebsiteAbout />} />
          </Route>
          <Route path="academic" element={<AcademicLayout />}>
            <Route path="students" element={<WebsitePanel />} />
            <Route path="classes" element={<WebsitePanel />} />
            <Route path="courses" element={<WebsitePanel />} />
            <Route path="materials" element={<WebsitePanel />} />
          </Route>

          <Route path="admissions" element={<AdmissionsLayout />}></Route>
          <Route path="reports" element={<ReportsLayout />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
