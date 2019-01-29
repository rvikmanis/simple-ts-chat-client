import React, { Component, FormEvent, KeyboardEvent } from 'react';
import { InputGroup, Button, ControlGroup, Callout, Intent } from '@blueprintjs/core';
import './LandingPage.css';
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

    nickInput: HTMLInputElement | null = null;

    componentDidMount() {
        if (this.nickInput) {
            this.nickInput.focus();
        }
    }

    handleNickChange = (e: FormEvent<HTMLInputElement>) => {
        const nick = e.currentTarget.value.trim();
        this.setState({ nick });
    }

    handleNickKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.handleConnectClick();
        }
    }

    handleConnectClick = () => {
        if (this.state.nick) {
            this.props.connect(this.state.nick);
        }
        if (this.nickInput) {
            this.nickInput.focus();
        }
    }

    renderCallout() {
        switch (this.props.status) {
            case Status.ConnectionError:
                return <Callout intent={Intent.DANGER}>
                    Server unavailable.
                </Callout>;
        
            case Status.NicknameAlreadyTaken:
                return <Callout intent={Intent.DANGER}>
                    Failed to connect. Nickname already taken.
                </Callout>;
            
            case Status.ServerClosedConnection:
                return <Callout intent={Intent.DANGER}>
                    Disconnected by the server due to inactivity.
                </Callout>;
        }
    }

    render() {
        return <div className="LandingPage">
            <ControlGroup>
                <InputGroup
                    placeholder="Nickname (required)"
                    value={this.state.nick}
                    onChange={this.handleNickChange}
                    onKeyPress={this.handleNickKeyPress}
                    inputRef={input => this.nickInput = input}
                />
                <Button
                    disabled={this.props.status === Status.Connecting}
                    onClick={this.handleConnectClick}
                >
                    {this.props.status === Status.Connecting ? "Connecting..." : "Connect"}
                </Button>
            </ControlGroup>
            <br />

            {this.renderCallout()}
        </div>
    }
}