import {createSlice, createAsyncThunk, createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import axios from "axios";

const scheduledTransactionAdapter = createEntityAdapter({
    selectId: (scheduledTransaction) => scheduledTransaction._id
})

const initialState = scheduledTransactionAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const getAllScheduledTransactions = createAsyncThunk('scheduledTransaction/fetchAll', async(reqBody, {rejectWithValue}) => {
    try {
        const {token, walletId} = reqBody
        const res = await axios({
            method: 'GET',
            url: process.env.REACT_APP_SERVER + `/scheduled/all/${walletId}`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        console.log('[scheduledTransactionSlice]: scheduledTransactionSlice ', res.data)
        return res.data
    } catch (e) {
        rejectWithValue(e.response.data.error.message)
    }
})

export const addScheduledTransaction = createAsyncThunk('scheduledTransactions/add', async(reqBody, {rejectWithValue}) => {
    try {
        const { token, type, description, value, recurring, date, recurringEach, frequency, walletID} = reqBody
        // console.log('request url:  : ', (process.env.REACT_APP_SERVER + `/` + transactionType + `/${transactionId}`))
        let sendObj
        console.log('[addScheduledTransaction]: data recieved: ', token, type, description, value, recurring, date, recurringEach, frequency, walletID)
        // if(recurring) {
        //     sendObj = {
        //         value,
        //         description,
        //         type,
        //         NextTransactionDate: date,
        //         Recurring: true,
        //         walletID,
        //         typeScheduledTransaction: recurringEach,
        //         transactionLength: frequency
        //     }
        // } else {
        //     sendObj = {
        //         value,
        //         description,
        //         type,
        //         NextTransactionDate: date,
        //         Recurring: false,
        //         walletID
        //     }
        // }



        console.log('recurring::: ', recurring)

        // if(recurring){
        //     const res = await axios({
        //         method: 'POST',
        //         url: process.env.REACT_APP_SERVER + `/transaction/${transactionType}`,
        //         headers: {
        //             'Authorization': 'Bearer ' + token
        //         },
        //         data: {
        //             value,
        //             description,
        //             type,
        //             NextTransactionDate: date,
        //             Recurring: true,
        //             walletID,
        //             typeScheduledTransaction: recurringEach,
        //             transactionLength: frequency
        //         }
        //     })
        // } else {
        //     const res = await axios({
        //         method: 'POST',
        //         url: process.env.REACT_APP_SERVER + `/transaction/${transactionType}`,
        //         headers: {
        //             'Authorization': 'Bearer ' + token
        //         },
        //         data: {
        //             value,
        //             description,
        //             type,
        //             NextTransactionDate: date,
        //             Recurring: false,
        //             walletID
        //         }
        //     })
        // }

        const res = await axios({
            method: 'POST',
            url: process.env.REACT_APP_SERVER + `/scheduled/new`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: (recurring) ? {
                value,
                description,
                type,
                NextTransactionDate: date,
                Recurring: true,
                walletID,
                typeScheduledTransaction: recurringEach,
                transactionLength: frequency
            } : {
                value,
                description,
                type,
                NextTransactionDate: date,
                Recurring: false,
                walletID
            }
        })
        console.log('[scheduledTransactionSlice]: addTransaction res ', res.data.scheduledTransactions)
        return res.data.scheduledTransactions
    } catch (e) {
        console.log('[transactionSlice]: addTransaction err ', e.response.data)
        rejectWithValue(e.response.data.error.message)
    }
})

const scheduledTransactionsSlice = createSlice({
    name: "scheduledTransactions",
    initialState,
    reducers: {
        addMultipleScheduledTransactions: scheduledTransactionAdapter.setAll,
        removeAllScheduledTransactions: scheduledTransactionAdapter.removeAll
    },
    extraReducers(builder){
        builder
            .addCase(getAllScheduledTransactions.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getAllScheduledTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded'
                scheduledTransactionAdapter.setAll(state, action.payload)
            })
            .addCase(getAllScheduledTransactions.rejected, (state, action) => {
                state.status = 'failed'
            })
            .addCase(addScheduledTransaction.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(addScheduledTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded'
                scheduledTransactionAdapter.addOne(state, action.payload)
            })
            .addCase(addScheduledTransaction.rejected, (state, action) => {
                state.status = 'failed'
            })
    }
})

export default scheduledTransactionsSlice.reducer
export const {addMultipleTransactions, removeMultipleTransactions} = scheduledTransactionsSlice.actions
export const {selectById: selectScheduledTransactionById,
    selectIds: selectScheduledTransactionIds,
    selectEntities: selectScheduledTransactionEntities,
    selectAll: selectAllScheduledTransactions,
    selectTotal: selectScheduledTransactionsUsers
} = scheduledTransactionAdapter.getSelectors(state => state.scheduledTransactions)