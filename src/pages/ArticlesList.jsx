import { useNavigate } from "react-router-dom";
import { articles } from "../data/articles";
import { logArticleVisit } from "../utils/supabaseLogger";
import "./Home.css";
import "./articles.css";

const DESIRED_ORDER = ["art-005", "art-002", "art-003", "art-001", "art-004"];

const getArticlesInOrder = () => {
  const byId = new Map(articles.map(a => [a.id, a]));
  const main = DESIRED_ORDER.map(id => byId.get(id)).filter(Boolean);
  const extras = articles.filter(a => !DESIRED_ORDER.includes(a.id));
  return [...main, ...extras];
};

export default function ArticlesList() {
  const navigate = useNavigate();
  const orderedArticles = getArticlesInOrder();

  const handleArticleClick = async (article) => {
    await logArticleVisit(article.id, article.title);
    navigate(`/articles/${article.id}`);
  };

  return (
    <div className="home-options articles-list">
      <div className="articles-grid">
        {orderedArticles.map(article => (
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