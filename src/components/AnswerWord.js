import { useState } from 'react';

export function AnswerWord({ word }) {
  const [showLookup, setShowLookup] = useState(false);
  return (
    <div className="answer-word-container" tabIndex="0" onFocus={() => setShowLookup(true)} onBlur={() => setShowLookup(false)} onMouseOver={() => setShowLookup(true)} onMouseOut={() => setShowLookup(false)}>
      <div className={`word-lookup ${showLookup ? '' : 'hidden'}`} onClick={() => window.open(`https://www.google.com/search?q=define%3A${word.word.toLowerCase()}`).focus()}>
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14M11 13L20 4M20 4V9M20 4H15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      </div>
      <div className={`answer-word ${word.common ? 'highlighted' : ''}`}>{word.word}</div>
    </div>
  )
}