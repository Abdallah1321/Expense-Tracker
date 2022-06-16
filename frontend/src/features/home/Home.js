import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectUserById, selectUserIds} from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

export function Home(props) {
    let navigate = useNavigate()
    const {changeURL} = props
    let dataNull = false
    const ids = useSelector(selectUserIds)
    const userData = useSelector(state => selectUserById(state, ids[0]))

    useEffect(() => {
        if(changeURL) {
            window.history.pushState(null,null, "/")
        }
    }, [changeURL])

    return (
        <div>
            <h1>
            {
                dataNull ? `Hey, ${userData.name}!` : 'Hey, world!'
            }
            </h1>
        </div>
    );
}
