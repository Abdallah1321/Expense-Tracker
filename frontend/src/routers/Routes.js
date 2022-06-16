import {useDispatch, useSelector} from "react-redux";
import {useRoutes} from "react-router-dom";
import routes from "../routers/AppRouter";
import {loggedStatus, selectUserById, selectUserIds} from "../features/users/usersSlice";
import jwt from "jsonwebtoken";

const Routes = () => {
        const dispatch = useDispatch()
        const ids = useSelector(selectUserIds)
        const userData = useSelector(state => selectUserById(state, ids[0]))

        if(userData !== undefined && userData.token && ids !== []){
                const token = userData.token
                const decodedToken = jwt.decode(token, {complete: true})
                const dateNow = new Date()
                if (Date.now() <= decodedToken.payload.exp * 1000) {
                        dispatch(loggedStatus(true))
                        // this.state.isAuth = true
                        // this.state.isLoading = false
                } else {
                        dispatch(loggedStatus(false))
                }
        } else {
                dispatch(loggedStatus(false))
        }

        const isLoggedIn = useSelector((state) => state.users.loggedIn)
        console.log(isLoggedIn)
        return useRoutes(routes(isLoggedIn))
}

export default Routes