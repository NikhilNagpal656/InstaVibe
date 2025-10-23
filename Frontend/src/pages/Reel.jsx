import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ReelCard from '../components/ReelCard'

const Reel = () => {
  const {reelData} = useSelector((state)=> state.reelSlice)
  return (
    <div className='w-full h-screen flex justify-center items-center bg-gray-900 overflow-hidden'>
      <div className='flex fixed top-[20px] z-10 text-white text-2xl gap-4 items-center left-[20px]'>
        <Link to={"/"}>
          <FaArrowLeftLong />
        </Link>
        <p>Reels</p>
      </div>
      <div className='w-full h-[100vh] z-0 snap-y snap-mandatory overflow-y-scroll'>
      {
        reelData.map((reel)=>(
          <div className='h-screen snap-start'>
            <ReelCard reel={reel}/>
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default Reel
