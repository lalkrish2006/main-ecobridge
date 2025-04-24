import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaCommentAlt } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput("");

      try {
        setLoading(true);
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCzasrCUMjj4-wiQ7-fNcQIvH_hHjV_Ux4",
          {
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
          }
        );
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...newMessages,
          { text: "Error: Could not get response from AI", user: false },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="relative">
      {chatOpen && (
        <div className="chat-box">
          <div className="chat-header">ECO-BOT</div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.user ? "user" : "bot"}`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <span>Loading</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      <div className="message-icon" onClick={() => setChatOpen(!chatOpen)}>
        <FaCommentAlt color="#fff" />
      </div>
    </div>
  );
}

export default Chatbot;
