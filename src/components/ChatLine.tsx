import React, { Component } from 'react';
import { Line } from '../models/chat';

type Props = Line & {
    you: string;
}

export default class ChatLine extends Component<Props> {
    render() {
        const time = new Date(this.props.time).toLocaleString();
        
        if (this.props.type === "join") {
            const user = (this.props.you === this.props.user)
                ? `${this.props.user} (you)`
                : this.props.user;
            return <div>[{time}] {user} joined</div>
        }

        if (this.props.type === "quit") {
            return <div>[{time}] {this.props.user} quit</div>
        }

        if (this.props.type === "message") {
            return <div>[{time}] <strong>{this.props.from}</strong>: {this.props.text}</div>
        }
    }
}