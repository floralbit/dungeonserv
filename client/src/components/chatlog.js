import React, { Component, useRef, useEffect, useState } from 'react';

function ChatLog(props) {
  const {messages, network} = props;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView();
  }, [JSON.stringify(messages)]); // seriously???

  const [chatInput, setChatInput] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      network.sendChat(chatInput);
      setChatInput('');
    }
  }

  return (
    <div id="chat-log-wrapper">
      <div id="chat-log">
        <ul>
          {messages.map((message, i) => {
              if (message.chat) {
                return <li key={i}><span style={{color: '#00ff00'}}>{message.chat.From}</span>: {message.chat.Message}</li>;
              }

              if (message.join) {
                return <li key={i} style={{color: '#ff0000'}}>{message.join.From} joined.</li>;
              }
          })}
          <div ref={messagesEndRef} />
        </ul>
        
        <input type="text" onChange={e => setChatInput(e.target.value)} onKeyDown={handleKeyDown} value={chatInput} />
      </div>
    </div>
  );
}

export default ChatLog;