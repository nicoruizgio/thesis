import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ArticleChatbot from "../components/ArticleChatbot";

export default function NewsArticle() {
  const location = useLocation();
  const culturalSensitivity = location.state?.culturalSensitivity;
  const suggestedQuestions = location.state?.suggestedQuestions;

  const [url, setUrl] = useState("");
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [showAskButton, setShowAskButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [chatbotSelectedText, setChatbotSelectedText] = useState("");
  const articleRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setArticle(null);

    try {
      const res = await fetch("/api/news-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch article");
      setArticle(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0 && articleRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(selectedText);
      setButtonPosition({
        x: rect.left + rect.width / 2 + window.scrollX, // Add scroll offset
        y: rect.top - 40 + window.scrollY // Add scroll offset
      });
      setShowAskButton(true);
    } else {
      setShowAskButton(false);
      setSelectedText("");
    }
  };

  const handleAskClick = () => {
    setShowAskButton(false);
    setChatbotSelectedText(selectedText);
    // Clear the browser selection
    window.getSelection().removeAllRanges();
  };

  useEffect(() => {
    // Only listen to mouseup to show button when user releases click
    document.addEventListener('mouseup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">News Article</h1>
          <form className="header-search" onSubmit={handleSubmit}>
            <input
              className="searchbar-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste news article URL"
              required
            />
            <button
              className="searchbar-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch Article"}
            </button>
          </form>
        </header>
        <main className="main" style={{ alignItems: "flex-start" }}>
          <div className="left-column">
            {error && <div style={{ color: "red" }}>{error}</div>}
            {article && (
              <div className="form-container" ref={articleRef}>
                <h2>{article.title}</h2>
                <p>
                  <em>{article.authors?.join(", ")}</em>
                </p>
                <p>{article.publish_date}</p>
                <img
                  src={article.top_image}
                  alt=""
                  style={{ maxWidth: "100%", marginBottom: "1rem" }}
                />
                <div style={{ whiteSpace: "pre-line" }}>{article.text}</div>
              </div>
            )}
          </div>
          <div className="right-column" style={{ position: "sticky", top: "2rem", alignSelf: "flex-start" }}>
            {article && !loading && !error && (
              <ArticleChatbot
                article={article}
                selectedText={chatbotSelectedText}
                onTextProcessed={() => setChatbotSelectedText("")}
                culturalSensitivity={culturalSensitivity}
                suggestedQuestions={suggestedQuestions}
              />
            )}
          </div>
        </main>

        {/* Floating Ask Button */}
        {showAskButton && (
          <button
            className="floating-ask-button"
            style={{
              position: 'absolute',
              left: `${buttonPosition.x}px`,
              top: `${buttonPosition.y}px`,
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            onClick={handleAskClick}
          >
            Ask
          </button>
        )}
      </div>
    </div>
  );
}
