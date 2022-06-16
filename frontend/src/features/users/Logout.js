import {userLogOut} from "./usersSlice";
import {useDispatch} from "react-redux";
import  { useNavigate } from 'react-router-dom'

const LogOut = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    history.pushState(null, null, "/login")
    dispatch(userLogOut())
    navigate("/")
    return(
        <h1>Logged Out!</h1>

    )
}

export default LogOut