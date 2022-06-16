// import {LoginPage} from "../features/users/Login";
import AuthContainer from "../features/users/AuthContainer"
import LogOut from "../features/users/Logout";
import {Home} from "../features/home/Home";
import Dashboard from "../features/dashboard/Dashboard";
import {RequireAuth} from "./RequireAuth";

// const AppRouter = () => {
const routes = (isLoggedIn) => [
    {
        path: '/',
        element: <Home/>,
        exact: true
    },
    {
        path: 'login',
        element: !isLoggedIn ? <AuthContainer/> : <Home changeURL={true} />,
        exact: true
    },
    {
        path: 'dashboard',
        // element: !isLoggedIn ? <LoginPage signupTitle="Create an account" loginTitle="Login"/> : <Dashboard changeURL={true} />,
        element: !isLoggedIn ? <AuthContainer/> : <Dashboard changeURL={true} />,

        exact: true
    }
    // ,{
    //     path: 'logout',
    //     element: isLoggedIn ? <LogOut/> : <LoginPage/>,
    //     exact: true
    // },
]

export default routes