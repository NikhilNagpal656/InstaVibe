import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const RecieverMessage = ({message}) => {
     const { messageData } = useSelector(
    (state) => state.messageSlice)
        const chatDiv = useRef()
     useEffect(()=>{
            chatDiv.current.scrollIntoView({behavior : "smooth"})
        },[message.message , message.image
    
        ])
  return (
      <div ref={chatDiv} className='w-fit max-w-[50%] bg-gradient-to-bl  gap-[50px] flex flex-col from-green-700 to-pink-400 p-3 rounded-t-2xl rounded-br-2xl relative left-0'>
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
        <img className='w-[30px] h-[30px] rounded-full absolute left-[-15px] bottom-[-35px]' src={messageData.profilePic} alt="" />
    }
    </div>
  )
}

export default RecieverMessage