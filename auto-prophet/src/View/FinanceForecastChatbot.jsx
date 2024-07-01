import React, { Component } from 'react';
import { generateText } from '../Controller/prototype.js';
import './FinanceForecastChatbot.css';

class FinanceForecastChatbot extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      messages: [],
      typing: false,
      userInput: '',
    };
  }

  sendMessage = async () => {
    const { userInput } = this.state;
    const trimmedInput = userInput.trim();
    if (trimmedInput === '') return;

    // Append user message to the messages state
    this.appendMessage(trimmedInput, 'user');

    try {
      const botResponse = await generateText(trimmedInput);
    
      // Append bot response to the messages state
      this.appendMessage(botResponse, 'bot');
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Clear the input field after sending message
    this.setState({ userInput: '' });
  };

  appendMessage = (message, sender) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, { message, sender }]
    }));
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      this.sendMessage(); 
    }
  };

  componentDidMount() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  render() {
    const { messages, typing, userInput } = this.state;
    
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h1 className="Heading">Mental Health ChatBot</h1>
        </div>
        <div className="buttons-container">
          <button className="recent-button" onClick={() => alert('Viewing recent conversations...')}>
            Recent
          </button>
        </div>
        <div className="chat-messages">
          <p>Hello!</p>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}-message`}>
              <p>{msg.message}</p>
            </div>
          ))}
          {/* Display typing indicator if bot is typing */}
          {typing && (
            <div className="chat-message bot-message typing-indicator">
              <p>Typing...</p>
            </div>
          )}
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => this.setState({ userInput: e.target.value })}
              onKeyPress={this.handleKeyPress}
            />
            <button className="send-button" onClick={this.sendMessage}>
              <i className="material-icons">send</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export { FinanceForecastChatbot };
