import React from 'react';
// import {ChatContext, ChatContextProvider} from '../context/chat';
import Chat from '../components/chat/chat';
import ChatRequestContext, {
  ChatRequestContextProvider,
} from '../context/chatRequest';
// import {MainContext} from '../context/app';

// ChatRequestContext;

class ChatScreen extends React.Component {
  render() {
    return (
      <ChatRequestContextProvider>
        <ChatRequestContext.Consumer>
          {(context) => (
            <Chat
              {...this.props}
              context={context}
              appContext={this.props.context}
            />
          )}
        </ChatRequestContext.Consumer>
      </ChatRequestContextProvider>
    );
  }
}

export default ChatScreen;
