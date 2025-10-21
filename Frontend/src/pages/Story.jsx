/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import StoryCard from '../components/StoryCard'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryData } from '../utils/storySlice'
import { serverUrl } from '../App'

const Story = () => {
    const {userName} =  useParams()
    const dispatch = useDispatch()
     const {storyData} = useSelector((state)=> state.storySlice)

    const fetchStroy = async () => {
        const res = await axios.get(`${serverUrl}/api/story/getuser/${userName}` ,{withCredentials : true})
        dispatch(setStoryData(res.data[0]))
        
    }

    useEffect(()=> {
        if(userName){
            fetchStroy()
        }
    },[userName])
  return (
    <div className='w-full h-screen bg-gray-900 flex justify-center items-center'>
        <StoryCard storyData={storyData}/>
    </div>
  )
}

export default Story