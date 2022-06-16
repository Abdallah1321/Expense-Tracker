import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React, {useEffect, useState} from "react";
import ScheduledTransactionCard from "./ScheduledTransactionCard";
import {InputLabel, NativeSelect, useMediaQuery} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import Slider from "@mui/material/Slider"
import Box from "@mui/material/Box"
import MuiInput from "@mui/material/Input"
import {LoadingButton} from "@mui/lab";
import {Send} from "@mui/icons-material";
import {makeStyles, styled} from "@mui/styles";
import {grey, teal} from "@material-ui/core/colors";
import {
    addScheduledTransaction
} from "./scheduledTransactionSlice";
import {getAllScheduledTransactions, selectAllScheduledTransactions} from "./scheduledTransactionSlice";
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

const ScheduledTransactionsContainer = (props) => {
    const {token, walletId} = props
    const dispatch = useDispatch()
    const transactionsData = useSelector(state => selectAllScheduledTransactions(state))

    // console.log('ScheduledTransactionsContainer: ',transactionsData)

    const tablet = useMediaQuery(theme => theme.breakpoints.down("md"));
    const classes = useStyles(tablet)
    const [open, setOpen] = React.useState(false);
    const [Sname, setSName] = useState('')
    const [Sdate, setSDate] = useState('')
    const [Svalue, setSValue] = useState('')
    const [Stype, setSType] = useState('profit')
    const [SLoading, setSLoading] = useState(false)
    const [Srecurring, setSrecurring] = useState(false)
    const [Sslider, setSslider] = useState(1)
    const [RecurringEach, setRecurringEach] = useState('daily')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSliderChange = (e, value) => {
        setSslider(value)
    }

    const handleInputChange = (e) => {
        setSslider(e.target.value === '' ? '' : Number(e.target.value))
    }

    const handleEdgeCases = () => {
        if(Sslider < 0){
            setSslider(1)
        }
    }

    const Input = styled(MuiInput)`
      width: auto
    `

    useEffect(async() => {
        try {
            const fetchedRes = await dispatch(getAllScheduledTransactions({
                    token: token,
                    walletId: walletId
                })).unwrap()

            console.log('[ScheduledTransactionsContainer] fetchedRes: ', fetchedRes)
        }
        catch (e) {
            console.log('[ScheduledTransactionsContainer][error]: fetch trans data: ', e)
        }
    }, [props])

    const newScheduledTransaction = async(walletId) => {
        // if(
        //     Stype.length > 0 &&
        //     Sname.length > 0 &&
        //     Svalue.length > 0 &&
        //     Srecurring.length > 0 &&
        //     Sslider.length > 0 &&
        //     RecurringEach.length > 0
        // ) {

            const savedType = Stype
            const savedName = Sname
            const savedValue = parseInt(Svalue)
            const savedRecurring = Srecurring
            const savedFrequency = Sslider
            const savedRecurringEach = RecurringEach
            const savedDate = Sdate

            setSName('')
            setSDate('')
            setSValue('')
            setSType('')
            setSrecurring(false)
            setSslider(0)
            setRecurringEach('daily')

            setSLoading(true)

            try {
                const res = await dispatch(addScheduledTransaction({
                    token,
                    type: savedType,
                    description: savedName,
                    value: savedValue,
                    recurring: savedRecurring,
                    date: Math.floor(new Date(savedDate).getTime() /  1000),
                    recurringEach: savedRecurringEach,
                    frequency: savedFrequency,
                    walletID: walletId
                })).unwrap()

                if(res._id){
                    handleClose()
                }
                console.log('[scheduledTransactionsContainer]: newScheduledTransaction res:  ', res)

            } catch (e) {
                console.log('[scheduledTransactionsContainer]: newScheduledTransaction err:  ', e)
            } finally {
                setSLoading(false)
            }


            // try {
            //     const res = await dispatch(addTransaction({
            //         value,
            //         description: name,
            //         type,
            //         token,
            //         walletID: walletId
            //     })).unwrap()
            //     console.log('[TransactionContainer]: addTransaction res: ', res)
            //     if(res._id){
            //         setTLoading(false)
            //         handleClose()
            //     }
            //
            // } catch (e) {
            //     console.log('[TransactionContainer]: addTransaction error: ', e)
            // }
        // }
    }
    return(
        <Grid item>
            <Typography variant="h6" display="inline" style={{ marginRight: 240}}>
                Scheduled Transactions
            </Typography>

            <Tooltip title="Profit" arrow>
                <IconButton onClick={handleClickOpen}>
                    <AddIcon />
                </IconButton>
            </Tooltip>

            {/*<Dialog >*/}
            {/*    <DialogTitle>Add Profit</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText>*/}
            {/*            Title*/}
            {/*        </DialogContentText>*/}
            {/*        <TextField*/}
            {/*            autoFocus*/}
            {/*            margin="dense"*/}
            {/*            id="name"*/}
            {/*            type="string"*/}
            {/*            fullWidth*/}
            {/*            variant="standard"*/}
            {/*        />*/}
            {/*        <DialogContentText>*/}
            {/*            Amount*/}
            {/*        </DialogContentText>*/}
            {/*        <TextField*/}
            {/*            autoFocus*/}
            {/*            margin="dense"*/}
            {/*            id="name"*/}
            {/*            type="number"*/}
            {/*            fullWidth*/}
            {/*            variant="standard"*/}
            {/*        />*/}
            {/*    </DialogContent>*/}

            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleClose}>Cancel</Button>*/}
            {/*        <Button onClick={handleClose}>Add</Button>*/}
            {/*    </DialogActions>*/}

            {/*</Dialog>*/}

            <Paper elevation={20} style={{height: 400, width: 500, maxHeight: 400, maxWidth: 500, overflow: 'auto'}}>

                {
                    (transactionsData && transactionsData.length > 0) ? transactionsData.map((transaction) => (
                                <ScheduledTransactionCard
                                    name={transaction.description}
                                    value={transaction.value}
                                    type={transaction.type}
                                    recurring={transaction.Recurring}
                                    timestamp={transaction.NextTransactionDate}
                                    frequency={transaction.typeScheduledTransaction}
                                    length={transaction.transactionLength}
                                />
                        )):
                        <Typography variant="h5" align="center" sx={{
                            marginTop: '20px'
                        }}>
                            No transactions!
                        </Typography>
                }

                {/*<ScheduledTransactionCard*/}
                {/*    name="Profit"*/}
                {/*    timestamp={1640376846}*/}
                {/*    value="50"*/}
                {/*    type="expense"*/}
                {/*    recurring={true}*/}
                {/*    frequency='monthly'*/}
                {/*    length={5}*/}
                {/*/>*/}
                {/*<ScheduledTransactionCard*/}
                {/*    name="Profit"*/}
                {/*    timestamp={1640376846}*/}
                {/*    value="50"*/}
                {/*    type="profit"*/}
                {/*/>*/}
            </Paper>

            <Dialog
                open={open} onClose={handleClose}
            >
                <DialogContent className={classes.padding}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container direction="row" className={classes.mainHeader}>
                                <Grid item xs={12}>
                                    <Typography color="primary" variant="h5">
                                        Add Scheduled Transaction
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
                                        defaultValue={Stype}
                                        inputProps={{
                                            name: 'permission',
                                            id: 'permission',
                                        }}
                                        onClick={(e) => setSType(e.target.value)}
                                    >
                                        <option value='profit'>Profit</option>
                                        <option value='expense'>Expense</option>
                                    </NativeSelect>
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        // error={usernameError ? true : null}
                                        variant="outlined"
                                        label="Name"
                                        value={Sname}
                                        onChange={(e) => setSName(e.target.value)}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        // error={usernameError ? true : null}
                                        variant="outlined"
                                        label="Value"
                                        value={Svalue}
                                        onChange={(e) => setSValue(e.target.value)}
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*'
                                        }}
                                        // helperText={usernameError ? "Invalid Username" : null}
                                        // value={username}
                                    >
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Recurring?</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-label="recurring"
                                            name="row-radio-buttons-group"
                                            defaultValue="no"
                                            onChange={(e) => setSrecurring(((e.target.value) === "true"))}
                                        >
                                            <FormControlLabel
                                                value={true}
                                                control={<Radio />}
                                                label="Yes"
                                            />
                                            <FormControlLabel
                                                value={false}
                                                control={<Radio />}
                                                label="No"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label= {Srecurring ? "Start Date" : "Date"}
                                            value={Sdate}
                                            onChange={(newValue) => {
                                                setSDate(newValue)
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                {Srecurring ?
                                    <>
                                        <Grid item xs={23}>
                                            <InputLabel variant="standard" htmlFor="permission">
                                                Recurring Each
                                            </InputLabel>
                                            <NativeSelect
                                                defaultValue={RecurringEach}
                                                inputProps={{
                                                    name: 'type',
                                                    id: 'type',
                                                }}
                                                onChange={(e) => setRecurringEach(e.target.value)}
                                            >
                                                <option value='daily'>Daily</option>
                                                <option value='weekly'>Weekly</option>
                                                <option value='monthly'>Monthly</option>
                                            </NativeSelect>
                                        </Grid>

                                        <Grid item xs={12}>
                                            {/*<Slider*/}
                                            {/*    defaultValue={1}*/}
                                            {/*    valueLabelDisplay="auto"*/}
                                            {/*/>*/}
                                            <Box>
                                                <Typography gutterBottom>
                                                    Frequency (Every x days/weeks/months)
                                                </Typography>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs>
                                                        <Slider
                                                            value={typeof Sslider === 'number' ? Sslider : 0}
                                                            max={365}
                                                            onChange={handleSliderChange}
                                                        />

                                                    </Grid>
                                                    <Grid item>
                                                        <Input
                                                            value={Sslider}
                                                            onChange={handleInputChange}
                                                            onBlur={handleEdgeCases}
                                                            inputProps={{
                                                                min: 0,
                                                                max: 365,
                                                                type: 'number',
                                                                'aria-labelledby': 'freqslider'
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {/*<TextField*/}
                                            {/*    fullWidth*/}
                                            {/*    // error={usernameError ? true : null}*/}
                                            {/*    variant="outlined"*/}
                                            {/*    label="Frequency"*/}
                                            {/*    placeholder={1}*/}
                                            {/*    // value={Svalue}*/}
                                            {/*    // onChange={(e) => setSValue(e.target.value)}*/}
                                            {/*    inputProps={{*/}
                                            {/*        inputMode: 'numeric',*/}
                                            {/*        pattern: '[0-9]*'*/}
                                            {/*    }}*/}
                                            {/*    // helperText={usernameError ? "Invalid Username" : null}*/}
                                            {/*    // value={username}*/}
                                            {/*>*/}
                                            {/*</TextField>*/}
                                        </Grid>
                                    </>
                                    :
                                    <></>
                                }

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
                                        loading={SLoading}
                                        onClick={() => newScheduledTransaction(walletId)}
                                        // disabled={(name === tName) && (tType === sType) && (value === tValue) && (TDate.getTime() === date.getTime())}
                                        disabled={((Sname.length > 0) && (Svalue.length > 0) && (Stype.length > 0) && (Srecurring.length > 0) && (Sslider.length> 0) && (RecurringEach.length > 0))}
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

export default ScheduledTransactionsContainer