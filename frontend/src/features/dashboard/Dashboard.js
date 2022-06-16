import {Fragment, useEffect, useState} from "react";
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from "react-redux";
import  { useNavigate } from 'react-router-dom'
import {
    Alert,
    Dialog,
    DialogContent,
    InputAdornment,
    InputLabel,
    NativeSelect,
    TextField,
    useMediaQuery,
    Button,
    Grid,
    Typography,
    Box
} from "@mui/material";
import {AccountCircle, Send} from "@mui/icons-material";
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded'
import {LoadingButton} from "@mui/lab";
import DashboardCard from '../dashboard/DashboardCard'
import TransactionContainer from '../transactions/TransactionContainer'
import ScheduledTransactionsContainer from '../transactions/ScheduledTransactionsContainer'
import {selectUserIds, selectAll, selectUserById, loggedStatus} from "../users/usersSlice";
import {selectWalletIds, fetchWallets, selectAllWallets, addWallet} from "./dashboardSlice"

const useStyles = makeStyles((theme, tablet) => ({
    card: {
        ...theme.typography.wallet,
        backgroundColor: '#4C4DE4',
        minWidth: 275,
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
        height: 55
    },
    welcomeMessage: {
        color: '#535353',
        fontSize: "2rem",
        fontFamily: "Gilroy",
        fontWeight: 600,
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
        width: tablet ? 0 :'500px'
    }
}));

const Expire = (props) => {
    const [visible, setVisible] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
        }, props.delay)
    }, [props.delay])

    return visible ? <>{props.children}</> : <></>
}

const Dashboard = () => {
    const navigate = useNavigate()
    const colors = ["#4C4DE4", "#FF5465", "#36D5E3", "#1F1E42"]
    let colorsC
    const dispatch = useDispatch()
    const ids = useSelector(selectUserIds)
    const wallets = useSelector(selectWalletIds)
    const userData = useSelector(state => selectUserById(state, ids[0]))
    const walletData = useSelector(state => selectAllWallets(state))
    const [Open, setOpen] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [errorAlertMessage, setErrorAlertMessage] = useState(null)
    const [WalletName, setWalletName] = useState('')
    const [Loading, setLoading] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState(null)
    // useEffect(() => {
    //     if(userData !== undefined && userData.token && ids !== []) {
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
    //             navigate("/")
    //         } else {
    //             dispatch(loggedStatus())
    //         }
    //     }
    //     else {
    //         console.log('holy shit')
    //         navigate("/")
    //     }
    // }, [])
    // const token = userData.token

    const tablet = useMediaQuery(theme => theme.breakpoints.down("md"));
    // console.log('tablet: ', tablet)
    const classes = useStyles(tablet)
    useEffect(async() => {
        if(userData !== undefined && userData.token && ids !== []) {
            await dispatch(fetchWallets(
                userData.token
            )).unwrap()
        }
        else {
            console.log('not logged in!')
        }
    }, [])

    const createWallet = async() => {
        console.log('createWallet called!')
        if(WalletName.length > 0){
            setLoading(true)
            setWalletName('')

            try {
                const res = await dispatch(addWallet(
                    {
                        token: userData.token,
                        name: WalletName
                    }
                )).unwrap()
                console.log('[Dashboard]: addWallet res: ', res)
                if(res._id){
                    setLoading(false)
                    setOpen(false)
                }
            } catch (e) {
                console.log('[Dashboard] addWallet caught: ', e)
            } finally {
                setLoading(false)
            }
        }

    }

    const alertSet = (message) => {
        if(message.length > 0){
            setErrorAlert(true)
            setErrorAlertMessage(message)
        }
    }

    const alertBox = () => {
        return(
            <Box display="flex" justifyContent="center" alignItems="center">
                <Alert
                    severity="error"
                    closeText="Close"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {errorAlertMessage}
                </Alert>
            </Box>
        )
    }


    // console.log('token:', token)
    return(
        // <Box sx={{ flexGrow: 1, padding: '20px' }}>
            <Fragment>
                {
                    errorAlert ? <Expire delay={5000}>{alertBox()}</Expire> : <></>
                }

                {/*<h1>Selected Wallet: {selectedWallet}</h1>*/}

                <Grid container>
                    <Grid
                        item
                        xs={tablet ? 12 : 6}
                        align="center"
                    >
                        <Typography className={classes.welcomeMessage}>
                            Hello, {userData ? userData.name : "undefined"}!
                        </Typography>
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="center" alignItems="center" sx={{
                     marginBottom: 3,
                     marginRight: tablet ? 0 : 6
                }}>
                    <Button
                        variant="contained"
                        sx={{borderRadius: 1.5}}
                        onClick={() => setOpen(!Open)}
                    >
                        Add Wallet
                    </Button>
                </Box>


                <Grid container spacing={tablet ? 1: 6} sx=
                    {{
                    // padding: '20px',
                    width: '100%',
                    padding: tablet ? '20px 0px 20px 0px' : undefined
                    }}>
                    {
                        console.log('walletData: ', walletData)
                    }
                    {walletData && walletData.map((wallet,i) => {
                        let callSet = false
                        // if(i === 0) {
                        //     callSet = true
                        // }
                        if (i%4 === 0){
                            colorsC = 0
                        } else {
                            colorsC++
                        }
                        const pos = (i%2 === 0) ? "right" : "left"
                        // const colorIndex = i - colorsC
                        return(
                            <DashboardCard
                                key={i}
                                selectWallet={setSelectedWallet}
                                call={callSet}
                                walletID={wallet._id}
                                walletName={wallet.name}
                                createdBy={wallet.createdBy}
                                walletBalance={wallet.balance}
                                align={pos}
                                backgroundColor={colors[colorsC]}
                                alertSet={alertSet}
                                walletAuthorName={(wallet.createdBy) ? (wallet.createdBy.name) ? wallet.createdBy.name : wallet.name : 'Default'}
                            />
                        )
                    })}
                </Grid>

                <Grid sx={{
                    marginTop: '100px'
                }}>
                    <Grid
                        container
                        spacing={7}
                        justifyContent="center"
                    >
                    {
                        walletData && walletData.map((wallet, i) => {
                            if(wallet._id === selectedWallet) {
                                console.log('wallet matched!')
                                return <>
                                    <TransactionContainer
                                        walletId={wallet._id}
                                        transactions={wallet.transactions}
                                        token={userData.token}
                                    />
                                    <ScheduledTransactionsContainer
                                        walletId={wallet._id}
                                        token={userData.token}
                                    />
                                </>
                            }
                        })
                    }
                    {/*{*/}
                    {/*    walletData && walletData.map((wallet, i) => (*/}
                    {/*        <TransactionContainer*/}
                    {/*            transactions={wallet.transactions}*/}
                    {/*        />*/}
                    {/*    ))*/}
                    {/*}*/}
                    {/*    {*/}
                    {/*        // selectedWallet ? <TransactionContainer*/}
                    {/*        //         transaction*/}
                    {/*        //     />*/}
                    {/*    }*/}
                    {/*    */}
                    {/*    // <ScheduledTransactionsContainer/>*/}
                    </Grid>
                </Grid>

                <Dialog
                    onClose={() => setOpen(!Open)}
                    open={Open}
                >
                    <DialogContent className={classes.padding}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container direction="row" className={classes.mainHeader}>
                                    <Grid item xs={12}>
                                        <Typography color="primary" variant="h5">
                                            Add Wallet
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
                                            id="walletName"
                                            onChange={(e) => setWalletName(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DriveFileRenameOutlineRoundedIcon/>
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
                                            endIcon={<Send />}
                                            disabled={!!!WalletName}
                                            onClick={createWallet}
                                            loading={Loading}
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
            </Fragment>


        // </Box>
    )
}

export default Dashboard