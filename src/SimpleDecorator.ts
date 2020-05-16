// MIT License
// Copyright (c) 2016 Nicolas Gaborit <soreine.plume@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Copy/pasted and TS-ified from https://github.com/Soreine/draft-js-simpledecorator

import { ContentState, ContentBlock } from "draft-js";
import Immutable from 'immutable'
const KEY_SEPARATOR = '-';
export type StrategyCallback = (contentBlock: ContentBlock, callback: (start: number, end: number, props: any) => void, contentState: ContentState) => void;
export class SimpleDecorator {
    private readonly decorated: Record<string,any>;
    private readonly getComponent: Function;
    private readonly strategy: StrategyCallback;

    constructor(strategy: StrategyCallback, getComponent: Function) {
        this.decorated = {};
        this.strategy = strategy;
        this.getComponent = getComponent;
    }

    getDecorations = (block: ContentBlock, contentState: ContentState) => {
        var decorations: string[] = Array(block.getText().length).fill(null);
        // Apply a decoration to given range, with given props
        const callback = (start: number, end: number, props: any) => {
            if (props === undefined) {
                props = {};
            }
            key = blockKey + KEY_SEPARATOR + decorationId;
            decorated[blockKey][decorationId] = props;
            decorateRange(decorations, start, end, key);
            decorationId++;
        };

        const blockKey = block.getKey();
        let key;
        let decorationId = 0;
        const decorated = this.decorated;
        decorated[blockKey] = {};

        this.strategy(block, callback, contentState);

        return Immutable.List(decorations);
    };

    getComponentForKey = (key: string) => {
        return this.getComponent;
    };

    getPropsForKey = (key: string) =>  {
        var parts = key.split(KEY_SEPARATOR);
        var blockKey = parts[0];
        var decorationId = parts[1];
        return this.decorated[blockKey][decorationId];
    };

}

const decorateRange = (decorationsArray: string[], start: number, end: number, key: string) => {
    for (var ii: number = start; ii < end; ii++) {
        decorationsArray[ii] = key;
    }
};

