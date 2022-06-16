import React, {useEffect, useState} from "react";
import {
    Alert, Box, Dialog,
    DialogTitle, DialogContent, DialogActions,
    Button, IconButton
} from "@mui/material";
import { makeStyles } from '@mui/styles';

import {Close} from '@mui/icons-material/Delete'
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
    mainHeader: {
        padding: 20,
        alignItems: "center"
    },
    padding: {
        padding: 0
    }
}))



const Expire = (props) => {
    const [visible, setVisible] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
        }, props.delay)
    }, [props.delay])

    return visible ? <>{props.children}</> : <></>
}

const CustomAlert = (props) => {
    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Alert
                        severity={props.severity}
                        closeText="Close"
                        sx={{
                            textAlign: "center",
                            margin: '18px 0 3px 0',
                            paddingTop: '5px',
                            backgroundColor: 'rgb(253, 237, 237) !important'
                        }}
                    >
                        {props.message}
                    </Alert>
                </Box>
            </Box>
        </>
    )
}

const ConfirmDialog = (props) => {
    console.log('confirmDialog: ', props)
    const {title, children, open, setOpen, onConfirm} = props
    return(
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{title}</DialogTitle>
                <Box position="absolute" top={0} right={0}>
                    <IconButton>
                        <Close />
                    </IconButton>
                </Box>
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const ConfirmDelete = (props) => {
    console.log('confirmDelete: ', props)
    const classes = useStyles()
    const {open, setOpen, setParentOpen, onConfirm} = props
    return(
        <Dialog
            open={open}
            onClose={() => {
                setOpen(false)
                setParentOpen(false)
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
                    <Button autoFocus onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    <Button autoFocus onClick={() => {
                        console.log('deleted!!')
                        setOpen(false)
                        setParentOpen(false)
                        onConfirm()
                    }}>
                        Yes
                    </Button>
                </DialogActions>

            </DialogContent>

        </Dialog>
    )
}


const stringToColor = (string) => {
    let hash = 0
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }

    return color
}

const getInits = (name, source=null) => {
    let inits
    console.log('name: ', name.length)
    if (name.length >= 1) {
        const splitedName = name.split(" ")
        if (splitedName.length > 1) {
            inits = splitedName[0][0]
            inits += splitedName[1][0]
        } else {
            inits = splitedName[0][0]
        }
    }

    return {
        sx: {
            bgcolor: (!source) ? stringToColor(name) : '#fff',
            color: (source) ? '#000' : ''
        },
        children: `${inits}`
    }
}

export {
    Expire,
    CustomAlert,
    getInits,
    ConfirmDialog,
    ConfirmDelete
}