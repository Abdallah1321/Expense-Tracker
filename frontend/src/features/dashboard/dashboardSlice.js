import {createSlice, createAsyncThunk, createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import axios from "axios";

const walletsAdapter = createEntityAdapter({
    selectId: (wallet) => wallet._id
})

const initialState = walletsAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const fetchWallets = createAsyncThunk('wallets/fetch', async(token, {rejectWithValue}) => {
    console.log('react app server', process.env.REACT_APP_SERVER)
    try {
        const axiosRes = await axios({
            method: 'GET',
            url: process.env.REACT_APP_SERVER + '/wallet/viewAll',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        console.log('[fetchWallets]: fetch: ', axiosRes)
        return axiosRes.data
    } catch (e) {
        console.log('[fetchWallets] fetch error:  ', e.response.data.error.message)
        rejectWithValue(e.response.data.error.message)
    }
})

export const deleteWallet = createAsyncThunk('wallet/delete', async(reqBody, {rejectWithValue}) => {
    try {
        const {token, walletID} = reqBody
        const url = `${process.env.REACT_APP_SERVER}/wallet/${walletID}`
        const res = await axios({
            method: 'DELETE',
            url,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        console.log('[deleteWallets]: wallet/delete: ', res)
        return res.data
    } catch (e) {
        console.log('wallet deleted caught: ', e)
        rejectWithValue(e.response.data.error.message)
    }
})

export const editWallet = createAsyncThunk('wallet/edit', async(reqBody, {rejectWithValue}) => {
    try {
        const {token, walletID, name} = reqBody
        console.log('editWallet:: ', token, walletID, name)
        const url = `${process.env.REACT_APP_SERVER}/wallet/${walletID}`
        const res = await axios({
            method: 'PATCH',
            url,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                name
            }
        })
            console.log('res.data: ', res.data)
            if(res.data.name === name){
                return res.data
            }
        // console.log('wallet updated: ', res)
    } catch (e) {
        rejectWithValue(e.response.data.error.message)
    }
})

export const addWallet = createAsyncThunk('wallet/create', async( reqBody, {rejectWithValue}) => {
    try {
        const {token, name} = reqBody
        const res = await axios({
            method: 'POST',
            url: process.env.REACT_APP_SERVER + '/wallet/new',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                name
            }
        })

        console.log('addWallet: ', res)
        return res.data
    } catch (e) {
        rejectWithValue(e.response.data.error.message)
    }
})

// export const registerUser = createAsyncThunk('users/register', async(reqBody, {rejectWithValue}) => {
//     const {email, password, username, name} = reqBody
//     try {
//         const axiosRes = await axios({
//             method: 'POST',
//             url: 'http://localhost:3000/auth/signup',
//             data: {
//                 email,
//                 password,
//                 username,
//                 name
//             }
//         })
//
//         console.log(axiosRes.status)
//
//         return [axiosRes.data.user]
//
//     } catch (e) {
//         return rejectWithValue(e.response.data)
//     }
// })
//
// export const logoutUser = createAsyncThunk('users/logout', async(reqBody, {rejectWithValue}, ) => {
//     try {
//         const axiosRes = await axios({
//             method: 'POST',
//             url: 'http://localhost:3000/auth/logout',
//         })
//         console.log(axiosRes.data)
//         return [axiosRes.data]
//     } catch (e) {
//         return rejectWithValue(e.response.data)
//     }
// })

const walletsSlice = createSlice({
    name: "wallets",
    initialState,
    reducers: {
        userLogOut(state, action){
            state = initialState
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchWallets.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchWallets.fulfilled, (state, action) => {
                state.status = 'succeeded'
                walletsAdapter.setAll(state, action.payload)
            })
            .addCase(fetchWallets.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addWallet.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(addWallet.fulfilled, (state, action) => {
                state.status = 'succeeded'
                walletsAdapter.addOne(state, action.payload)
            })
            .addCase(addWallet.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(deleteWallet.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(deleteWallet.fulfilled, (state,action) => {
                console.log('[deleteWallet]: ', action.payload)
                state.status = 'succeeded'
                walletsAdapter.removeOne(state,action.payload.walletID)
            })
            .addCase(deleteWallet.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(editWallet.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(editWallet.fulfilled, (state, action) => {
                console.log('[editWallet]: ', action.payload)
                state.status = 'succeeded'
                walletsAdapter.upsertOne(state,action.payload)
            })
            .addCase(editWallet.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            // .addCase(registerUser.fulfilled, (state, action) => {
            //     state.status = 'succeeded'
            //     usersAdapter.setAll(state, action.payload)
            // })
            // .addCase(registerUser.rejected, (state,action) => {
            //     state.status = 'failed'
            //     state.error = action.payload.error.message
            // })
    }
})

export default walletsSlice.reducer
export const {userLogOut} = walletsSlice.actions
export const {selectById: selectWalletById,
    selectIds: selectWalletIds,
    selectEntities: selectWalletEntities,
    selectAll: selectAllWallets,
    selectTotal: selectWalletUsers
} = walletsAdapter.getSelectors(state => state.wallets)