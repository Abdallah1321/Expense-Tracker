import React from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Link as RouterLink} from 'react-router-dom'
import Container from "@mui/material/Container";

const SignedOutHeader = () => {
    return(
        // <div>
        //     <Box sx={{ flexGrow: 1 }}>
        //         <AppBar position="static" elevation="0" color="transparent">
        //             <Toolbar>
        //                 <Typography
        //                     variant="h5"
        //                     component="div"
        //                     sx={{ flexGrow: 1 }}
        //                     style={{ color: "blueviolet" }}
        //                 >
        //                     Miytra
        //                 </Typography>
        //                 <Button
        //                     component={RouterLink}
        //                     to="/login"
        //                 >Login</Button>
        //             </Toolbar>
        //         </AppBar>
        //     </Box>
        // </div>
        <Container sx={{ flexGrow: 1 }} maxWidth="xl">
          <AppBar position="static" elevation="0" color="transparent">
            <Toolbar>
              <Typography
                variant="h5"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ color: "blueviolet" }}
              >
                Miytra
              </Typography>
              <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login">
                  Login
              </Button>
            </Toolbar>
          </AppBar>
        </Container>
    )
}

export default SignedOutHeader