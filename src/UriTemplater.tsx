import React, {ChangeEvent} from "react";
import TextField from "@material-ui/core/TextField";
import './UriTemplater.css'
import {ContentBlock, ContentState, Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import uriTemplates from 'uri-templates';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import {SimpleDecorator} from "./SimpleDecorator";

type UriTemplaterState = {
    uriTemplate: string
    editorState: EditorState
    isStrict: boolean
    contentBlockUnderCursor?: ContentBlock;
}

export class UriTemplater extends React.Component<{}, UriTemplaterState> {

    constructor(props: any) {
        super(props);
        this.state = {
            uriTemplate: '',
            editorState: EditorState.createEmpty(),
            isStrict: true,
        };
    }

    onChange = (editorState: EditorState) => {
        const selectionState = editorState.getSelection();
        const anchorKey = selectionState.getAnchorKey();
        const currentContent = editorState.getCurrentContent();
        const currentContentBlock = currentContent.getBlockForKey(anchorKey);
        const selectedText = currentContentBlock.getText(); //.slice(start, end);

        return this.setState({editorState, contentBlockUnderCursor: currentContentBlock}, this.refreshEditorDecorator);
    };

    render = () => {
        return (
            <Grid container direction={"column"} justify={"center"} alignItems={"stretch"} spacing={2}>
                <Grid item>
                    <Box display={"flex"} flexDirection={"row"}>
                        <Box flexGrow={1}>
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
                <Grid>
                    <Box p={1}><Divider/></Box>
                </Grid>
                <Grid item>
                    <Box border={1} borderColor={"grey.500"} p={1}>
                        <Editor
                            placeholder={"Enter test URLs per line..."}
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        )
    };

    handleTemplateChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({uriTemplate: event.target.value}, this.refreshEditorDecorator);
    };

    handleStrictChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({isStrict: event.target.checked}, this.refreshEditorDecorator)
    };

    refreshEditorDecorator() {
        // Please forgive me, I have no idea how to react. We need to use the state in the matchesTemplateStrategy
        // which comes from the state we set on the uriTemplate
        this.setState({
            editorState: EditorState.set(this.state.editorState, {
                decorator: new SimpleDecorator(this.matchingLineStrategy, MatchingLineComponent)
            })
        });
    }

    matchingLineStrategy = (contentBlock: ContentBlock, callback: (start: number, end: number, props: any) => void, contentState: ContentState) => {
        let template = uriTemplates(this.state.uriTemplate);
        let text = contentBlock.getText().trimEnd();
        const caretOnCurrentLine = this.state.contentBlockUnderCursor === contentBlock;

        // @ts-ignore: template.test is not on current type definitions
        if (template.test(text, {strict: this.state.isStrict})) {
            return callback(0, text.length, {lineMatches: true, caretOnCurrentLine});
        }
        if (caretOnCurrentLine) {
            return callback(0, text.length, {lineMatches: false, caretOnCurrentLine});
        }
    };

}

class MatchingLineComponent extends React.Component<{offsetKey: number, lineMatches: boolean, caretOnCurrentLine: boolean}> {

    styles = () => {
        return {
            backgroundColor: (this.props.lineMatches ? "#e1ffdc" : ""),
            ...(this.props.caretOnCurrentLine ? {border: (this.props.lineMatches ? "1px solid #88E992" : "1px solid #ddd")} : {})
        }
    };

    render() {
        return (
            <span style={this.styles()} data-offset-key={this.props.offsetKey}>
                {this.props.children}
            </span>
        );
    }
}
