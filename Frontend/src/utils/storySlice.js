import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name : 'story',
    initialState : {
        storyData : [],
        allStroy : [],
        currentUserStory : []
    },
    reducers : {
        setStoryData (state , action) {
                state.storyData = action.payload
        },
        setAllStory (state , action) {
                state.allStroy = action.payload
        },
        setCurrentUserStory (state , action) {
                state.currentUserStory = action.payload
        },
    }
})

export const {setStoryData , setAllStory , setCurrentUserStory} = storySlice.actions
export default storySlice.reducer