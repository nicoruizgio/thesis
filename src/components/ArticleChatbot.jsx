import React, { useState, useRef, useEffect, useCallback } from "react";
import { sendMessageToApi } from "../utils/chatApi";
import { generateGreeting } from "../utils/greetingApi";
import { logConversation } from "../utils/supabaseLogger";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";
import { GiMonoWheelRobot } from "react-icons/gi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SourceParser from './SourceParser';

const ArticleChatbot = ({
  article,
  selectedText,
  onTextProcessed,
  generatedQuestions,
  questionInput,
  onQuestionInputProcessed,
  onLoadingChange
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentSelectedText, setCurrentSelectedText] = useState("");
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Notify parent when loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Handle selected text from parent component
  useEffect(() => {
    if (selectedText && selectedText !== currentSelectedText) {
      setCurrentSelectedText(selectedText);
    }
  }, [selectedText, currentSelectedText]);

  // Handle question input from highlighted passages - now auto-sends
  useEffect(() => {
    // Don't process new highlighted questions if already loading
    if (isLoading) {
      console.log("Skipping highlighted question - already loading");
      return;
    }

    if (questionInput && typeof questionInput === 'object' && questionInput.autoSend) {
      // Auto-send the question when it comes from highlighted passages
      const sendHighlightQuestion = async () => {
        const { question, passage } = questionInput; // removed type

        // Create the user message with context
        const userMsg = {
          from: "user",
          text: question,
          selectedText: passage,
          timestamp: new Date().toISOString()
        };

        setMessages((msgs) => [...msgs, userMsg]);
        setIsLoading(true);

        // Log highlighted passage question
        await logConversation(
          article?.id || 'unknown',
          'user',
          question,
          'highlighted_passage',
          passage
        ); // removed highlightQuestionType argument

        // Add loading indicator
        setMessages((msgs) => [...msgs, { from: "bot", loading: true }]);

        try {
          // Include selected text in the API call
          const messageWithContext = `Selected text: "${passage}"\n\nQuestion: ${question}`;
          const articleData = {
            title: article.title,
            authors: article.authors,
            text: article.text
          };
          const botReply = await sendMessageToApi(messageWithContext, null, 'article', articleData);

          // Log bot reply
          await logConversation(
            article?.id || 'unknown',
            'bot',
            botReply
          );

          // Remove loading indicator and add actual reply
          setMessages((msgs) => {
            const newMsgs = [...msgs];
            newMsgs.pop(); // Remove the loading message
            return [...newMsgs, {
              from: "bot",
              text: botReply,
              timestamp: new Date().toISOString()
            }];
          });
        } catch (error) {
          console.error("Chat error:", error);
          const errorMessage = "Sorry, there was an error processing your request.";

          // Log error message
          await logConversation(
            article?.id || 'unknown',
            'bot',
            errorMessage
          );

          setMessages((msgs) => {
            const newMsgs = [...msgs];
            newMsgs.pop(); // Remove the loading message
            return [...newMsgs, {
              from: "bot",
              text: errorMessage,
              timestamp: new Date().toISOString()
            }];
          });
        } finally {
          setIsLoading(false);
          // Clear all states after sending - this should clear the blue context box
          setCurrentSelectedText("");
          if (onTextProcessed) {
            onTextProcessed();
          }
          if (onQuestionInputProcessed) {
            onQuestionInputProcessed();
          }
        }
      };

      sendHighlightQuestion();
    } else if (questionInput && typeof questionInput === 'string' && questionInput.trim()) {
      // Handle regular string questions (if any other part of the app uses this)
      setInput(questionInput);
      if (onQuestionInputProcessed) {
        onQuestionInputProcessed();
      }
    }
  }, [questionInput, onQuestionInputProcessed, onTextProcessed, isLoading, article]);

  // Generate greeting when article changes
  useEffect(() => {
    const initializeChat = async () => {
      if (article) {
        setIsInitializing(true);
        try {
          const greeting = await generateGreeting('article');
          setMessages([{ from: "bot", text: greeting }]);
        } catch (error) {
          console.error('Error initializing chat:', error);
          setMessages([{ from: "bot", text: "Hi! How can I help you with this article?" }]);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeChat();
  }, [article]);

  // Scroll messages container to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, [messages]);

  // Simplify handleSendMessage to only handle manual user input
  const handleSendMessage = useCallback(async (messageText) => {
    const hadSelectedText = currentSelectedText;
    const userMsg = {
      from: "user",
      text: messageText,
      selectedText: hadSelectedText || null,
      timestamp: new Date().toISOString()
    };

    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsLoading(true);

    // Log user message
    const userMessageType = hadSelectedText ? 'selected_passage' : 'direct';
    await logConversation(
      article?.id || 'unknown',
      'user',
      messageText,
      userMessageType,
      hadSelectedText || null
    );

    // Clear selected text immediately when sending message
    if (hadSelectedText) {
      setCurrentSelectedText("");
      onTextProcessed?.();
    }

    // Add loading indicator
    setMessages((msgs) => [...msgs, { from: "bot", loading: true }]);

    try {
      // Include selected text in the API call if it exists
      const messageWithContext = hadSelectedText
        ? `Selected text: "${hadSelectedText}"\n\nQuestion: ${messageText}`
        : messageText;

      const articleData = {
        title: article.title,
        authors: article.authors,
        text: article.text
      };
      const botReply = await sendMessageToApi(messageWithContext, null, 'article', articleData);

      // Log bot reply
      await logConversation(
        article?.id || 'unknown',
        'bot',
        botReply
      );

      // Remove loading indicator and add actual reply
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        newMsgs.pop(); // Remove the loading message
        return [...newMsgs, {
          from: "bot",
          text: botReply,
          timestamp: new Date().toISOString()
        }];
      });
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = "Sorry, there was an error processing your request.";

      // Log error message
      await logConversation(
        article?.id || 'unknown',
        'bot',
        errorMessage
      );

      setMessages((msgs) => {
        const newMsgs = [...msgs];
        newMsgs.pop(); // Remove the loading message
        return [...newMsgs, {
          from: "bot",
          text: errorMessage,
          timestamp: new Date().toISOString()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSelectedText, onTextProcessed, article]);

  const handleSend = async (e) => {
    e.preventDefault();
    // Prevent sending if already loading or input is empty
    if (!input.trim() || isLoading) return;

    await handleSendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Only handle if not already loading
      if (!isLoading) {
        handleSend(e);
      }
    }
  };

  const handleClearSelection = () => {
    setCurrentSelectedText("");
    onTextProcessed?.();
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Don't render the chatbot until initialization is complete
  if (isInitializing) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-messages">
          <div className="chatbot-message bot">
            <span className="chatbot-icon">
              <GiMonoWheelRobot />
            </span>
            Preparing chat...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div
        className="chatbot-messages"
        ref={messagesContainerRef}
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

            {/* Show selected text above user messages if it exists */}
            {msg.from === "user" && msg.selectedText && (
              <div className="message-selected-text">
                <span className="selected-text-content">"{truncateText(msg.selectedText, 50)}"</span>
              </div>
            )}

            <div className="message-content">
              {msg.loading ? (
                <div className="chatbot-spinner" aria-label="Loading" />
              ) : (
                msg.from === "bot" ? (
                  <SourceParser text={msg.text} />
                ) : (
                  msg.text
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Text Display - only shown when there's selected text */}
      {currentSelectedText && (
        <div className="selected-text-container">
          <div className="selected-text-content">
            "{truncateText(currentSelectedText)}"
          </div>
          <button
            className="clear-selection-button"
            onClick={handleClearSelection}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {/* Chat input */}
      <form className="chatbot-input-row" onSubmit={handleSend}>
        <textarea
          className="chatbot-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Please wait..." : "Ask about this article..."}
          rows={1}
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'text'
          }}
        />
        <button
          className="chatbot-send"
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            opacity: (isLoading || !input.trim()) ? 0.6 : 1,
            cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ArticleChatbot;