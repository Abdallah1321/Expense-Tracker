import React, {useEffect} from 'react';
import {
    BrowserRouter as Router,
    useRoutes
} from "react-router-dom";
import AppRouter from "./routers/AppRouter";
import {useDispatch, useSelector} from "react-redux";
import {selectUserById, selectUserIds, loggedStatus} from "./features/users/usersSlice";
import Routes from "./routers/Routes";
import Header from "./Header";
import SignedOutHeader from "./navigation/SignedOutHeader";
import Navbar from "./navigation/Navbar";


function App () {
    // const userData = useSelector(state => selectUserById(state, ids[0]))

    // const routing = useRoutes(routes(isLoggedIn))
    // console.log('routes: ', routes(isLoggedIn))
    return (
        <>
        <Router>
            <Navbar/>
            <Routes/>
        </Router>
        </>
  );
}

export default App;
