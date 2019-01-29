import React, { Component, FormEvent } from 'react';
import { InputGroup, Button } from '@blueprintjs/core';
import { Status } from '../models/chat';

interface Props {
    status: Status,
    connect(nick: string): void;
}

interface State {
    nick: string
}

export default class LandingPage extends Component<Props, State> {
    state = { nick: "" };

    handleNickChange = (e: FormEvent<HTMLInputElement>) => {
        const nick = e.currentTarget.value.trim();
        this.setState({ nick });
    }

    handleConnect = () => {
        if (this.state.nick) {
            this.props.connect(this.state.nick);
        }
    }

    render() {
        return <div>
            Enter your nickname:
            <br />
            
            <InputGroup
                value={this.state.nick}
                onChange={this.handleNickChange}
            />
            <br />

            <Button
                disabled={this.props.status === Status.Connecting}
                onClick={this.handleConnect}
            >
                {this.props.status === Status.Connecting ? "Connecting..." : "Connect"}
            </Button>
            <br />

            Status: {this.props.status}
        </div>
    }
}