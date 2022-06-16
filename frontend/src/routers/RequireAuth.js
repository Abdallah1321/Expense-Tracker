import {Component, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loggedStatus, selectUserById, selectUserIds} from "../features/users/usersSlice";
import jwt from "jsonwebtoken";

const RequireAuth = (Componentx) => {
    const dispatch = useDispatch()
    const ids = useSelector(selectUserIds)

    return class App extends Component {
        state = {
            isAuth: false,
            isLoading: true
        }
        componentWillMount() {
            const userData = useSelector(state => selectUserById(state, ids[0]))
            if(userData !== undefined && userData.token && ids !== []){
                const token = userData.token
                const decodedToken = jwt.decode(token, {complete: true})
                const dateNow = new Date()
                if (Date.now() <= decodedToken.payload.exp * 1000) {
                    dispatch(loggedStatus())
                    this.state.isAuth = true
                    this.state.isLoading = false
                } else {
                    this.state.isAuth = false
                    this.state.isLoading = false
                }
            }
        }
        render() {
            const {isAuth, isLoading} = this.state
            if(isLoading) {
                return <div>Loading!</div>
            }
            if(!isAuth){
                alert('not auth!')
            }
            return <Componentx {...this.props} />
        }
    }
}

export {RequireAuth}