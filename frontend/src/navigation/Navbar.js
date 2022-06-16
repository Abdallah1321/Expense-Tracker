import React from 'react'
import {useSelector} from "react-redux";
import SignedInHeader from "./SignedInHeader";
import SignedOutHeader from "./SignedOutHeader";

const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.users.loggedIn)
    return(
        isLoggedIn ? <SignedInHeader/> : <SignedOutHeader/>
    )
}
export default Navbar