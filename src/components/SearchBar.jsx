import React, { useState } from "react";
import extractVideoId from "../utils/extractVideoId";
import "./SearchBar.css";

const SearchBar = ({ setVideoId }) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(input);
    if (id) setVideoId(id);
  };

  return (
    <form className="searchbar-form" onSubmit={handleSubmit}>
      <input
        className="searchbar-input"
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Paste YouTube video URL"
      />
      <button className="searchbar-button" type="submit">
        Play
      </button>
    </form>
  );
};

export default SearchBar;
