import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

 class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      currentUser : {name: "Bob"},
      messages: [],
      value: '', // what is this for?
      userCounter: '' // I like that you listed all the possible state values here. Suggestion: make the empty default undefined instead of ''
    };
    this.createNewMessage = this.createNewMessage.bind(this);
  }

  createNewMessage(event) {
    const newMessage = {
      username: event.username,
      content: event.content,
      type: event.type
    }
    this.setState({currentUser: {name: newMessage.username}}) // why is it necessary to update this.state.currentUser every time a new message is sent?
    this.socket.send(JSON.stringify(newMessage));
  }

  componentDidMount() {

    let maSocket = new WebSocket('ws://localhost:4000');
    this.socket = maSocket;
    this.socket.onopen = (event) => {
        this.socket.onmessage = (event) => {
         const receivedData = JSON.parse(event.data);
          switch(receivedData.type) { // nice use of switch statement here
            case "incomingMessage":
            case "incomingNotification":
              const updatedMessage = receivedData;
              const newMessages = this.state.messages.concat(updatedMessage);
              this.setState({messages: newMessages});
              break;
            case "clientCounter":
              const clientCount = receivedData.content
              this.setState({userCounter: clientCount});
              break;
            default:
              throw new Error("Unknown event type " + receivedData);
          }
        };
    } // fat arrow acts as a regular function but with .bind this after
  }

  render() {
    console.log("Rendering")
    return (
      <div>
        <nav>
          <h1>Chatty</h1>
          <h3>{this.state.userCounter} users online</h3>
        </nav>
        <MessageList
        messages={this.state.messages}
        />
        <ChatBar
        username={this.state.currentUser.name}
        addMessage={this.createNewMessage}
        // suggestion: You could split up addMessage into two separate functions: addMessage and renameUser.
        />
      </div>
    );
  }
}

export default App;
