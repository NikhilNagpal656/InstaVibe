import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name : 'message',
    initialState : {
        messageData : null,
        userMessage : [],
        prevChatUser : null
    },
    reducers : {
        setMessageData (state , action) {
                state.messageData = action.payload
        },
        setUserMessage (state , action) {
                state.userMessage = action.payload
        },
        setPrevChat (state , action) {
                state.prevChatUser = action.payload
        },
        
    }
})

export const {setMessageData ,setUserMessage , setPrevChat} = messageSlice.actions
export default messageSlice.reducer