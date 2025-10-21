import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        user : null,
        suggestedUser : null,
        profileData : null,
        following : [],
        searchUser : [],
        notificationData : []
    },
    reducers : {
        setUserData (state , action) {
                state.user = action.payload
        },
        setSuggestedUser (state , action) {
                state.suggestedUser = action.payload
        },
        setProfileData (state , action) {
                state.profileData = action.payload
        },
        setFollowing (state , action) {
            state.following = action.payload
        },
        setToggleFollow (state , action) {
            const targetUser = action.payload
            if(state.following.includes(targetUser)){
                state.following = state.following.filter((id)=> id!= targetUser)
            }else{
                state.following.push(targetUser)
            }
        },
        setSearch (state , action) {
            state.searchUser = action.payload
        },
        setNotificationData (state , action) {
            state.notificationData = action.payload
        },
    }
})

export const {setUserData ,setSuggestedUser , setProfileData , setFollowing , setToggleFollow , setNotificationData, setSearch} = userSlice.actions
export default userSlice.reducer