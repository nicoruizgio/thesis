import React, { useState, useRef, useEffect } from "react";
import { sendMessageToApi } from "../utils/chatApi";
import "./Chatbot.css";
import { GiMonoWheelRobot } from "react-icons/gi";

const Chatbot = ({ videoId }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you with this video?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null); // New ref for the container

  // Reset messages when videoId changes
  useEffect(() => {
    if (videoId) {
      setMessages([{ from: "bot", text: "Hi! How can I help you with this video?" }]);
    }
  }, [videoId]);

  // Scroll messages container to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsLoading(true);

    // Add loading indicator
    setMessages((msgs) => [...msgs, { from: "bot", text: "..." }]);

    try {
      const botReply = await sendMessageToApi(input, videoId);

      // Remove loading indicator and add actual reply
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        newMsgs.pop(); // Remove the loading message
        return [...newMsgs, { from: "bot", text: botReply }];
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        newMsgs.pop(); // Remove the loading message
        return [...newMsgs, { from: "bot", text: "Sorry, there was an error processing your request." }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="chatbot-container">
      <div
        className="chatbot-messages"
        ref={messagesContainerRef} // Add ref to messages container
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chatbot-message ${msg.from === "user" ? "user" : "bot"}`}
          >
            {msg.from === "bot" && (
              <span className="chatbot-icon">
                <GiMonoWheelRobot />
              </span>
            )}
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chatbot-input-row" onSubmit={handleSend}>
        <textarea
          className="chatbot-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this video..."
          rows={1}
          disabled={isLoading}
        />
        <button
          className="chatbot-send"
          type="submit"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;