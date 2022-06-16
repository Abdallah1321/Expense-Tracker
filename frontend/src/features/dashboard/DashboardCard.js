import {useState} from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux'
import {
    Box, Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    InputAdornment,
    InputLabel, Menu, MenuItem, NativeSelect,
    TextField,
    useMediaQuery,
    CardActionArea
} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListItemText from '@mui/material/ListItemText';
import {AccountCircle, Send} from "@mui/icons-material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { teal, grey } from "@material-ui/core/colors";
import {LoadingButton} from "@mui/lab";
import {useSelector} from "react-redux";
import {selectUserById, selectUserIds} from "../users/usersSlice";
import jwt from "jsonwebtoken";
import Avatar from "@mui/material/Avatar";
import {getInits, ConfirmDelete} from "../../utils";
import * as React from "react";
import {Close} from "@mui/icons-material/Delete";
import {DialogContentText} from "@material-ui/core";
import {editWallet, deleteWallet} from "./dashboardSlice";
const useStyles = makeStyles((theme, tablet) => ({
    root: {
        flexGrow: 1
    },
    padding: {
        padding: 0
    },
    mainHeader: {
      padding: 20,
      alignItems: "center"
    },
    mainContent: {
        padding: '0px 20px 20px 20px',
        width: tablet ? 0 : '500px'
    },
    primaryColor: {
      color: teal[500]
    },
    secondaryColor: {
      color: grey[700]
    },
    secondaryContainer: {
        padding: '20px 25px'
    },
    card: {
        ...theme.typography.wallet,
        // backgroundColor: '#4C4DE4',
        minWidth: 400,
        height: 300,
        color: 'white',
        border: 0,
        borderRadius: 15,
        maxWidth: 512
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: 600,
        fontFamily: "Gilroy",
        // padding: '10px 0 0 20px'
        padding: '15px 0 0 25px'

    },
    balanceValue: {
        fontWeight: 200,
        fontFamily: "Gilroy",
        fontSize: "2rem"
    },
    balance: {
        fontWeight: 600,
        fontFamily: "Gilroy",
        fontSize: "1rem"
    },
    pfp: {
        borderRadius: 18,
        width: 55,
        height: 55,
        margin: '0 0 15px 0'
    },
    shareButton: {
        color: 'white'
    }
}));

const DashboardCard = ({walletID, walletName, walletBalance, createdBy, align, backgroundColor, alertSet, walletAuthorName, selectWallet,call}) => {
    const ids = useSelector(selectUserIds)
    const userData = useSelector(state => selectUserById(state, ids[0]))
    const desktop = useMediaQuery(theme => theme.breakpoints.up("lg"));
    const tablet = useMediaQuery(theme => theme.breakpoints.down("md"));
    // const mobile = useMediaQuery(theme => theme.breakpoints.up("xs"));
    const dispatch = useDispatch()
    // console.log('mediaQueries: ', desktop, tablet, mobile)
    const [open, setOpen] = useState(false);
    const [usernameMLoading, setusernameMLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState(false)
    const [permission, setPermission] = useState(666)
    const [anchorWallet, setAnchorWallet] = useState(null)
    const [deleteWalletCD, setDeleteWalletCD] = useState(false)
    const [walletEdit, setWalletEdit] = useState(false)
    const [updateWName, setUpdateWName] = useState(walletName)
    const [WNameStatus, setWNameStatus] = useState(false)
    const wmOpen = Boolean(anchorWallet);
    // console.log('wallet id: ', walletID)
    if(call === true) {
        console.log('call: ', call)
        selectWallet(walletID)
    }

    const handleWMClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
        console.log('menu clicked!')
        setAnchorWallet(e.currentTarget)
    }

    const handleWMClose = (e) => {
        e.stopPropagation()
        e.preventDefault()
        console.log('menu clicked!')
        setAnchorWallet(null)
    }

    const alertSend = () => {
        console.log("Hello form child")
    }

    const handleClick = async() => {
        setusernameMLoading(true)
        alert(walletID)
        // const request = axios({
        //     method: 'put',
        //     url: 'http://localhost:3000/wallet/invite',
        //     data: {
        //         username: username,
        //         walletID: walletID,
        //         permission: ""
        //     }
        // })
    }


    const handleClose = () => {
        setOpen(false)
    }

    const handleEditFormClose = () => {
        setWalletEdit(false)
    }

    const handleEditFormOpen = () => {
        setWalletEdit(true)
    }

    const checkOwner = (jwtToken, walletAuthor) => {

        const userID = jwt.decode(jwtToken, {complete: true}).payload.user._id
        // console.log('walletAuthor: ', walletAuthor)
        // console.log('jwt userID: ', userID)
        console.log('walletAuth: ', walletAuthor)
        if (walletAuthor._id) {
            return userID === walletAuthor._id;
        }
        return userID === walletAuthor
    }

    const handleOpen = () => {
        setOpen(true)
        setAnchorWallet(null)
    }

    const handleConfirmDialog = () => {
        setDeleteWalletCD(true)
        console.log('wallet state: ', deleteWalletCD)
    }

    const updateWallet = async() => {
        // const [updateWName, setUpdateWName] = useState(walletName)
        if(updateWName !== walletName && updateWName.length > 0) {
            setWNameStatus(true)
            const wName = updateWName
            setUpdateWName('')
            try {
                const res = await dispatch(editWallet(
                    {
                        token: userData.token,
                        name: wName,
                        walletID
                    }
                )).unwrap()
                console.log('[DashboardCard]: updateWallet res: ', res, wName)
                if(res._id && res.name === wName){
                    setWNameStatus(false)
                    setAnchorWallet(false)
                    setWalletEdit(false)
                }
            } catch (e) {
                console.log('[DashboardCard]: updateWallet caught: ', e)
                alertSet(`[${e.response.statusText}]: ${e.response.data.error.message}`)
            } finally {
                setWNameStatus(false)
            }
        }}

        const walletDelete = async(walletID) => {
            // const [updateWName, setUpdateWName] = useState(walletName)

            if(walletID && walletID.length > 0) {
                // setWNameStatus(true)
                // setUpdateWName(null)
                try {

                    setDeleteWalletCD(false)
                    setAnchorWallet(false)
                    const res = await dispatch(deleteWallet(
                        {
                            token: userData.token,
                            walletID
                        })).unwrap()
                    console.log('[DashboardCard]: deleteWallet res: ', res)
                } catch (e) {
                    console.log('[DashboardCard]: deleteWallet caught: ', e)
                    alertSet(`[${e.response.statusText}]: ${e.response.data.error.message}`)
                }
            }
        }

    const invite = async() => {
        if(username.length > 0) {
            setusernameMLoading(true)
            setUsername('')

            if(permission)

            try {
                const req = await axios({
                    method: 'put',
                    url: 'http://localhost:3000/wallet/invite',
                    headers: {
                      'Authorization': 'Bearer ' + userData.token
                    },
                    data: {
                        username: username,
                        walletID: walletID,
                        permission: permission
                    }
                })
                console.log('response: ', req)
                if(req.status === 200){
                    console.log('Invite Sent!')
                    setusernameMLoading(false)
                }

            } catch (e) {
                console.log('error: ', e.response.data.error.message)
                setusernameMLoading(false)
                alertSet(`[${e.response.statusText}]: ${e.response.data.error.message}`)
                setOpen(false)
            }

            // setTimeout(() => {
            //     setusernameMLoading(false)
            //     setOpen(false)
            // }, 2000)
        } else {
            setUsernameError(true)
        }
    }


    const classes = useStyles(tablet)
    return (
        <>
        <Grid item xs={12} md={6} xl={6} align={tablet ? "center" : align}>

            <Card
                className={classes.card}
                align="left"
                sx={{backgroundColor: backgroundColor}}
            >
                <CardActionArea
                    onClick={() => selectWallet(walletID)}
                >
                    <Grid container spacing={19} >

                        <Grid item xs={12}>
                            <ListItem disablePadding>
                                <ListItemText>
                                    <Typography className={classes.title}>
                                        {walletName}
                                    </Typography>
                                </ListItemText>



                                {checkOwner(userData.token, createdBy) ? <>
                                    {/*<ListItemIcon align="right">*/}
                                    {/*    <ShareIcon className={classes.shareButton} onClick={handleOpen}/>*/}
                                    {/*</ListItemIcon>*/}
                                    <>
                                        <IconButton
                                            aria-label="more"
                                            id="wm-button"
                                            aria-controls="long-menu"
                                            aria-expanded={wmOpen ? 'true' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleWMClick}
                                            sx={{
                                                margin: '0 5px 0 0'
                                            }}
                                        >
                                            <MoreVertIcon sx={{
                                                color: 'white'
                                            }}/>
                                        </IconButton>
                                        <Menu
                                            id="basicMenu"
                                            anchorEl={anchorWallet}
                                            open={wmOpen}
                                            onClose={handleWMClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={handleOpen}>Share</MenuItem>
                                            <MenuItem onClick={handleEditFormOpen}>Edit</MenuItem>
                                            <MenuItem onClick={handleConfirmDialog}>Delete</MenuItem>
                                        </Menu>
                                    </>
                                </> : <></>
                                }

                            </ListItem>

                            {/*<Grid container direction="row" alignCenter="center">*/}
                            {/*    <Grid item xl={6}>*/}
                            {/*        <Typography className={classes.title}>*/}
                            {/*            {walletName}*/}
                            {/*        </Typography>*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xl={6}>*/}
                            {/*        <ShareIcon/>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container alignItems='center' sx={{ maxWidth: '100%'}}>
                                <Grid item xs={6} sx={{
                                    padding: '0 0 10px 0'}
                                }>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography className={classes.balanceValue} sx={{pl: 3 }}>
                                                {
                                                    `${parseFloat(walletBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}E$`
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{mt: -1}}>
                                            <Typography className={classes.balance} sx={{pl: 3 }}>
                                                Balance
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} align="right" sx={{pr: 3}}>
                                    <Avatar className={classes.pfp} sx={{margin: '0 0 15px 0'}} {...getInits(walletAuthorName, 'pfp')}/>
                                    {/*<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" className={classes.pfp}/>*/}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Dialog
            onClose={handleClose}
            open={open}
        >
            <DialogContent className={classes.padding}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container direction="row" className={classes.mainHeader}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="h5">
                                    Invite User
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            className={classes.mainContent}
                            spacing={2}
                        >
                            <Grid item xs={12}>
                                <InputLabel variant="standard" htmlFor="permission">
                                    Permission
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={666}
                                    inputProps={{
                                        name: 'permission',
                                        id: 'permission',
                                    }}
                                    onClick={(e) => setPermission(e.target.value)}
                                >
                                    <option value={666}>Read & Write (r/w)</option>
                                    <option value={333}>Read only (r)</option>
                                </NativeSelect>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    error={usernameError ? true : null}
                                    variant="outlined"
                                    label="Username"
                                    id="additional-info"
                                    helperText={usernameError ? "Invalid Username" : null}
                                    value={username}
                                    onChange={
                                        (e) => {
                                            setUsernameError(false)
                                            setUsername(e.target.value)
                                        }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle/>
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            className={classes.mainContent}
                            spacing={1}
                        >
                            <Grid item xl={12} textAlign="center">
                                <LoadingButton
                                    align="right"
                                    variant="contained"
                                    loading={usernameMLoading}
                                    onClick={invite}
                                    endIcon={<Send />}
                                    sx={{
                                        borderRadius: "5em"
                                    }}>
                                    Submit
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>

        {/*<ConfirmDelete*/}
        {/*    open={deleteWalletCD}*/}
        {/*    setOpen={setDeleteWalletCD}*/}
        {/*    setParentOpen={setAnchorWallet}*/}
        {/*    onConfirm={() => deleteWallet(walletID)}*/}
        {/*/>*/}

        {/*ConfirmDelete*/}
        <Dialog
            open={deleteWalletCD}
            onClose={() => {
                setDeleteWalletCD(false)
                setAnchorWallet(false)
            }}
        >
            <DialogContent className={classes.padding}>
                <Grid container>
                    <Grid item={12}>
                        <Grid container direction="row" className={classes.mainHeader}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="h5">
                                    Delete Wallet?
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    Are you sure you want to delete this wallet?
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <DialogActions>
                    <Button autoFocus onClick={() => setDeleteWalletCD(false)}>
                        Cancel
                    </Button>

                    <Button autoFocus onClick={() => walletDelete(walletID)}>
                        Yes
                    </Button>
                </DialogActions>

            </DialogContent>

        </Dialog>

        <Dialog
            onClose={handleEditFormOpen}
            open={walletEdit}
        >
            <DialogContent className={classes.padding}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container direction="row" className={classes.mainHeader}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="h5">
                                    Edit Wallet
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            className={classes.mainContent}
                            spacing={2}
                        >
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Wallet Name"
                                    id="additional-info"
                                    value={updateWName}
                                    onChange={
                                        (e) => {
                                            setUpdateWName(e.target.value)
                                        }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountBalanceWalletIcon/>
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            className={classes.mainContent}
                            spacing={1}
                        >
                            <Grid item xl={12} textAlign="center">
                                <LoadingButton
                                    align="right"
                                    variant="contained"
                                    loading={WNameStatus}
                                    onClick={updateWallet}
                                    endIcon={<Send />}
                                    disabled={(updateWName === walletName)}
                                    sx={{
                                        borderRadius: "5em"
                                    }}>
                                    Submit
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>

        </>
    )
}

export default DashboardCard