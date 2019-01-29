import io from 'socket.io-client';
import { Model, StreamSource, ActionLike, Observable, ModelInterface } from 'gasoline';
import { SOCKET_URL } from '../config';

export enum Status {
    // Offline
    Disconnected = "Disconnected",
    NicknameAlreadyTaken = "NicknameAlreadyTaken",
    ConnectionError = "ConnectionError",
    ServerClosedConnection = "ServerClosedConnection",
    // Online
    Connected = "Connected",
    // Connecting
    Connecting = "Connecting"
}

export interface JoinLine {
    type: "join";
    time: number;
    user: string;
}

export interface QuitLine {
    type: "quit";
    time: number;
    user: string;
}

export interface MessageLine {
    type: "message";
    time: number;
    from: string;
    text: string;
}

export type Line =
    | JoinLine
    | QuitLine
    | MessageLine

export interface OfflineState {
    nick: string | undefined;
    lines: Line[];
    status:
        | Status.Disconnected
        | Status.NicknameAlreadyTaken
        | Status.ConnectionError
        | Status.ServerClosedConnection
}

export interface ConnectingState {
    nick: string;
    lines: Line[];
    status: Status.Connecting;
}

export interface OnlineState {
    nick: string;
    lines: Line[];
    status: Status.Connected;
}

export type State =
    | OfflineState
    | ConnectingState
    | OnlineState

export const chatModel = new Model({
    state: {
        nick: undefined,
        lines: [],
        status: Status.Disconnected
    } as State,

    actions: {
        connect(state: OfflineState, nick: string) {
            return {
                ...state,
                lines: [],
                status: Status.Connecting,
                nick: nick
            }
        },
        nickOk(state: ConnectingState) {
            return {
                ...state,
                status: Status.Connected,
            }
        },
        nickTaken(state: ConnectingState) {
            return {
                ...state,
                status: Status.NicknameAlreadyTaken
            }
        },
        connectError(state: OnlineState | ConnectingState) {
            return {
                ...state,
                lines: [],
                status: Status.ConnectionError
            }
        },
        disconnect(state: OnlineState) {
            return {
                ...state,
                lines: [],
                status: Status.Disconnected
            }
        },
        serverClosedConnection(state: OnlineState) {
            return {
                ...state,
                lines: [],
                status: Status.ServerClosedConnection
            }
        },
        addLine(state: State, line: Line) {
            return {
                ...state,
                lines: state.lines.concat([line])
            }
        },
        message(state: State, text: string) {
            return { ...state };
        }
    },

    process(input$, model) {
        const socket = io(SOCKET_URL, {
            autoConnect: false,
            reconnection: false
        });

        const output = new StreamSource<ActionLike>();
        const inputObserver = {
            next(action: ActionLike) {
                switch (action.type) {
                    case model.actionTypes.connect:
                        socket.open();
                        break;
            
                    case model.actionTypes.nickTaken:
                    case model.actionTypes.disconnect:
                        socket.close();
                        break;

                    case model.actionTypes.nickOk:
                        output.next(model.actionCreators.addLine({
                            type: "join",
                            time: new Date().valueOf(),
                            user: model.state.nick
                        }));
                        break;

                    case model.actionTypes.message:
                        output.next(model.actionCreators.addLine({
                            type: "message",
                            time: new Date().valueOf(),
                            from: model.state.nick,
                            text: action.payload
                        }));
                        socket.emit('message', action.payload);
                        break;
                }
            },
            error(e: any) {
                subscription.unsubscribe();
                output.error(e);
            },
            complete() {
                subscription.unsubscribe();
                output.complete();
            }
        }
        const subscription = input$.subscribe(inputObserver);

        socket.on('connect', () => {
            socket.emit('setNick', model.state.nick);
        });

        socket.on('connect_error', () => {
            output.next(model.actionCreators.connectError());
        });

        socket.on('error', () => {
            output.next(model.actionCreators.connectError());
        })

        socket.on('nickTaken', () => {
            output.next(model.actionCreators.nickTaken());
        });

        socket.on('nickOk', () => {
            output.next(model.actionCreators.nickOk());
        });

        socket.on('line', (line: Line) => {
            output.next(model.actionCreators.addLine(line));
        });

        socket.on('serverShutdown', () => {
            output.next(model.actionCreators.connectError());
        });

        socket.on('disconnect', (reason: 'io server disconnect' | 'io client disconnect') => {
            if (reason === 'io server disconnect') {
                if (model.state.status === Status.Connected) {
                    output.next(model.actionCreators.serverClosedConnection());
                }
            }
        });

        return output.observable
    }
});