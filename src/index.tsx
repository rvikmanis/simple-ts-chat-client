import React from 'react';
import ReactDOM from 'react-dom';
import { Store } from 'gasoline';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.css';
import { chatModel } from './models/chat';
import AppContainer from './containers/AppContainer';

const store = new Store(chatModel);

store.ready(() => {
    ReactDOM.render(<AppContainer />, document.getElementById('root'));
});
store.start();