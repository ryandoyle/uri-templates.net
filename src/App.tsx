import React from 'react';
import './App.css';
import {UriTemplater} from "./UriTemplater";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
const logo = require('./logo192.png');

function App() {
  return (
    <div className="App" >
        <Box mt={6}>
            <Container maxWidth={"md"}>
                <Grid container direction={"row"} justify={"center"} alignItems={"center"} spacing={2}>
                    <Grid item>
                        <img src={logo} alt={"What Controls Logo"}/>
                    </Grid>
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            URI TEMPLATES.NET
                        </Typography>
                    </Grid>
                </Grid>

                <UriTemplater />
            </Container>
        </Box>
        <Box position="fixed" p={1} style={{top: "auto", bottom: 0, width: '100%'}}>
            <Link
                href={"https://github.com/ryandoyle/uri-templates.net"}
                target="_blank"
                color={"textSecondary"}
                variant={"button"}
                tabIndex={-1}
            >
                About
            </Link>
        </Box>
    </div>
  );
}

export default App;
