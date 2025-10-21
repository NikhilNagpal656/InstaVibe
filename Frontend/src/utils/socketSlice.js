import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name : 'socket',
    initialState : {
    socketData : null,
    onlineUsers : null
    },
    reducers : {
        setSocket (state , action) {
                state.socketData = action.payload
        },
        setOnlineUsers (state , action) {
                state.onlineUsers = action.payload
        },
    }
})

export const {setSocket , setOnlineUsers} = socketSlice.actions
export default socketSlice.reducer