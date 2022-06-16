import {Fragment, useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {loginUser, registerUser, selectUserIds, selectAll, selectUserById} from "./usersSlice";
import jwt from 'jsonwebtoken'
import  { useNavigate } from 'react-router-dom'
// import {IsAuth} from "./isAuth";

import "./Login.css"
import {selectAllWallets, selectWalletIds} from "../dashboard/dashboardSlice";

export const LoginPage = (props) => {
    const dispatch = useDispatch()

    const ids = useSelector(selectUserIds)
    // const userData = useSelector(state => selectUserById(state, ids[0]))
    // const navigate = useNavigate()

    // if(userData && ids !== []){
    //     console.log('ids: ', ids[0])
    //     console.log('userData: ', userData.token)
    // }


    // useEffect(() => {
    //     const ids = useSelector(selectUserIds)
    //     const userData = useSelector(state => selectUserById(state, ids[0]))
    //
    //     if(userData !== undefined && userData.token && ids !== []) {
    //
    //         console.log('ids: ', ids[0])
    //         console.log('userData: ', userData.token)
    //
    //         const token = userData.token
    //         const decodedToken = jwt.decode(token, {complete: true})
    //         const dateNow = new Date()
    //
    //         console.log(decodedToken.payload.exp)
    //         console.log(dateNow.getTime())
    //
    //         if(Date.now() >= decodedToken.payload.exp * 1000) {
    //             console.log('expired!')
    //         } else {
    //             console.log('yikes')
    //             navigate("/");
    //         }
    //         // if(!(decodedToken.payload.exp < dateNow.getTime())){
    //         //     return <Navigate to="/"/>
    //         // } else if(decodedToken.payload.exp < dateNow.getTime()) {
    //         //     console.log('expired!')
    //         // }
    //     }
    //     else {
    //         console.log('not logged in!')
    //     }
    // }, [])

    const [cssClass, setcssClass] = useState(0)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [addRequestStatus, setAddRequestStatus] = useState('idle')



    let canPress
    console.log('addRequestStatus: ', addRequestStatus)


    if(cssClass === 0){
        canPress = [email, password].every(Boolean) && addRequestStatus === 'idle'
    } else {
        canPress = [email, password, username, name].every(Boolean) && addRequestStatus === 'idle'
    }

    const loginSubmit = async(e) => {
        e.preventDefault()

        setEmail("")
        setPassword("")
        setName("")
        setUsername("")

        try {
            if(canPress) {
                setAddRequestStatus('pending')
                await dispatch(loginUser({
                    email,
                    password
                })).unwrap()
            }
        } catch(e) {
            console.error('Failed to login: ', e)
        } finally {
            setAddRequestStatus('idle')
        }
    }

    const signupLogin = async(e) => {

        e.preventDefault()

        const emailX = email.replace(/\s/g,'')
        const passwordX = password.replace(/\s/g,'')
        const usernameX = username.replace(/\s/g, '')

        setEmail("")
        setPassword("")
        setName("")
        setUsername("")

        try {
            if(canPress) {
                setAddRequestStatus('pending')
                await dispatch(registerUser({
                    email: emailX,
                    password: passwordX,
                    username: usernameX,
                    name
                })).unwrap()
            }
        } catch(e) {
            console.error('Failed to sign up: ', e)
        } finally {
            setAddRequestStatus('idle')
        }

        setAddRequestStatus('pending')
        // await dispatch(loginUser())

    }

    const signInRef = useRef(null)
    const signUpRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        signInRef.current.addEventListener("click", () => {
            // containerRef.current.classList.add("right-panel-active")
            setcssClass(0)
        })

        signUpRef.current.addEventListener("click", () => {
            // containerRef.current.classList.remove("right-panel-active")
            setcssClass(1)
        })
    }, [])

    return(
        <div className={"container " + (cssClass === 1 ? 'right-panel-active' : '')}  id="container" ref={containerRef}>
            <div className="form-container sign-up-container">
                <form>
                    <h1>{props.signupTitle}</h1>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={!canPress}
                        onClick={signupLogin}
                    >Sign Up</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form>
                    <h1>{props.loginTitle}</h1>

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a href="#">Forgot your password?</a>
                    <button
                        type="submit"
                        disabled={!canPress}
                        onClick={loginSubmit}
                    >Sign In</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Hello there!</h1>
                        <p>Already a member? Log in to get back where you left off!</p>
                        <button className="ghost" id="signIn" ref={signInRef}>Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Welcome back!</h1>
                        <p>
                            Dont't have an account? Press the button below to create an
                            account and join us!
                        </p>
                        <button className="ghost" id="signUp" ref={signUpRef}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}