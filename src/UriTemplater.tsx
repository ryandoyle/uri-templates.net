import React, {ChangeEvent} from "react";
import TextField from "@material-ui/core/TextField";
import './UriTemplater.css'
import {CompositeDecorator, ContentBlock, ContentState, Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import uriTemplates from 'uri-templates';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

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

        var selectionState = editorState.getSelection();
        var anchorKey = selectionState.getAnchorKey();
        var currentContent = editorState.getCurrentContent();
        var currentContentBlock = currentContent.getBlockForKey(anchorKey);
        var selectedText = currentContentBlock.getText() //.slice(start, end);
        console.log(selectedText);

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
                decorator: new CompositeDecorator([
                    {
                        strategy: this.matchesTemplateStrategy,
                        component: MatchesTemplateComponent
                    },
                    {
                        strategy: this.isSelectedStrategy,
                        component: IsSelectedComponent
                    }
                ])
            })
        });
    }

    matchesTemplateStrategy = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
        let template = uriTemplates(this.state.uriTemplate);
        let text = contentBlock.getText().trimEnd();

        // @ts-ignore: template.test is not on current type definitions
        if (template.test(text, {strict: this.state.isStrict})) {
            callback(0, text.length);
        }
    };

    isSelectedStrategy = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
        if (this.state.contentBlockUnderCursor === contentBlock) {
            callback(0, contentBlock.getLength());

        }
    };


}

class MatchesTemplateComponent extends React.Component<{offsetKey: number}> {
    render() {
        return (
            <span style={{backgroundColor: "#e1ffdc"}} data-offset-key={this.props.offsetKey}>
                {this.props.children}
            </span>
        );
    }
}

class IsSelectedComponent extends React.Component<{offsetKey: number}> {
    render() {
        return (
            <span style={{border: "1px solid red"}} data-offset-key={this.props.offsetKey}>
                {this.props.children}
            </span>
        );
    }
}