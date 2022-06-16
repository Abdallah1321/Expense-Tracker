import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import {Alert, Box} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {loginUser, selectUserIds, selectAll, selectUserById} from "./usersSlice";
import {Expire, CustomAlert} from "../../utils";


const Login = ({ handleChange }) => {
    const dispatch = useDispatch()
    const ids = useSelector(selectUserIds)
    const [email, setEmail] = useState("")
    const [Error, setError] = useState(false)
    const [password, setPassword] = useState("")
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const [emailValidateErr, setemailValidateErr] = useState(null)

    const canPress = [email, password].every(Boolean) && addRequestStatus === 'idle' && !!!emailValidateErr

    const emailValidate = () => {
        const validate = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
        return validate ? setemailValidateErr(null) : setemailValidateErr("Email is not valid")
    }

    const paperStyle = {
        padding: '20px 10px',
        height: "100%",
        width: 300,
        margin: "20px auto",
    };

    const avatarStyle = {
        backgroundColor: "#5e60ce",
    };

    const btnStyle = {
        margin: "8px 0",
    };

    // const alertSend = () => {
    //     return(
    //         <Box display="flex" justifyContent="center" alignItems="center">
    //             <Box
    //                 display="flex"
    //                 justifyContent="center"
    //                 alignItems="center"
    //             >
    //                 <Alert
    //                     severity="error"
    //                     closeText="Close"
    //                     sx={{
    //                         textAlign: "center",
    //                         margin: '18px 0 3px 0',
    //                         paddingTop: '5px',
    //                         backgroundColor: 'rgb(253, 237, 237) !important'
    //                     }}
    //                 >
    //                     {Error}
    //                 </Alert>
    //             </Box>
    //         </Box>
    //     )
    // }

    // const Expire = (props) => {
    //     const [visible, setVisible] = useState(true)
    //     useEffect(() => {
    //         setTimeout(() => {
    //             setVisible(false)
    //         }, props.delay)
    //     }, [props.delay])
    //
    //     return visible ? <>{props.children}</> : <></>
    // }

    const loginSubmit = async(e) => {
        e.preventDefault()
        setEmail("")
        setPassword("")
        try {
            if(canPress){
                setAddRequestStatus('pending')
                await dispatch(loginUser({
                    email,
                    password
                })).unwrap()
            }
        } catch(e) {
            // setErrorAlert(true)
            setError(e)
            console.log('[LoginPage] Failed to login: ', e)
        } finally {
            setAddRequestStatus('idle')
        }
    }

return(
    <>
        {(Error && addRequestStatus === 'idle') ?
            <Expire delay={5000}>
                <CustomAlert severity="error" message={Error}/>
            </Expire> : <></>
        }
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                    <Avatar style={avatarStyle}>
                        <LoginOutlinedIcon />
                    </Avatar>
                    <h2>Sign in</h2>
                </Grid>
                <TextField
                    label="Email"
                    placeholder="Enter email"
                    fullWidth
                    value={email}
                    error={!!emailValidateErr}
                    onBlur={emailValidate}
                    helperText={emailValidateErr}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                />
                <TextField
                    label="Password"
                    placeholder="Enter password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                />
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    style={btnStyle}
                    fullWidth
                    disabled={!canPress}
                    onClick={loginSubmit}
                >
                    Sign in
                </Button>
                <Typography>
                    {" "}
                    <Link href="#">Forgot password ?</Link>
                </Typography>
                <Typography>
                    {"Don't have an account? "}
                    <Link href="#" onClick={() => handleChange("event", 1)}>
                        Sign up
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    </>
)}

export default Login