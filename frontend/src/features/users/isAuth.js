import { useSelector } from "react-redux";
import {selectUserById} from "./usersSlice";
import jwt from 'jsonwebtoken'

export const IsAuth = ({id}) => {
    const userData = useSelector(state => selectUserById(state, id))
    if(userData.token) {
        const token = userData.token
        const decodedToken = jwt.decode(token, {complete: true})
        const dateNow = new Date()

        return !(decodedToken.exp < dateNow.getTime());
    }
}

