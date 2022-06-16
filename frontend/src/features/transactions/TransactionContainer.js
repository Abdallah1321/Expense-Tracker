import React, {useState, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TransactionCard from "./TransactionCard";
import {InputLabel, NativeSelect, useMediaQuery} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import {LoadingButton} from "@mui/lab";
import {Send} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import {grey, teal} from "@material-ui/core/colors";
import {useDispatch, useSelector} from "react-redux";
import {getTransactionById, selectAllTransactions, addMultipleTransactions, removeAllTransactions, deleteTransactionById, addTransaction} from "./transactionSlice";
// import Transactions from './Transactions';

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

export default function TransactionContainer({walletId, transactions, token}) {
    console.log('transaction container props: ', transactions)
    const dispatch = useDispatch()
    // const ids = useSelector(selectTransactionIds)
    const transactionsData = useSelector(state => selectAllTransactions(state))


    const tablet = useMediaQuery(theme => theme.breakpoints.down("md"));
    const classes = useStyles(tablet)
    const [Topen, TsetOpen] = React.useState(false);
    const [Tname, setTName] = useState('')
    const [Tdate, setTDate] = useState('')
    const [Tvalue, setTValue] = useState('')
    const [Ttype, setTType] = useState('p')
    const [Tloading, setTLoading] = useState(false)

    const handleClickOpen = () => {
        TsetOpen(true);
    };

    const handleClose = () => {
        TsetOpen(false);
    };

    useEffect(async() => {
        try {
            const results = []
            const fetchedRes = await Promise.all(transactions.map(transaction =>
                dispatch(getTransactionById({token: token, transactionId: transaction})).unwrap()
            ))
            fetchedRes.map((data) => {
                results.push(data)
                console.log('[TransactionContainer]: fetch tras data: ', data)
            })
            if(results.length > 0) {
                await dispatch(addMultipleTransactions(results))
            } else {
                await dispatch(removeAllTransactions())
            }
            // await dispatch(addMultipleTransactions(results))
            console.log('[TransactionContainer]: results: ', results)
        }
        catch (e) {
            console.log('[TransactionContainer][error]: fetch trans data: ', e)
        }
    }, [transactions])

    const transactionAdd = async() => {
        // console.log('transaction add: ', Tname.length, Tdate.length, Tvalue.length, Ttype.length)
        if(Tname.length > 0 && Tvalue.length > 0 && Ttype.length > 0) {
            console.log('transaction type: ', Ttype)

            // console.log('transaction added: ', name, date, value, type)
            const name = Tname
            const value = Tvalue
            const type = Ttype
            setTName('')
            setTValue('')
            setTType('')
            setTLoading(true)
            try {
                const res = await dispatch(addTransaction({
                    value,
                    description: name,
                    type,
                    token,
                    walletID: walletId
                })).unwrap()
                console.log('[TransactionContainer]: addTransaction res: ', res)
                if(res._id){
                    setTLoading(false)
                    handleClose()
                }

            } catch (e) {
                console.log('[TransactionContainer]: addTransaction error: ', e)
            }
        }
    }

    return (
            <Grid item>
                <Typography variant="h6" display="inline" style={{ marginRight: 305}}>
                    My Transactions
                </Typography>

                <Tooltip title="Profit" arrow>
                    <IconButton onClick={handleClickOpen}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>

                <Paper elevation={20} style={{height: 400, width: 500, maxHeight: 400, maxWidth: 500, overflow: 'auto'}}>
                    {
                        (transactionsData && transactionsData.length > 0) ? transactionsData.map((transaction) => (
                            <TransactionCard
                                key={transaction._id}
                                id={transaction._id}
                                name={transaction.description}
                                timestamp={transaction.TransactionDate}
                                token={token}
                                value={transaction.value}
                                type={transaction.type}
                            />
                        )) : <>
                            <Typography variant="h5" align="center" sx={{
                                marginTop: '20px'
                            }}>
                                No transactions!
                            </Typography>
                        </>
                    }
                    {/*<TransactionCard*/}
                    {/*    name="Profit"*/}
                    {/*    timestamp={1640376846}*/}
                    {/*    value="50"*/}
                    {/*    type="e"*/}
                    {/*/>*/}
                    {/*<TransactionCard*/}
                    {/*    name="ABC"*/}
                    {/*    timestamp={1640376846}*/}
                    {/*    value="50"*/}
                    {/*    type="p"*/}
                    {/*/>*/}
                </Paper>

                <Dialog
                    open={Topen}
                    onClose={handleClose}
                >
                    <DialogContent className={classes.padding}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container direction="row" className={classes.mainHeader}>
                                    <Grid item xs={12}>
                                        <Typography color="primary" variant="h5">
                                            Add Transaction
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
                                            Type
                                        </InputLabel>

                                        <NativeSelect
                                            // defaultValue={tType}
                                            inputProps={{
                                                name: 'type',
                                                id: 'type',
                                            }}
                                            defaultValue={(Ttype) ? Ttype : 'p'}
                                            onChange={(e) => setTType(e.target.value)}
                                        >
                                            <option value='p'>Profit</option>
                                            <option value='e'>Expense</option>
                                        </NativeSelect>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            // error={usernameError ? true : null}
                                            variant="outlined"
                                            label="Description"
                                            value={Tname}
                                            onChange={(e) => setTName(e.target.value)}
                                        >
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            // error={usernameError ? true : null}
                                            variant="outlined"
                                            label="Value"
                                            value={Tvalue}
                                            type="number"
                                            onChange={(e) => setTValue(e.target.value)}
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
                                    {/*            value={Tdate}*/}
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
                                            loading={Tloading}
                                            onClick={transactionAdd}
                                            disabled={!((Ttype.length > 0) && (Tvalue) && (Tname))}
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

            </Grid>
    )
}