import React, { Component } from 'react';
import { Line } from '../models/chat';

export default class ChatLine extends Component<Line> {
    render() {
        const time = new Date(this.props.time).toLocaleString();
        
        if (this.props.type === "join") {
            return <div>[{time}] {this.props.user} joined</div>
        }

        if (this.props.type === "quit") {
            return <div>[{time}] {this.props.user} quit</div>
        }

        if (this.props.type === "message") {
            return <div>[{time}] <strong>{this.props.from}</strong>: {this.props.text}</div>
        }
    }
}