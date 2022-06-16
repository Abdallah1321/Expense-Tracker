import {useState} from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    InputAdornment,
    InputLabel,
    NativeSelect,
    TextField, useMediaQuery
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {AccountCircle, Send} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import {makeStyles} from "@mui/styles";
import {grey, teal} from "@material-ui/core/colors";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import * as React from "react";
import {deleteTransactionById, updateTransactionById} from "./transactionSlice";
import {useDispatch, useSelector} from "react-redux";

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

const TransactionCard = (props) => {
    const dispatch = useDispatch()
    const tablet = useMediaQuery(theme => theme.breakpoints.down("md"));

    const classes = useStyles(tablet)

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const {id, name, timestamp, value, type, token} = props
    // const date = new Date(parseInt(timestamp)*1000)
    const date = new Date(timestamp)
    const humanDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    const sType = (type === 'e') ? 1 : 0
    const [anchorEl, setAnchorEl] = useState(null);
    const [tDialog, setTDialog] = useState(false)
    const [tELoading, setTELoading] = useState(false)
    const [tName, setTName] = useState(name)
    const [tType, setTType] = useState(type)
    const [tValue, setTValue] = useState(value)
    const [TDate, setTDate] = useState(date)
    const [deleteTransactionDialog,setDeleteTransactionDialog] = useState(false)

    // classes.mainContent.width = 0

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(false);
    };

    const handleEditOpen = () => {
        setTDialog(true)
    }

    const handleEditClose = () => {
        setTDialog(false)
        handleClose()
    }

    const handleDeleteDialogOpen = () => {
        setDeleteTransactionDialog(true)
    }

    const deleteTransaction = async(transactionId, type) => {
        if(transactionId && transactionId.length > 0){
            try{
                const res = await dispatch(deleteTransactionById({
                    transactionId,
                    token,
                    type
                })).unwrap()
                console.log('[TransactionCard]: deleteTransaction res: ', res)
            } catch (e) {
                console.log('[DashboardCard]: deleteTransaction caught: ', e)
            }
        }
    }

    const transactionUpdate = async(transactionId) => {
        // const [tELoading, setTELoading] = useState(false)
        // const [tName, setTName] = useState(name)
        // const [tType, setTType] = useState(type)
        // const [tValue, setTValue] = useState(value)
        if(tType && tValue && tName){
            const name = tName
            const value = tValue
            setTELoading(true)
            setTName('')
            setTValue('')
            try {
                const res = await dispatch(updateTransactionById({
                    value,
                    description: name,
                    token,
                    type,
                    transactionId
                })).unwrap()
                console.log('[TransactionContainer]: transactionUpdate res: ', res)
                if(res._id){
                    handleEditClose()
                    handleClose()
                }
            } catch (e) {
                console.log('[TransactionContainer]: transactionUpdate error: ', e)
            } finally {
                setTELoading(false)
            }
        }
    }

    return(
    <>
        <div align="center">
            <Card sx={{maxWidth: 450, maxHeight: 100, marginTop: '20px'}}>
                <CardHeader
                    align="left"
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="Transaction">
                            E£
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="menu">
                            <MoreVertIcon onClick={handleClick}/>
                        </IconButton>
                    }
                    title={name}
                    subheader={humanDate}
                />

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                >
                    <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
                    <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
                </Menu>

                <Typography variant="h6" color={(type === 'e') ? 'red' : 'green'} align="center" display="inline">
                    {
                        (type === 'e') ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>
                    }
                    {value} E£
                </Typography>

                {/*<Typography variant="h6" color="red" align="center" display="inline">*/}
                {/*    <ArrowUpwardIcon/>*/}
                {/*    {value}E£*/}
                {/*</Typography>*/}
            </Card>
        </div>

        <Dialog
            onClose={handleEditClose}
            open={tDialog}
        >
            <DialogContent className={classes.padding}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container direction="row" className={classes.mainHeader}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="h5">
                                    Edit Transaction?
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            className={classes.mainContent}
                            spacing={2}
                        >
                            {/*<Grid item xs={12}>*/}
                            {/*    <InputLabel variant="standard" htmlFor="permission">*/}
                            {/*        Type*/}
                            {/*    </InputLabel>*/}
                            {/*    <NativeSelect*/}
                            {/*        defaultValue={tType}*/}
                            {/*        inputProps={{*/}
                            {/*            name: 'permission',*/}
                            {/*            id: 'permission',*/}
                            {/*        }}*/}
                            {/*        onChange={(e) => setTType(e.target.value)}*/}
                            {/*    >*/}
                            {/*        <option value='p'>Profit</option>*/}
                            {/*        <option value='e'>Expense</option>*/}
                            {/*    </NativeSelect>*/}
                            {/*</Grid>*/}
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    // error={usernameError ? true : null}
                                    variant="outlined"
                                    label="Name"
                                    value={tName}
                                    onChange={(e) => setTName(e.target.value)}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    // error={usernameError ? true : null}
                                    variant="outlined"
                                    label="Value"
                                    value={tValue}
                                    onChange={(e) => setTValue(parseInt(e.target.value))}
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                        min: '0'
                                    }}
                                    // helperText={usernameError ? "Invalid Username" : null}
                                    // value={username}
                                >
                                </TextField>
                            </Grid>
                            {/*<Grid item xs={12}>*/}
                            {/*    <LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                            {/*        <DatePicker*/}
                            {/*            label="Date"*/}
                            {/*            value={TDate}*/}
                            {/*            onChange={(newValue) => {*/}
                            {/*                setTDate(newValue)*/}
                            {/*            }}*/}
                            {/*            renderInput={(params) => <TextField fullWidth {...params} />}*/}
                            {/*        />*/}
                            {/*    </LocalizationProvider>*/}
                            {/*</Grid>*/}
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
                                    loading={tELoading}
                                    onClick={() => transactionUpdate(id)}
                                    disabled={(name === tName) && (value === tValue)}
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

        <Dialog
            open={deleteTransactionDialog}
            onClose={() => {
                handleClose()
                setDeleteTransactionDialog(false)
            }}
        >
            <DialogContent
                className={classes.padding}
            >
                <Grid container>
                    <Grid item={12}>
                        <Grid container direction="row" className={classes.mainHeader}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="h5">
                                    Delete Transaction?
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    Are you sure you want to delete this transaction?
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <DialogActions>
                    <Button autoFocus onClick={() => {
                        setDeleteTransactionDialog(false)
                        handleClose()
                    }}>
                        Cancel
                    </Button>

                    <Button autoFocus onClick={() => deleteTransaction(id, type)}>
                        Yes
                    </Button>
                </DialogActions>

            </DialogContent>
        </Dialog>
    </>
    )
}

export default TransactionCard