import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";

const usersAdapter = createEntityAdapter({
    selectId: (user) => user._id
})
const initialState = usersAdapter.getInitialState({
    status: 'idle',
    error: null,
    loggedIn: false
})

export const loginUser = createAsyncThunk('users/login', async(reqBody, {rejectWithValue}) => {
    const {email, password} = reqBody
    try {
        const axiosRes = await axios({
            method: 'POST',
            url: 'http://localhost:3000/auth/login',
            data: {
                email,
                password
            }
        })

        console.log(axiosRes.data)

        return [axiosRes.data]
    } catch (e) {
        console.log('[LoginUser]: catched error: ', e)
        if(e.response){
            console.log('loginUser: ', e.response.data.error.message)
            return rejectWithValue(e.response.data.error.message)
        } else {
            console.log('loginUser axios error:  ', e)
        }
    }
})

export const registerUser = createAsyncThunk('users/register', async(reqBody, {rejectWithValue}) => {
    const {email, password, username, name} = reqBody
    try {
        const axiosRes = await axios({
            method: 'POST',
            url: 'http://localhost:3000/auth/signup',
            data: {
                email,
                password,
                username,
                name
            }
        })
        console.log(axiosRes.status)
        return [axiosRes.data.user]
    } catch (e) {
        return rejectWithValue(e.response.data.error.message)
    }
})

export const logoutUser = createAsyncThunk('users/logout', async(reqBody, {rejectWithValue}, ) => {
    try {
        const axiosRes = await axios({
            method: 'POST',
            url: 'http://localhost:3000/auth/logout',
        })
        console.log(axiosRes.data)
        return [axiosRes.data]
    } catch (e) {
        return rejectWithValue(e.response.data)
    }
})

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        userLogOut: () => initialState,
        loggedStatus: (state, action) => {
            state = state,
            state.loggedIn = action.payload
        },


    },
    extraReducers(builder) {
        builder.addCase(loginUser.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.loggedIn = true
                usersAdapter.setAll(state, action.payload)
            })
            .addCase(loginUser.rejected, (state,action) => {
                console.log('loginUser rejected: ', action)
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.loggedIn = true
                usersAdapter.setAll(state, action.payload)
            })
            .addCase(registerUser.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export default usersSlice.reducer
export const {userLogOut, loggedStatus} = usersSlice.actions

export const {selectById: selectUserById,
    selectIds: selectUserIds,
    selectEntities: selectUserEntities,
    selectAll,
    selectTotal: selectTotalUsers
} = usersAdapter.getSelectors(state => state.users)