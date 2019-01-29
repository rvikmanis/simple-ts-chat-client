import React, { Component } from 'react';
import { Line } from '../models/chat';
import ChatLine from './ChatLine';

interface Props {
    nick: String,
    lines: Line[],
    disconnect(): void;
    message(text: string): void;
}

export default class ChatPage extends Component<Props> {
    render() {
        return <div>
            <div>
                {this.props.lines.map((line, k) => <ChatLine key={k} {...line} />)}
            </div>
            <div>
                input here
            </div>
        </div>
    }
}