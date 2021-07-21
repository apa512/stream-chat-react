import { useEffect } from 'react';
import { ChatAutoComplete, useMessageInputContext } from 'stream-chat-react';
import { SendArrow } from '../../assets/SendArrow';

import './MessageInputUI.scss';

export const MessageInputUI: React.FC = () => {
  const { handleSubmit } = useMessageInputContext();

  return (
    <div className='message-input-container'>
      <div className='message-input-input'>
        <ChatAutoComplete placeholder='Say something' />
      </div>
      <div className='message-input-send'>
        <div onClick={handleSubmit}>
          <SendArrow />
        </div>
        <div>269</div>
      </div>
    </div>
  );
};
