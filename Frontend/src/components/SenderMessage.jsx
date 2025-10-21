import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const SenderMessage = ({message}) => {
    const {user} = useSelector((state)=> state.userSlice)
    const chatDiv = useRef()
    useEffect(()=>{
        chatDiv.current.scrollIntoView({behavior : "smooth"})
    },[message.message , message.image

    ])
  return (
    <div ref={chatDiv} className='w-fit max-w-[50%] bg-gradient-to-bl ml-auto  gap-[50px] flex flex-col from-green-700 to-pink-400 p-3 rounded-t-2xl rounded-bl-2xl relative right-0'>
    {
        message.image &&
            <img className=' h-[150px] object-cover' src={message.image} alt="" />
    }
    {
        message.message && <div className=''>
          <p>{message.message}</p>
        </div>
    }
    {
        <img className='w-[30px] h-[30px] rounded-full absolute right-[-15px] bottom-[-35px]' src={user.profilePic} alt="" />
    }
    </div>
  )
}

export default SenderMessage