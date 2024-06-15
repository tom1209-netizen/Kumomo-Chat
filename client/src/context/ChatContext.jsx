import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { generateChatId } from '../utils/chatIDGenerator';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {}
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId: generateChatId(auth.user.id, action.payload.user._id),
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
};

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
