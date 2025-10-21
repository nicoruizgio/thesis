import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { getArticleById } from "../data/articles";
import { questionsByArticle } from "../data/questions";
import { logArticleFinished } from "../utils/supabaseLogger";
import ArticleChatbot from "../components/ArticleChatbot";
import "./articles.css";
import { IoMdArrowBack } from "react-icons/io";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = getArticleById(id);
  const [selectedText, setSelectedText] = useState("");
  const [showAskButton, setShowAskButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [chatbotSelectedText, setChatbotSelectedText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [chatbotQuestionInput, setChatbotQuestionInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState({ question: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);
  const articleRef = useRef(null);

  // Handle back button click to log article finished
  const handleBackClick = async () => {
    if (article) {
      console.log(`Logging article finished for ${article.id}`);
      await logArticleFinished(article.id, article.title);
    }
    navigate("/articles");
  };

  useEffect(() => {
    if (article) {
      setQuestions(questionsByArticle[article.id]?.questions || []);
    }
  }, [article]);

  const normalizeText = (text) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      .replace(/–/g, '-')
      .trim();
  };

  const findBestMatch = (passage, text) => {
    const words = passage.split(' ');
    const minWords = Math.max(2, Math.floor(words.length * 0.7));

    for (let i = words.length; i >= minWords; i--) {
      for (let j = 0; j <= words.length - i; j++) {
        const subsequence = words.slice(j, j + i).join(' ');
        const escapedSubsequence = subsequence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSubsequence})`, 'gi');

        if (regex.test(text)) {
          return { match: subsequence, regex };
        }
      }
    }

    return null;
  };

  const highlightVerbatimPassages = (text) => {
    if (!questions || !Array.isArray(questions)) return text;
    let highlightedText = text;
    const sortedQuestions = [...questions].sort((a, b) =>
      (b.verbatim_passage?.length || 0) - (a.verbatim_passage?.length || 0)
    );
    sortedQuestions.forEach((question, index) => {
      if (!question.verbatim_passage) return;
      const passage = question.verbatim_passage.trim();
      const disabledClass = isChatbotLoading ? ' disabled' : '';
      let escapedPassage = passage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let regex = new RegExp(`(${escapedPassage})`, 'gi');
      if (!regex.test(highlightedText)) {
        const fuzzyMatch = findBestMatch(passage, highlightedText);
        if (fuzzyMatch) {
          regex = fuzzyMatch.regex;
        } else {
          return;
        }
      }
      highlightedText = highlightedText.replace(
        regex,
        `<span class="highlight-blue highlighted-passage${disabledClass}" data-question-index="${index}" data-passage="${passage}" data-question="${question.question}">$1</span>`
      );
    });
    return highlightedText;
  };

  const handleHighlightHover = (e) => {
    const target = e.target;
    if (target.classList.contains('highlighted-passage')) {
      const rect = target.getBoundingClientRect();
      const question = target.getAttribute('data-question');
      setTooltipData({ question });
      setTooltipPosition({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top - 10 + window.scrollY
      });
      setShowTooltip(true);
    }
  };

  const handleHighlightLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !relatedTarget.closest('.floating-tooltip')) {
      setShowTooltip(false);
    }
  };

  const handleHighlightClick = (e) => {
    const target = e.target;
    if (target.classList.contains('highlighted-passage')) {
      if (isChatbotLoading) return;
      const passage = target.getAttribute('data-passage');
      const question = target.getAttribute('data-question');
      setChatbotSelectedText("");
      if (question && passage) {
        // Prefill the chatbot input and show the passage context; user can edit and send
        setChatbotQuestionInput({
          question,
          passage
        });
      }
      setShowTooltip(false);
    }
  };

  useEffect(() => {
    if (!article) return;
    const handleTextSelection = () => {
      const sel = window.getSelection();
      const txt = sel.toString().trim();
      if (txt.length > 0 && articleRef.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(txt);
        setButtonPosition({
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top - 40 + window.scrollY
        });
        setShowAskButton(true);
      } else {
        setShowAskButton(false);
        setSelectedText("");
      }
    };
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, [article]);

  useEffect(() => {
    if (!articleRef.current) return;

    const articleElement = articleRef.current;
    articleElement.addEventListener('click', handleHighlightClick);
    articleElement.addEventListener('mouseover', handleHighlightHover);
    articleElement.addEventListener('mouseleave', handleHighlightLeave);

    return () => {
      articleElement.removeEventListener('click', handleHighlightClick);
      articleElement.removeEventListener('mouseover', handleHighlightHover);
      articleElement.removeEventListener('mouseleave', handleHighlightLeave);
    };
  }, [questions]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      console.log('Questions received:', questions);

      const fullArticleText = article.paragraphs.join('\n\n');
      questions.forEach((q, i) => {
        const found = fullArticleText.includes(q.verbatim_passage);
        console.log(`Question ${i}: "${q.verbatim_passage}" - Found: ${found}`);
        if (!found) {
          const words = q.verbatim_passage.split(' ');
          const firstWord = words[0];
          const matches = fullArticleText.match(new RegExp(`${firstWord}[^.]*`, 'gi'));
          console.log(`  Similar passages containing "${firstWord}":`, matches);
        }
      });
    }
  }, [questions, article]);

  const handleAskClick = () => {
    setShowAskButton(false);
    setChatbotSelectedText(selectedText);
    window.getSelection().removeAllRanges();
  };

  if (!article) {
    return (
      <div className="app">
        <div className="container">
          <button onClick={() => navigate(-1)}>← Back</button>
          <p>Article not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header article-header">
          <div>
            <div className="back-container">
            <IoMdArrowBack className="back-icon" />
            <button onClick={handleBackClick} className="back-button"> Back</button>
            </div>

            <h1 className="title" style={{ marginBottom: ".25rem" }}>{article.title}</h1>
            <div style={{ fontSize: ".8rem", color: "#666" }}>
              {article.source} · {article.section} · {article.date}
            </div>
          </div>
        </header>
        <main className="main article-main">
          <div className="left-column">
            <div className="form-container" ref={articleRef}>
              {article.image && (
                <img
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  className="article-image"
                />
              )}
              {article.authors && (
                <p className="article-authors">
                  {Array.isArray(article.authors) ? article.authors.join(", ") : article.authors}
                </p>
              )}

              {article.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="article-paragraph"
                  dangerouslySetInnerHTML={{
                    __html: highlightVerbatimPassages(paragraph)
                  }}
                />
              ))}
            </div>
          </div>
          <div className="right-column article-right-column">
            <ArticleChatbot
              article={article}
              selectedText={chatbotSelectedText}
              onTextProcessed={() => setChatbotSelectedText("")}
              generatedQuestions={questions}
              questionInput={chatbotQuestionInput}
              onQuestionInputProcessed={() => setChatbotQuestionInput("")}
              onLoadingChange={setIsChatbotLoading}
            />
          </div>
        </main>

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

        {showTooltip && (
          <div
            className={`floating-tooltip${isChatbotLoading ? ' disabled' : ''}`}
            style={{
              position: 'absolute',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 2000
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="tooltip-question">
              {tooltipData.question}
            </div>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
    </div>
  );
}