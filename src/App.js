import { useState, useEffect } from 'react';
import { ALPHABET } from './constants';
import { WORDS } from './words'
import { COMMON_WORDS } from './words_common'
import { Tile } from './components/Tile'
import { WordList } from './components/WordList'
import { PlayerList } from './components/PlayerList'
import { Settings } from './components/Settings';
import { AnswerCount } from './components/AnswerCount';
import { Countdown } from './components/Countdown';
import { WordChecker } from './components/WordChecker';
import "./styles.css";

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
  const [useCountdown, setUseCountdown] = useState(true);
  const [timer, setTimer] = useState(-1);

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
    if (startLetter && endLetter && answers.length === 0) { console.log(startLetter); deal(); }
  }, [answers]);

  useEffect(() => {
    if (hasLoadedState) {
      localStorage.setItem("players", JSON.stringify(players));
      localStorage.setItem("useCountdown", JSON.stringify(useCountdown));
      localStorage.setItem("minWordLength", JSON.stringify(minWordLength));
    }
  }, [players, useCountdown, minWordLength]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("players"));
    if (p) {
      setPlayers(p);
      if (p.length <= 1) { setEditPlayers(true); }
    } else {
      setEditPlayers(true);
    }
    const c = JSON.parse(localStorage.getItem("useCountdown"));
    if (c !== null) {
      setUseCountdown(c)
    }
    const mw = JSON.parse(localStorage.getItem("minWordLength"));
    if (mw !== null) {
      setMinWordLength(mw)
    }
    setHasLoadedState(true);
    setDictionary(buildDictionary());
  }, []);

  if(!hasLoadedState) { return null; }

  return (
    <>
      <title>Smart Mouth</title>
      <div className="container">
        <div className="settings-button" onClick={() => { setEditPlayers(!editPlayers); }}>
          <svg height="32px" width="32px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path className="st0" d="M497.569,215.166l-55.345-13.064c-4.032-13.946-9.495-27.27-16.376-39.732l29.85-48.303   c4.57-7.397,3.452-16.946-2.688-23.086l-31.99-31.99c-6.129-6.129-15.678-7.248-23.076-2.678l-48.292,29.851   c-12.462-6.882-25.785-12.344-39.732-16.377l-13.064-55.368C294.856,5.978,287.306,0,278.63,0h-45.237   c-8.678,0-16.227,5.978-18.227,14.419l-13.064,55.368c-13.946,4.032-27.27,9.484-39.732,16.377l-48.303-29.872   c-7.387-4.549-16.946-3.441-23.086,2.699L58.99,90.97c-6.13,6.14-7.248,15.709-2.689,23.087l29.862,48.313   c-6.882,12.462-12.344,25.786-16.367,39.721l-55.378,13.065C5.978,217.165,0,224.704,0,233.392v45.226   c0,8.678,5.978,16.237,14.419,18.226l55.378,13.065c4.032,13.946,9.485,27.259,16.367,39.71l-29.872,48.324   c-4.549,7.398-3.441,16.957,2.699,23.098l31.979,31.979c6.14,6.14,15.709,7.257,23.087,2.688l48.323-29.872   c12.463,6.882,25.786,12.344,39.722,16.366l13.064,55.366c2,8.463,9.549,14.431,18.227,14.431h45.237   c8.677,0,16.226-5.968,18.226-14.431l13.064-55.366c13.937-4.021,27.259-9.484,39.712-16.366l48.312,29.861   c7.398,4.57,16.947,3.452,23.087-2.688l31.989-31.99c6.13-6.129,7.248-15.688,2.678-23.087l-29.861-48.302   c6.893-12.452,12.345-25.774,16.377-39.721l55.366-13.065c8.463-2.001,14.42-9.539,14.42-18.226v-45.238   C512,224.714,506.032,217.165,497.569,215.166z M256.006,303.103c-26.002,0-47.098-21.097-47.098-47.108   s21.097-47.108,47.098-47.108c26.011,0,47.108,21.097,47.108,47.108S282.017,303.103,256.006,303.103z"/>
          </svg>
        </div>
        <div className="tile-container">
          <Tile value={startLetter} color="orange" setValue={setStartLetter} />
          <Tile value={endLetter} color="green" setValue={setEndLetter} />
        </div>
        <div className="controls">
          <button disabled={timer > 0} onClick={() => {
            if (useCountdown) {
              setStartLetter('');
              setEndLetter('');
              setTimer(3);
            } else {
              deal();
            }
          }}>Deal</button>
        </div>
        <div>
          <PlayerList players={players} setPlayers={setPlayers} />
        </div>
        <div>
          <WordChecker wordList={answers} />
        </div>
        <div>
          <AnswerCount n={answers.length} showAnswers={showAnswers} setShowAnswers={setShowAnswers} />
        </div>
        <div>
          <WordList show={showAnswers} wordList={answers} />
        </div>
        <div>
          <Settings show={editPlayers} players={players} setPlayers={setPlayers} setShow={setEditPlayers} minWordLength={minWordLength} setMinWordLength={setMinWordLength} useCountdown={useCountdown} setUseCountdown={setUseCountdown} />
        </div>
        <div>
          <Countdown timer={timer} setTimer={setTimer} action={deal} />
        </div>
      </div>
    </>
  )
}
