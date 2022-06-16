import {createSlice, createAsyncThunk, createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import axios from "axios";

const transactionAdapter = createEntityAdapter({
    selectId: (transaction) => transaction._id
})

const initialState = transactionAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const getTransactionById = createAsyncThunk('transaction/fetch', async(reqBody, {rejectWithValue}) => {
    try{
        const {token, transactionId} = reqBody
        const res = await axios({
            method: 'GET',
            url: process.env.REACT_APP_SERVER + `/transaction/${transactionId}`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        console.log('[transactionSlice]: getTransactionById res ', res.data)
        return res.data
    } catch (e) {
        rejectWithValue(e.response.data.error.message)
    }
})



export const addTransaction = createAsyncThunk('transaction/add', async(reqBody, {rejectWithValue}) => {
    try {
        const { value, description, type, walletID, token } = reqBody
        const transactionType = (type === 'p') ? 'profit' : 'expense'
        // console.log('request url:  : ', (process.env.REACT_APP_SERVER + `/` + transactionType + `/${transactionId}`))
        const res = await axios({
            method: 'POST',
            url: process.env.REACT_APP_SERVER + `/transaction/${transactionType}`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                value,
                description,
                walletID,
                type,
                TransactionDate: +new Date()
            }
        })
        console.log('[transactionSlice]: addTransaction res ', res.data)
        return res.data
    } catch (e) {
        console.log('[transactionSlice]: addTransaction err ', e.response.data)
        rejectWithValue(e.response.data.error.message)
    }
})

export const updateTransactionById = createAsyncThunk('transaction/update', async(reqBody, {rejectWithValue}) => {
    try {
        const { value, description, type, transactionId, token } = reqBody

        const transactionType = (type === 'p') ? 'profit' : 'expense'
        console.log('request url:  : ', (process.env.REACT_APP_SERVER + `/` + transactionType + `/${transactionId}`))
        const res = await axios({
            method: 'PATCH',
            url: process.env.REACT_APP_SERVER + `/transaction/${transactionType}/${transactionId}`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                value,
                description,
                // TransactionDate: +new Date()
            }
        })
        if(res.data.description === description){
            return res.data
        }
        console.log('[transactionSlice]: updateTransactionById res ', res.data)
        // return res.data
    } catch (e) {
        console.log('[transactionSlice]: updateTransactionById err ', e.response.data)
        rejectWithValue(e.response.data.error.message)
    }
})

export const deleteTransactionById = createAsyncThunk('transaction/delete', async(reqBody, {rejectWithValue}) => {
    try {
        const { transactionId, token, type } = reqBody
        const transactionType = (type === 'p') ? 'profit' : 'expense'
        const res = await axios({
            method: 'DELETE',
            url: process.env.REACT_APP_SERVER + `/transaction/${transactionType}/${transactionId}`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        console.log('[transactionSlice]: deleteTransactionById res ', res.data)
        return res.data
    } catch (e) {
        console.log('[transactionSlice]: deleteTransactionById err ', e.response.data)
        rejectWithValue(e.response.data.error.message)
    }
})

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
      addMultipleTransactions: transactionAdapter.setAll,
      removeAllTransactions: transactionAdapter.removeAll
    },
    extraReducers(builder){
        builder
            .addCase(getTransactionById.pending, (state, action) =>
            {
                state.status = 'loading'
            })
            .addCase(getTransactionById.fulfilled, (state,action) =>
            {
                state.status = 'succeeded'
                // return action.payload
                // transactionAdapter.addOne(state, action.payload)
            })
            .addCase(getTransactionById.rejected, (state, action) =>
            {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(deleteTransactionById.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(deleteTransactionById.fulfilled, (state, action) => {
                state.status = 'succeeded'
                transactionAdapter.removeOne(state, action.payload._id)
            })
            .addCase(deleteTransactionById.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addTransaction.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded'
                transactionAdapter.addOne(state, action.payload)
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(updateTransactionById.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(updateTransactionById.fulfilled, (state, action) => {
                state.status = 'succeeded'
                transactionAdapter.upsertOne(state, action.payload)
            })
            .addCase(updateTransactionById.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })


    }
})

export default transactionSlice.reducer
export const {addMultipleTransactions, removeAllTransactions} = transactionSlice.actions

export const {selectById: selectTransactionById,
    selectIds: selectTransactionIds,
    selectEntities: selectTransactionEntities,
    selectAll: selectAllTransactions,
    selectTotal: selectTransactionUsers
} = transactionAdapter.getSelectors(state => state.transactions)