import React, { Component } from 'react';
import { H1 } from "@blueprintjs/core";
import './App.css';

import { State, Status } from '../models/chat';
import LandingPage from './LandingPage';
import ChatPage from './ChatPage';

type Props = State & {
  connect(nick: string): void;
  message(text: string): void;
  disconnect(): void;
}

class App extends Component<Props> {
  render() {
    let page;
    if (this.props.status === Status.Connected) {
      page = <ChatPage
        disconnect={this.props.disconnect}
        message={this.props.message}
        nick={this.props.nick}
        lines={this.props.lines}
      />
    } else {
      page = <LandingPage
        status={this.props.status}
        connect={this.props.connect}
      />
    }

    return <div className="App">
      <H1 style={{ textAlign: "center" }}>Chat</H1>
      {page}
    </div>
  }
}

export default App;
