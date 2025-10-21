import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setMessageData } from '../utils/messageSlice'

const OnlineUser = ({user}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  return (
    <div className='w-[50px] h-[50px] flex items-center  justify-start relative'>
        <div className='w-[50px] h-[50px] border-2 border-gray-600 rounded-full cursor-pointer overflow-hidden' onClick={()=> {
            dispatch(setMessageData(user))
            navigate("/messageArea")}
        }>
            
            <img src={user.profilePic ||  `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt="" />
        </div>
        <div className='w-[13px] h-[13px] rounded-full bg-blue-600 absolute right-[-2px] z-10 top-0'>

        </div>
    </div>
  )
}

export default OnlineUser