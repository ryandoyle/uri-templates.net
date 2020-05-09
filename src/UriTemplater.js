import React from "react";
import TextField from "@material-ui/core/TextField";
import './UriTemplater.css'
import {CompositeDecorator, Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import uriTemplates from 'uri-templates';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

export class UriTemplater extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            uriTemplate: '',
            editorState: EditorState.createEmpty(),
            isStrict: true
        }
        this.onChange = editorState => this.setState({editorState})
    }

    render() {
        return (
                <Grid container direction={"column"} justify={"center"} alignItems={"stretch"} spacing={2}>
                    <Grid item>
                        <Box display={"flex"} flexDirection={"row"} >
                            <Box flexGrow={1} >
                                <TextField
                                    onChange={this.handleTemplateChange}
                                    className={"TemplateInput"}
                                    variant={"outlined"}
                                    size={"small"}
                                    fullWidth={true}
                                    placeholder={"/my/{uri}/?{template}"}
                                />
                            </Box>
                            <Box marginLeft={3}>
                                <FormControlLabel
                                    control={<Checkbox checked={this.state.isStrict} onChange={this.handleStrictChange}/>}
                                    label={"Strict"}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid >
                        <Box p={1}><Divider /></Box>
                    </Grid>
                    <Grid item>
                        <Box border={1} borderColor={"grey.500"} p={1}>
                        <Editor
                            className={"UriTemplater-editor"}
                            placeholder={"Enter test URLs per line..."}
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                        </Box>
                    </Grid>
                </Grid>
        )
    }

    handleTemplateChange = (event) => {
        this.setState({uriTemplate: event.target.value}, this.refreshEditorDecorator);
    };

    handleStrictChange = (event) => {
        this.setState({isStrict: event.target.checked}, this.refreshEditorDecorator)
    }

    refreshEditorDecorator() {
        // Please forgive me, I have no idea how to react. We need to use the state in the matchesTemplateStrategy
        // which comes from the state we set on the uriTemplate
        this.setState({
            editorState: EditorState.set(this.state.editorState, {
                decorator: new CompositeDecorator([
                    {
                        strategy: this.matchesTemplateStrategy,
                        component: MatchesTemplateComponent
                    }
                ])
            })
        });
    }

    matchesTemplateStrategy = (contentBlock, callback, contentState) => {
        let template = uriTemplates(this.state.uriTemplate);
        let text = contentBlock.getText().trimEnd();

        if (template.test(text, {strict: this.state.isStrict})) {
            callback(0, text.length);
        }
    }


}

class MatchesTemplateComponent extends React.Component {
    render() {
        return (
            <span style={{backgroundColor: "#e1ffdc"}} data-offset-key={this.props.offsetKey}>
                {this.props.children}
            </span>
        );
    }
}