import React from "react";
import TextField from "@material-ui/core/TextField";
import './UriTemplater.css'
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import 'draft-js/dist/Draft.css';
import uriTemplates from 'uri-templates';

export class UriTemplater extends React.Component {


    constructor(props) {
        super(props);
        this.state = {uriTemplate: uriTemplates(''), editorState: EditorState.createEmpty()}
        this.onChange = editorState => this.setState({editorState})
    }

    render() {
        return (
            <Container maxWidth={"md"}>
                <Paper >
                    <TextField onChange={this.handleTemplateChange} className={"TemplateInput"} variant={"outlined"} size={"small"} fullWidth={true}  placeholder={"/my/{path}/?{param1,param2}"}/>
                    <Editor placeholder={"Enter test URLs per line..."} editorState={this.state.editorState} onChange={this.onChange} />
                </Paper>
            </Container>

        )
    }

    handleTemplateChange = (event) => {
        this.setState({uriTemplate: uriTemplates(event.target.value)}, () => {
            // Please forgive me, I have no idea how to react. We need to use the state in the matchesTemplateStrategy
            // which comes from the state we set on the uriTemplate
            this.setState({
                editorState: EditorState.set(this.state.editorState, { decorator: new CompositeDecorator([
                        {
                            strategy: this.matchesTemplateStrategy,
                            component: MatchesTemplateComponent
                        }
                    ])
                } )})

        });
    }

    matchesTemplateStrategy = (contentBlock, callback, contentState) => {
        let template = this.state.uriTemplate;
        let text = contentBlock.getText().trimEnd();

        if (template.test(text, {strict: true})) {
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