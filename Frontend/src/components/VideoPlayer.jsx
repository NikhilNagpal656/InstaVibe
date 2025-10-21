/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeXmark } from "react-icons/fa6";

const VideoPlayer = ({media}) => {
    const videoInput = useRef()
    const [isPlaying , setIsPlaying] = useState(true)
    const [mute , setMute] = useState(true)

    const handlePlay = () => {
        if(isPlaying){
            videoInput.current.pause()
            setIsPlaying(false)
        }else{
            videoInput.current.play()
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
          const video = videoInput.current;
          if (entry.isIntersecting) {
            video.play();
            setIsPlaying(true)
          } else {
            video.pause();
            setIsPlaying(false)
          }
        } , {threshold : 0.6})
        if(videoInput.current){
          observer.observe(videoInput.current);
        }
    
        return () => {
          if(videoInput.current){
            observer.unobserve(videoInput.current)
          }
        }
      }, []);

    const handleMute = () => {
        setMute((prev)=> !prev)
    }
  return (
    <div  className='w-full h-[100%] relative overflow-hidden'>
        <video onClick={handlePlay} ref={videoInput} src={media} autoPlay loop muted={mute} className='object-cover w-full h-full  z-0' />
       <div onClick={handleMute} className=' absolute z-10  bottom-5 right-5 w-[20px] h-[20px]'>
         {
            !mute ? <FaVolumeUp  className=' text-white font-semibold  text-2xl' /> : <FaVolumeXmark  className='absolute text-white font-semibold text-2xl' />
        }
       </div>
    </div>
  )
}

export default VideoPlayer