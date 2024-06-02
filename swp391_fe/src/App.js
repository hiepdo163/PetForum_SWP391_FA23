import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//pages
import { SignUp } from "./components/SignUp";
import Login from "../src/components/Login/Login";
import Unauthorized from "./components/Unauthorized";
import UserMangement from "./pages/UserMangement";
import { styled } from "@mui/material/styles";
import PrivateRoute from "./components/route/PrivateRoute";
import NavBar from "./components/Navbar";
import PostView from "./components/PostView";
import PostEdit from "./components/PostEdit";
import { useState } from "react";
import { useEffect } from "react";
import { MainUnsigned } from "./components/Main_UnSigned";
import Footer from "./components/Footer";
import UserProfilePage from "./components/UserProfile/UserProfilePage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import OTPInput from "./components/OTPInput";
import ReportManagement from "./pages/ReportManagement";
import ShareOption from "./components/ShareOption";
import PublicInformation from "../src/components/PublicInformationPage/PublicInformation";
import CategoryManagement from "../src/components/Admin/CategoryManagement";

import Navigation from "./components/Navigation";
import { TradingPost } from "./pages/TradingPost";
import TradingPostDetails from "./pages/TradingPostDetails";
import PageNotFound from "./components/PageNotFound";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import MembershipPurchase from "./pages/MembershipPurchase";
import Upload from "./components/Upload";
import { Checkout } from "./components/Checkout";
import ScrollToTopFab from "./components/ScrollToTopFab";
import TradingPostManagement from "./components/Admin/TradingPostManagement";
function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    setIsLogin(jwt !== null);
  }, [isLogin]);

  return (
    <div className="App">
      <Router>
        <NavBar isLogin={isLogin} setIsLogin={setIsLogin} />
        <Box>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
          <MainLayout>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/login"
                element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />}
              />
              <Route
                path="/trading-post/details/"
                element={<TradingPostDetails />}
              />
              <Route path="/post" element={<PostView />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<MainUnsigned />} />
              <Route path="/trading-post" element={<TradingPost />} />
              <Route path="/public/profile" element={<PublicInformation />} />
              <Route path="/shareoption" element={<ShareOption />} />

              <Route path="/confirm-email/:token" element={<OTPInput />} />
              <Route path="/*" element={<PageNotFound />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute component={UserMangement} roles={["Admin"]} />
                }
              />
              <Route
                path="/Manage/User"
                element={
                  <PrivateRoute component={UserMangement} roles={["Admin"]} />
                }
              />
              <Route
                path="/Manage"
                element={
                  <PrivateRoute component={UserMangement} roles={["Admin"]} />
                }
              />
              <Route
                path="/Manage/Report"
                element={
                  <PrivateRoute
                    component={ReportManagement}
                    roles={["Admin", "Staff"]}
                  />
                }
              />
              <Route
                path="/Manage/Category"
                element={
                  <PrivateRoute
                    component={CategoryManagement}
                    roles={["Admin"]}
                  />
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute component={AdminDashboard} roles={["Admin"]} />
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute
                    component={UserProfilePage}
                    roles={["Admin", "Staff", "Member"]}
                  />
                }
              />
              <Route
                path="/trading-post/upload"
                element={
                  <PrivateRoute
                    component={Upload}
                    roles={["Admin", "Staff", "Member"]}
                  />
                }
              />
              <Route
                path="/Manage/trading-post"
                element={
                  <PrivateRoute
                    component={TradingPostManagement}
                    roles={["Admin", "Staff"]}
                  />
                }
              />
              <Route
                path="/membership/purchase"
                element={
                  <PrivateRoute
                    component={MembershipPurchase}
                    roles={["Admin", "Staff", "Member"]}
                  />
                }
              />
              <Route
                path="/post/upload"
                element={
                  <PrivateRoute
                    component={PostEdit}
                    roles={["Admin", "Staff", "Member"]}
                  />
                }
              />
            </Routes>
          </MainLayout>
        </Box>
        <Footer />
      </Router>
      <ScrollToTopFab />
    </div>
  );
}

const MainLayout = styled("div")`
  width: 100vw;
  height: auto;
  background-color: #f6f1f1;
  padding: 0 4.5rem;
`;

const Box = styled("div")({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
});

const NavigationContainer = styled("div")({
  width: "100%",
  height: "100%",
  backgroundColor: "#f6f1f1",
  padding: "3rem",
});

export default App;
