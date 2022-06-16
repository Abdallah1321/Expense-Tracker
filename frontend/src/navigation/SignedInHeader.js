import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {selectUserById, selectUserIds, userLogOut} from "../features/users/usersSlice";
import {getInits} from "../utils";
// import OverviewPage from './components/OverviewPage';
// const pages = ['Overview', 'Categories', 'Calender', 'Wallets'];
const pages = ['Overview'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];



const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const ids = useSelector(selectUserIds)
    const userData = useSelector(state => selectUserById(state, ids[0]))

    // console.log('uD: ',userData)

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [anchorWallet, setAnchorWallet] = React.useState(null)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleClickNavMenu = (event, index) => {
        if(index === 0) {
            navigate("/dashboard")
        }
    }

    const handleClickProfileCircle = (event, index) => {
        if (index === 3){
            dispatch(userLogOut())
        }
        setSelectedIndex(index)
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <div>

            <AppBar position="static" elevation="0" color="transparent">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            style={{color: 'blueviolet'}}
                            sx={{ mr: 60, display: { xs: 'none', md: 'flex' } }}
                        >
                            Miytra
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleClickProfileCircle}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page, index) => (
                                    <MenuItem key={page} onClick={(event) => handleClickNavMenu(event, index)}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            style={{color: 'blueviolet'}}
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            Miytra
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'} }}>
                            {pages.map((page, index) => (
                                <Button
                                    key={page}
                                    onClick={(event) => handleClickNavMenu(event, index)}                                    sx={{ my: 2, color: 'black', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar {...getInits(userData.name)}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                {/*// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];*/}



                                {settings.map((setting,index) => (
                                    <MenuItem key={setting} onClick={(event) => handleClickProfileCircle(event, index)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/*<Container>*/}
            {/*    <OverviewPage />*/}
            {/*</Container>*/}

        </div>

    );
};
export default Header;
