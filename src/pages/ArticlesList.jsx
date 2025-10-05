import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { articles } from "../data/articles";
import { questionsByArticle } from "../data/questions";
import { logArticleVisit } from "../utils/supabaseLogger";
import "./Home.css";
import "./articles.css";

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get shuffled articles from sessionStorage or create new shuffle
const getShuffledArticles = () => {
  try {
    const stored = sessionStorage.getItem('shuffled_articles');
    if (stored) {
      const parsedArticles = JSON.parse(stored);
      // Verify the stored articles are still valid (same length and structure)
      if (parsedArticles.length === articles.length) {
        console.log('Using existing shuffled articles from sessionStorage');
        return parsedArticles;
      }
    }
  } catch (error) {
    console.error('Error reading shuffled articles from sessionStorage:', error);
  }

  // Create new shuffle if none exists or is invalid
  console.log('Creating new shuffled articles order');
  const shuffled = shuffleArray(articles);
  try {
    sessionStorage.setItem('shuffled_articles', JSON.stringify(shuffled));
  } catch (error) {
    console.error('Error saving shuffled articles to sessionStorage:', error);
  }
  return shuffled;
};

export default function ArticlesList() {
  const navigate = useNavigate();
  const [shuffledArticles, setShuffledArticles] = useState([]);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setShuffledArticles(getShuffledArticles());
  }, []);

  const handleArticleClick = async (article) => {
    await logArticleVisit(article.id, article.title);
    navigate(`/articles/${article.id}`);
  };

  return (
    <div className="home-options articles-list">
      <div className="articles-grid">
        {shuffledArticles.map(article => (
          <div
            key={article.id}
            className="option-card article-card"
            onClick={() => handleArticleClick(article)}
          >
            <div className="article-card-image">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.imageAlt || article.title}
                />
              )}
            </div>
            <h3 className="article-card-title">{article.title}</h3>
            <div className="article-card-meta">
              {article.source} · {article.section}
            </div>
            <div className="article-card-date">{article.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}