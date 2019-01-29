import React, { Component, FormEvent, KeyboardEvent } from 'react';
import { InputGroup, Button, ControlGroup, Intent, Classes } from '@blueprintjs/core';
import './ChatPage.css';
import { Line } from '../models/chat';
import ChatLine from './ChatLine';

interface Props {
    nick: string,
    lines: Line[],
    disconnect(): void;
    message(text: string): void;
}

interface State {
    message: string;
}

export default class ChatPage extends Component<Props, State> {
    state = {
        message: ""
    };

    messageInput: HTMLInputElement | null = null;

    componentDidMount() {
        if (this.messageInput) {
            this.messageInput.focus();
        }
    }

    handleMessageChange = (e: FormEvent<HTMLInputElement>) => {
        const message = e.currentTarget.value;
        this.setState({ message });
    }

    handleMessageKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.handleSendClick();
        }
    }

    handleSendClick = () => {
        const message = this.state.message.trim();
        if (message) {
            this.setState({ message: "" });
            this.props.message(message.trim());
        }
        if (this.messageInput) {
            this.messageInput.focus();
        }
    }

    handleDisconnectClick = () => {
        this.props.disconnect();
    }

    render() {
        return <div className="ChatPage">
            <div className="ChatPage-Lines">
                {this.props.lines.map((line, k) => <ChatLine
                    key={k}
                    you={this.props.nick}
                    {...line}
                />)}
            </div>
            <div className="ChatPage-Controls">
                <ControlGroup fill={true}>
                    <InputGroup
                        value={this.state.message}
                        onChange={this.handleMessageChange}
                        onKeyPress={this.handleMessageKeyPress}
                        inputRef={input => this.messageInput = input}
                    />
                    <Button
                        className={Classes.FIXED}
                        onClick={this.handleSendClick}
                    >
                        Send
                    </Button>
                    <Button
                        className={Classes.FIXED}
                        intent={Intent.DANGER}
                        onClick={this.handleDisconnectClick}
                    >
                        Disconnect
                    </Button>
                </ControlGroup>
            </div>
        </div>
    }
}