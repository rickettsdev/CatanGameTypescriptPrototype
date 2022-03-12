import React from 'react';
import '../App.css';

import { useEffect, useRef } from 'react'

type QuoteProps = {
    quotes: string[]
}

type QuoteState = {
    currentIndex: number,
}

// This is just a sample class I copied from the internet. 
// Helps with me understanding React Components
export default class QuoteApp extends React.Component<QuoteProps, QuoteState> {


    state: QuoteState = {
        currentIndex: 0,
    };

    getIndex = (): number => {
        const min: number = 0;
        const max: number = this.props.quotes.length - 1;
        return Math.floor(Math.random() * (max - min) + min);
    };

    getNextQuote = (): void => this.setState(state => ({currentIndex: this.getIndex()}));

    render() {
        const quoteToDisplay = this.props.quotes[this.state.currentIndex];
        return <div className="App">
                <h3>Render Component with State and Props using TypeScript</h3>
            <div style={{height: "5vh", padding: "1em", margin: "7em"}}>
                <h4>{quoteToDisplay}</h4>
            </div>
            <button onClick={this.getNextQuote}>NEXT QUOTE</button>
        </div>
    }
}