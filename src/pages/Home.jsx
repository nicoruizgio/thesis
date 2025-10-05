import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleArticlesClick = () => {
    navigate("/articles");
  };

  return (
    <div className="home-options">
      <div
        className="option-card"
        onClick={handleArticlesClick}
      >
        <h2>News Articles</h2>
        <p>Browse articles and ask questions</p>
      </div>
    </div>
  );
}