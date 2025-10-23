/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import ForgetPassword from './pages/ForgetPassword'
import useCurrentUser from './hooks/useCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import useAllUser from './hooks/useAllUser'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import useAllPost from './hooks/useAllPost'
import Reel from './pages/Reel'
import useAllReels from './hooks/userAllReels'
import Story from './pages/Story'
import useAllStories from './hooks/useAllStories'
import Message from './components/Message'
import MessageArea from './pages/MessageArea'
import { setOnlineUsers, setSocket } from './utils/socketSlice'
import {io} from "socket.io-client"
import useAllFollowing from './hooks/useAllFollowing'
import usePrevChat from './hooks/usePrevChat'
import Search from './pages/Search'
import useAllNotification from './hooks/useAllNotification'
import Notification from './pages/Notification'
import { setNotificationData } from './utils/userSlice'
export const serverUrl = "http://localhost:8000"


const App = () => {
  useCurrentUser()
  useAllUser()
  useAllPost()
  useAllReels()
  useAllStories()
  useAllFollowing()
  usePrevChat()
  useAllNotification()
  const { user, notificationData} = useSelector((state) => state.userSlice)
  const { socketData} = useSelector((state) => state.socketSlice)
  const dispatch = useDispatch()

  useEffect(()=> {
    if(user){
        const socketIo = io(`${serverUrl}` , {
          query : {
            userId : user._id
          }
        })
        dispatch(setSocket(socketIo))

        socketIo.on("getOnlineUser", (users)=> {
          dispatch(setOnlineUsers(users))
        })
        return ()=> socketIo.close()
    }else{
      if(socketData){
        socketData.close()
        dispatch(setSocket(null))
      }
    }
  }, [user])

  socketData?.on("newNotification" ,(noti)=> {
    dispatch(setNotificationData([...notificationData , noti]))
  })
  
  return (
   <Routes>
    <Route path='/signIn' element= {!user ? <SignIn/> : <Navigate to={"/"}/> }/>
    <Route path='/signUp' element = {!user ? <SignUp/> : <Navigate to={"/"}/> }/>
    <Route path='/' element = {user ? <Home/> : <Navigate to={"/signIn"}/>}/>
    <Route path='/forget-password' element = {user ? <Navigate to={"/"}/> : <ForgetPassword/>}/>
    <Route path='/userProfile/:userName' element = {user ? <UserProfile/> : <Navigate to={"/signIn"}/>}/>
    <Route path='/story/:userName' element = {user ? <Story/> : <Navigate to={"/signIn"}/>}/>
    <Route path='/edit-Profile' element = {user ? <EditProfile/> : <Navigate to={"/signIn"}/>}/>
    <Route path='/upload' element = {user ? <Upload/> : <Navigate to={"/signIn"}/>} />
    <Route path='/reels' element = {user ? <Reel/> : <Navigate to={"/signIn"}/>} />
    <Route path='/message' element = {user ? <Message/> : <Navigate to={"/signIn"}/>} />
    <Route path='/messageArea' element = {user ? <MessageArea/> : <Navigate to={"/signIn"}/>} />
    <Route path='/search' element = {user ? <Search/> : <Navigate to={"/signIn"}/>} />
    <Route path='/notification' element = {user ? <Notification/> : <Navigate to={"/signIn"}/>} />
   </Routes>
  )
}

export default App
