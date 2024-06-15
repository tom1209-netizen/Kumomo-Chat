import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { generateChatId } from '../utils/chatIDGenerator';

export const ChatContext = createContext();

export function ChatContextProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        const user = action.payload;
        const chatId = generateChatId(auth.user.id, user.user._id);
        console.log('Updated state:', { user, chatId }); // Log the new state
        return {
          user,
          chatId,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
}

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
