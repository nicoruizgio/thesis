import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import Chatbot from '../components/Chatbot'
import UserInfoForm from '../components/UserInfoForm'

function YouTubePlayerPage() {
  const [videoId, setVideoId] = useState('')

  useEffect(() => {
    async function fetchTranscript() {
      if (!videoId) return;
      try {
        await fetch(`http://localhost:5000/api/transcript/${videoId}`);
      } catch (error) {
        console.error('Error fetching transcript:', error);
      }
    }
    fetchTranscript();
  }, [videoId]);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">YouTube Player</h1>
          <div className="header-search">
            <SearchBar setVideoId={setVideoId} />
          </div>
        </header>
        <main className="main" style={{ alignItems: "flex-start" }}>
          <div className="left-column">
            <div className="video-container">
              <iframe
                className="video-player"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

          </div>
          <div className="right-column">
            {videoId &&
            <Chatbot videoId={videoId} />
            }
          </div>
        </main>
      </div>
    </div>
  )
}

export default YouTubePlayerPage