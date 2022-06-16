import React, {useState} from "react";
import {
    Avatar,
    Button,
    Grid,
    Paper,
    TextField,
    Link,
    Typography,
    FormControl
} from "@material-ui/core";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Expire, CustomAlert} from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {registerUser} from "./usersSlice";

const Register = ({ handleChange }) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [Error, setError] = useState(false)
    const [SuccessMessage, setSuccessMessage] = useState('')
    const [password, setPassword] = useState(null)
    const [name, setName] = useState(null)
    const [confirmPassword, setconfirmPassword] = useState(null)
    const [username, setUsername] = useState(null)
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const [emailValidateErr, setemailValidateErr] = useState(null)
    const canPress = [email, password, username, name, confirmPassword].every(Boolean) && addRequestStatus === 'idle' && confirmPassword === password && !!!emailValidateErr

    const emailValidate = () => {
        const validate = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
        return validate ? setemailValidateErr(null) : setemailValidateErr("Email is not valid")
    }


    const signupLogin = async (e) => {

        e.preventDefault()

        const emailX = email.replace(/\s/g, '')
        const passwordX = password.replace(/\s/g, '')
        const usernameX = username.replace(/\s/g, '')

        setEmail("")
        setPassword("")
        setName("")
        setconfirmPassword("")
        setUsername("")
        setemailValidateErr("")
        try {
            if (canPress) {
                setAddRequestStatus('pending')
                const res = await dispatch(registerUser({
                    email: emailX,
                    password: passwordX,
                    username: usernameX,
                    name
                })).unwrap()
                console.log('res: test....')
                console.log('res: ', res)
                if(res) {
                    console.log('res: ', addRequestStatus)
                    setSuccessMessage("Please click on the link sent to your email account to verify your email account and continue the registration process.")
                }
            }
        } catch (e) {
            setError(e)
            console.error('[SignUp]: Failed to sign up: ', e)
        } finally {
            setAddRequestStatus('idle')
        }
    }

        const paperStyle = {
            padding: "30px 10px",
            width: 300,
            margin: "20px auto",
            height: "100%",
        };
        const headerStyle = {margin: 0};
        const avatarStyle = {backgroundColor: "#5e60ce"};
        const btnStyle = {
            margin: "8px 0",
        };
    console.log('success 2: ', SuccessMessage)
    return (
        <>
            {((addRequestStatus === 'idle') && (SuccessMessage || Error)) ?
                <Expire delay={50000}>
                    {
                        Error ? <CustomAlert severity="error" message={Error}/> : SuccessMessage ? <CustomAlert severity="success" message={SuccessMessage}/> : <></>
                    }
                    {/*<CustomAlert message={Error}/>*/}
                </Expire> : <></>
            }
            <Grid>
                <Paper elevation={20} style={paperStyle}>
                    <Grid align="center">
                        <Avatar style={avatarStyle}>
                            <AddCircleOutlineIcon/>
                        </Avatar>
                        <h2 style={headerStyle}>Sign Up</h2>
                        <Typography variant="caption">
                            Please fill in this form to register your account!
                        </Typography>
                    </Grid>
                    <FormControl
                        fullWidth
                        margin="dense">
                        <TextField
                            fullWidth
                            label="Name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            placeholder="Enter your email"
                            type={"email"}
                            error={!!emailValidateErr}
                            onBlur={emailValidate}
                            helperText={emailValidateErr}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            placeholder="Enter your password"
                            type={"password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            error={(confirmPassword && password) && (((password !== confirmPassword) || (password.length < 8)))}
                            label="Confirm Password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            type={"password"}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                            helperText={(password !== confirmPassword && confirmPassword && password) ? "Passwords don't match. Try again!" : (password && password === confirmPassword && password.length < 8) ? "Your password should be at least 8 characters" : null}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={btnStyle}
                            fullwidth
                            disabled={!canPress}
                            onClick={signupLogin}
                        >
                            Sign up
                        </Button>
                    </FormControl>
                    <Typography>
                        {"Already have an account? "}
                        <Link href="#" onClick={() => handleChange("event", 0)}>
                            Log in
                        </Link>
                    </Typography>
                </Paper>
            </Grid>
        </>
    );
}
export default Register;