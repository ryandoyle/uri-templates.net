import React from 'react';
import './App.css';
import {UriTemplater} from "./UriTemplater";
import Container from "@material-ui/core/Container";

function App() {
  return (
    <div className="App">
        <Container maxWidth={"md"}>
            <h3>URI Templates.net</h3>
            <UriTemplater />
        </Container>
    </div>
  );
}

export default App;
