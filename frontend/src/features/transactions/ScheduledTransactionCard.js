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
import {makeStyles, styled} from "@mui/styles";
import {grey, teal} from "@material-ui/core/colors";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

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

const ScheduledTransactionCard = (props) => {
    const {name, value, timestamp, type, recurring, frequency, length} = props
    const tablet = useMediaQuery(theme => theme.breakpoints.down("md"));
    const classes = useStyles(tablet)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(timestamp)
    const humanDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    const freq = (frequency === 'monthly') ? 'months' : (frequency === 'weekly') ? 'weeks' : 'days'

    const recurringDate = (recurring && frequency && length) ? `Recurring every ${length} ${freq}` : null

    const rType = (type === 'expense') ? 1 : 0



    const [anchorEl, setAnchorEl] = useState(null);
    const [sDialog, setSDialog] = useState(false)
    const [sELoading, setSELoading] = useState(false)
    const [sName, setSName] = useState(name)
    const [sType, setSType] = useState(type)
    const [sValue, setSValue] = useState(value)
    const [sDate, setSDate] = useState(date)
    const [Sslider, setSslider] = useState(length ? parseInt(length) : 1)
    const [deleteTransactionDialog,setDeleteTransactionDialog] = useState(false)
    const [Srecurring, setSrecurring] = useState(!!recurring)
    const [Seach, setSeach] = useState(freq ? freq : false)
    const [Sfrequency, setSfrequency] = useState(0)
    // classes.mainContent.width = 0

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };



    const handleClose = () => {
        setAnchorEl(false);
    };

    const handleEditOpen = () => {
        setSDialog(true)
    }

    const handleEditClose = () => {
        handleClose()
        setSDialog(false)
    }

    const handleDeleteDialogOpen = () => {
        setDeleteTransactionDialog(true)
    }

    const handleSliderChange = (e, value) => {
        setSslider(value)
    }

    const handleInputChange = (e) => {
        setSslider(e.target.value === '' ? '' : Number(e.target.value))
    }

    const handleEdgeCases = () => {
        if(Sslider < 0){
            setSslider(1)
        } else if (Sslider > 365) {
            setSslider(365)
        }
    }

    const Input = styled(MuiInput)`
      width: auto
    `

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
                        subheader={(recurring) ? recurringDate : `Scheduled On: ${humanDate}`}
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

                    <Typography variant="h6" color={(type === 'expense') ? 'red' : 'green'} align="center" display="inline">
                        {
                            (type === 'expense') ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>
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
                open={sDialog} onClose={handleEditClose}
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
                                <Grid item xs={12}>
                                    <InputLabel variant="standard" htmlFor="permission">
                                        Type
                                    </InputLabel>
                                    <NativeSelect
                                        // defaultValue={sType}
                                        inputProps={{
                                            name: 'type',
                                            id: 'type',
                                        }}
                                        defaultValue={sType}
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
                                        value={sName}
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
                                        value={sValue}
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
                                {
                                    console.log('recurring: ', Srecurring)
                                }
                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Recurring?</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-label="recurring"
                                            name="row-radio-buttons-group"
                                            defaultValue={Srecurring}
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
                                            value={sDate}
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
                                                // defaultValue={tType}
                                                inputProps={{
                                                    name: 'type',
                                                    id: 'type',
                                                }}
                                                onClick={(e) => setSeach(e.target.value)}
                                            >
                                                <option value={0}>Daily</option>
                                                <option value={1}>Weekly</option>
                                                <option value={2}>Monthly</option>
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
                                                                step: 1,
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
                                        // loading={sELoading}
                                        // onClick={invite}
                                        // disabled={(name === sName) && (sType === rType) && (value === sValue) && (TDate.getTime() === date.getTime())}
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

                        <Button>
                            Yes
                        </Button>
                    </DialogActions>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default ScheduledTransactionCard