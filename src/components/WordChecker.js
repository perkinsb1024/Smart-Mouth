import { useState, useEffect } from 'react'; 

export function WordChecker({ wordList }) {
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        setAnswer('');
      }, [wordList]);

    const validWord = function(answer) {
        return wordList.some((w) => w.word === answer.toUpperCase());
    }

    const valid = (
        <svg className="valid" width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12.3333L10.4615 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    const invalid = (
        <svg className="invalid" width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    if (wordList.length === 0) { return null; }

    return (
        <div className="word-checker">
            <input placeholder="Check an answer" value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase())} />
            {answer.length ? (validWord(answer) ? valid : invalid) : null}
        </div>
    )
}