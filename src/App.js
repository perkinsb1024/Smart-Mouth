import { useState, useEffect } from 'react';
import { ALPHABET } from './constants';
import { WORDS } from './words'
import { COMMON_WORDS } from './words_common'

export function Tile({ value, color, setValue }) {
  const isLetter = function(c) {
    if (!c || c.length !== 1) { return false; }
    const code = c.charCodeAt(0);
    return (
      (code >= 'a'.charCodeAt(0) && code <= 'z'.charCodeAt(0))|| 
      (code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0))
    )
  }
  const updateLetter = function(e) {
    let c = (e.key || "").toUpperCase();
    if (isLetter(c)) {
      setValue(c)
    }
  }
  return (
    <div className={`tile ${color}`} tabIndex="0" onKeyDown={updateLetter}>
      {value}
    </div>
  );
}

export function AnswerWord({ word }) {
  return (
    <div className={`answer-word ${word.common ? 'highlighted' : ''}`} onClick={() => window.open(`https://www.google.com/search?q=define%3A${word.word.toLowerCase()}`).focus()}>{word.word}</div>
  )
}

export function WordList({ show, wordList }) {
  if (!show) { return null; }
  return (
    <div className="word-list">
      {wordList.map((word, i) => (
        <AnswerWord word={word} key={i} />
      ))}
    </div>
  );
}

export function PlayerList({ players, setPlayers }) {
  const setScore = function(i, diff) {
    players[i].score = Math.max(0, players[i].score + diff);
    setPlayers([...players]);
  }
  return (
    <>
      <div className="player-list">
        {players.map((player, i) => (
          <div key={i} className="player">
            <div className="name">{player.name || `Player ${i+1}`}</div>
            <div className="score">{player.score}</div>
            <div className="score-buttons">
              <input type="button" value="-1" onClick={() => setScore(i, -1)} />
              <input type="button" value="+1" onClick={() => setScore(i, 1)} />
              <input type="button" value="+2" onClick={() => setScore(i, 2)} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function PlayerEditList({ show, players, setPlayers, setShow }) {
  if (!show) { return null; }
  return (
    <>
      <div className="player-edit-container">
        <div className="player-edit-list">
          {players.map((player, i) => (
            <div key={i}>
              <input type="text" value={player.name} placeholder={`Player ${i+1}`} onChange={(e) => {
                players[i].name = e.target.value;
                setPlayers([...players]);
              }} />
              <input type="button" value="X" onClick={() => {
                if((players[i].name === "" && players[i].score === 0) || confirm(`Are you sure you want to remove player "${player.name || `Player ${i+1}`}"?`)) {
                  players.splice(i, 1);
                  setPlayers([...players]);
                }
              }} />
            </div>
          ))}

          <div>
            <input type="button" value="Add new player" onClick={() => {
              players.push({
                name: "",
                score: 0
              });
              setPlayers([...players]);
            }} />
            <input type="button" value="Done" onClick={() => setShow(false)} />
          </div>
        </div>
      </div>
    </>
  );
}

export function AnswerCount({ n }) {
  return (
    <div className="answer-count">
      There are {n} possible answers
    </div>
  );
}

function buildDictionary() {
  const buildLetterMap = function(words) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let letterIndex = 0;
    let letterChar = letters.charAt(letterIndex);
    const map = {};
    map[letterChar] = {start: 0, end: 0};
    for (let i = 0; i < words.length; i++) {
      if (words[i].charAt(0) === letterChar) { continue; }
      // Next letter found
      map[letterChar].end = i - 1;
      letterIndex++;
      if (letterIndex === letters.length) { break; }
      letterChar = letters.charAt(letterIndex);
      map[letterChar] = {start: i, end: 0};
    }
    map[letterChar].end = words.length - 1;

    return map;
  }
  
  return {
    common: {
      letterMap: buildLetterMap(COMMON_WORDS),
      words: COMMON_WORDS
    },
    all: {
      letterMap: buildLetterMap(WORDS),
      words: WORDS
    }
  }
}

export default function Board() {
  const [startLetter, setStartLetter] = useState('');
  const [endLetter, setEndLetter] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);
  const [editPlayers, setEditPlayers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [minWordLength, setMinWordLength] = useState(4);
  const [players, setPlayers] = useState([{name: "", score: 0}]);
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const [dictionary, setDictionary] = useState({});

  function deal() {
    let start = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    let end = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    setStartLetter(start);
    setEndLetter(end);
    setShowAnswers(false);
  }

  function isCommon(word) {
    let w = word.toLowerCase();
    // Todo: replace with binary search
    for (let i = dictionary.common.letterMap[w.charAt(0)].start; i <= dictionary.common.letterMap[w.charAt(0)].end; i++) {
      if (dictionary.common.words[i] === w) { return true; }
    }
    return false;
  }

  function buildWordList() {
    if (!startLetter || !endLetter) { return []; }
    let wordList = [];
    let minLength = parseInt(minWordLength);
    if (isNaN(minLength)) { minLength = 0; }
    
    for (let i = dictionary.all.letterMap[startLetter.toLowerCase()].start; i <= dictionary.all.letterMap[startLetter.toLowerCase()].end; i++) {
      let w = dictionary.all.words[i].toUpperCase();
      if (w.length < minWordLength) { continue; }
      if (w.charAt(0) === startLetter && w.charAt(w.length-1) === endLetter) {
        wordList.push({
          word: w,
          common: isCommon(w)
        });
      }
    }
    return wordList;
  }

  useEffect(() => {
    setAnswers(buildWordList());
  }, [startLetter, endLetter, minWordLength]);

  useEffect(() => {
    if (hasLoadedState) {
      localStorage.setItem("players", JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("players"));
    if (p) {
      setPlayers(p);
      if (p.length <= 1) { setEditPlayers(true); }
    } else {
      setEditPlayers(true);
    }
    setHasLoadedState(true);
    setDictionary(buildDictionary());
  }, []);

  if(!hasLoadedState) { return null; }

  return (
    <>
      <title>Smart Mouth</title>
      <div class="container">
        <div className="tile-container">
          <Tile value={startLetter} color="orange" setValue={setStartLetter} />
          <Tile value={endLetter} color="green" setValue={setEndLetter} />
        </div>
        <div className="controls">
          <button onClick={deal}>Deal</button>
          <button onClick={() => { setShowAnswers(!showAnswers); }}>{showAnswers ? 'Hide' : 'Show'} Answer List</button>
          <button onClick={() => { setEditPlayers(!editPlayers); }}>Add or Remove Players</button>
          <button onClick={() => { 
            if (confirm("Are you sure you want to reset all scores?")) {
              players.forEach(player => {
                player.score = 0;
              });
              setPlayers([...players]);
            }
          }}>Reset Scores</button>
          <div className="break" />
          <div>
            Minimum Word Length: <input type="number" min="1" max="20" value={minWordLength} onChange={e => setMinWordLength(e.target.value)} />
          </div>
        </div>
        <div>
          <PlayerList players={players} setPlayers={setPlayers} />
        </div>
        <div>
          <AnswerCount n={answers.length} />
        </div>
        <div>
          <WordList show={showAnswers} wordList={answers} />
        </div>
        <div>
          <PlayerEditList show={editPlayers} players={players} setPlayers={setPlayers} setShow={setEditPlayers} />
        </div>
      </div>
    </>
  )
}
