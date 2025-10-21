import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import storySlice from "./storySlice"
import reelSlice from "./reelSlice"
import postSlice from "./postSlice"
import messageSlice from "./messageSlice"
import socketSlice from "./socketSlice"

const store = configureStore({
    reducer : {
        userSlice,
        storySlice,
        reelSlice,
        postSlice,
        messageSlice,
        socketSlice
    }
})

export default store