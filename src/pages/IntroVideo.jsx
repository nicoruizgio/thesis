import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroVideo.css';

export default function IntroVideo() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/articles');
  };

  return (
    <div className="intro-video-page">
      <div className="intro-center">
        <div className="intro-video-frame">
          <video
            src="/demo1.mp4"
            controls
            className="intro-video"
          />
        </div>

        <button className="intro-continue-button" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}