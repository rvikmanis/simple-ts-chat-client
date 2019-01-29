import React from 'react';
import { createContainer } from 'gasoline';

import App from '../components/App';
import { chatModel } from '../models/chat';

export default createContainer(() => {
    return chatModel.state$.map(state => {
        return <App
            {...state}
            connect={chatModel.actions.connect}
            message={chatModel.actions.connect}
            disconnect={chatModel.actions.disconnect}
        />
    });
})