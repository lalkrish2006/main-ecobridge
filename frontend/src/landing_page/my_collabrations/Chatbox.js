import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chatbox.css";

// Create a socket connection to the backend
const socket = io("http://localhost:3002", { withCredentials: true });

function ChatBox({ collabId, username, userId }) {
  const [message, setMessage] = useState(""); // For storing the new message
  const [chat, setChat] = useState([]); // For storing the chat history

  useEffect(() => {
    // Ensure user is joined to the correct room
    if (collabId && username) {
      socket.emit("joinRoom", collabId);

      // Listen for chat history when the user joins the room
      socket.on("chatHistory", (history) => {
        setChat(history); // Update state with the history of the chat
      });

      // Listen for new messages and add them to the chat
      socket.on("chatMessage", (newMessage) => {
        setChat((prev) => [...prev, newMessage]); // Append new message to the chat
      });
    }

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off("chatHistory");
      socket.off("chatMessage");
    };
  }, [collabId, username]); // Only run this effect when collabId or username change

  const handleSend = () => {
    if (message.trim() !== "") {
      // Emit the message to the server with the current collabId and username
      socket.emit("chatMessage", { roomId: collabId, message, senderId: userId });
      setMessage(""); // Clear the input after sending the message
    }
  };

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
  }, [chat]); // Run this effect when chat is updated

  return (
    <div className="card p-3" style={{ maxHeight: "500px", display: "flex", flexDirection: "column" }}>
      <h5>Group Chat</h5>
      <div
        id="chat-box"
        className="chat-box mb-2"
        style={{ maxHeight: "300px", overflowY: "scroll", flex: 1 }}
      >
        {/* Display all the messages in the chat history */}
        {chat.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender.username}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="d-flex">
        {/* Input field for the new message */}
        <input
          type="text"
          className="form-control me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
