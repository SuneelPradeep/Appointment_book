import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem('token')
const initialState = {
    isAuthenticated : !!token,
    token : token,
    user : null
}

const authSlice = createSlice({initialState,name :'auth',reducers:{
    loginSuccess : (state,action)=>{
        const {token,user} = action.payload
        state.isAuthenticated = true;
        state.token = token || ''
        state.user = user || null
        localStorage.setItem('token',token)
        
    },
    logout : (state)=>{
        state.isAuthenticated=false;
        state.token = null
        state.user = null;
        localStorage.removeItem('token')
    }
}})

export const {logout,loginSuccess} = authSlice.actions
export default authSlice.reducer;