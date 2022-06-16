import {configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {combineReducers} from "redux";
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';

import usersReducer from '../features/users/usersSlice'
import walletsReducer from '../features/dashboard/dashboardSlice'
import transactionReducer from '../features/transactions/transactionSlice'
import scheduledTransactionsReducer from '../features/transactions/scheduledTransactionSlice'

const reducers = combineReducers({
    users: usersReducer,
    wallets: walletsReducer,
    transactions: transactionReducer,
    scheduledTransactions: scheduledTransactionsReducer
});

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

let persistor = persistStore(store);

export {store, persistor}
