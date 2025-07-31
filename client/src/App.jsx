import React, { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/index";
import Chat from "./pages/chat/index";
import Profile from "./pages/profile/index";
import { useAppStore } from "./store/index";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
function App() {

  const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth" />
  }

  const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? <Navigate to="/chat" /> : children;
  }

  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if(response.status === 200 && response.data.data.id){
          setUserInfo(response.data.data) ; 
        }else{
          setLoading(undefined)
        }
        console.log({ response });
      } catch (error) {
        setUserInfo(undefined) ; 
        console.log({ error });
      } finally {
        setLoading(false);
      } ; 
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo])


  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }></Route>
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }></Route>
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>}></Route>
          <Route path="*" element={<Navigate to="/auth" />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App