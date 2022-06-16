import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Login from "./newLogin";
import Signup from "./Register";

const AuthContainer = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const boxStyle = { width: 320, margin: "10px auto" };
    const labelStyle = { width: 165 };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
    return (
        <>
            <Box style={boxStyle}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="disabled tabs example"
                >
                    <Tab label="Sign In" style={labelStyle} />
                    <Tab label="Sign Up" style={labelStyle} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Login handleChange={handleChange} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Signup handleChange={handleChange} />
                </TabPanel>
            </Box>
        </>
    );
};

export default AuthContainer;