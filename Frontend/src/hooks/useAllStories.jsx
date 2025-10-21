/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { setAllStory } from '../utils/storySlice'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'

const useAllStories = () => {

    const dispatch = useDispatch()
    const {storyData} = useSelector((state)=> state.storySlice)
    const {user} = useSelector((state)=> state.userSlice)
 
    const fetchAllStories = async () => {
        dispatch(setAllStory(null))
        const res = await axios.get(`${serverUrl}/api/story/getAllStroy` ,{withCredentials : true})
        dispatch(setAllStory(res.data))   
    }

     useEffect(()=>{
            fetchAllStories()
        },[user , storyData])
}

export default useAllStories