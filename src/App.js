import { useState, useEffect } from 'react';
import { ALPHABET } from './constants';
import { WORDS } from './words'
import { COMMON_WORDS } from './words_common'
import { Tile } from './components/Tile'
import { WordList } from './components/WordList'
import { PlayerList } from './components/PlayerList'
import { HelpDialog } from './components/HelpDialog'
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
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
      if (p.length <= 1) { setShowSettings(true); }
    } else {
      setShowSettings(true);
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
        <div className="help-button" onClick={() => { setShowHelp(true); }}>
          <svg height="28px" width="28px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path class="st0" d="M256,0C114.616,0,0,114.612,0,256s114.616,256,256,256s256-114.612,256-256S397.385,0,256,0z M207.678,378.794   c0-17.612,14.281-31.893,31.893-31.893c17.599,0,31.88,14.281,31.88,31.893c0,17.595-14.281,31.884-31.88,31.884   C221.959,410.678,207.678,396.389,207.678,378.794z M343.625,218.852c-3.596,9.793-8.802,18.289-14.695,25.356   c-11.847,14.148-25.888,22.718-37.442,29.041c-7.719,4.174-14.533,7.389-18.769,9.769c-2.905,1.604-4.479,2.95-5.256,3.826   c-0.768,0.926-1.029,1.306-1.496,2.826c-0.273,1.009-0.558,2.612-0.558,5.091c0,6.868,0,12.512,0,12.512   c0,6.472-5.248,11.728-11.723,11.728h-28.252c-6.475,0-11.732-5.256-11.732-11.728c0,0,0-5.645,0-12.512   c0-6.438,0.752-12.744,2.405-18.777c1.636-6.008,4.215-11.718,7.508-16.694c6.599-10.083,15.542-16.802,23.984-21.48   c7.401-4.074,14.723-7.455,21.516-11.281c6.789-3.793,12.843-7.91,17.302-12.372c2.988-2.975,5.31-6.05,7.087-9.52   c2.335-4.628,3.955-10.067,3.992-18.389c0.012-2.463-0.698-5.702-2.632-9.405c-1.926-3.686-5.066-7.694-9.264-11.29   c-8.45-7.248-20.843-12.545-35.054-12.521c-16.285,0.058-27.186,3.876-35.587,8.62c-8.36,4.776-11.029,9.595-11.029,9.595   c-4.268,3.718-10.603,3.85-15.025,0.314l-21.71-17.397c-2.719-2.173-4.322-5.438-4.396-8.926c-0.063-3.479,1.425-6.81,4.061-9.099   c0,0,6.765-10.43,22.451-19.38c15.62-8.992,36.322-15.488,61.236-15.429c20.215,0,38.839,5.562,54.268,14.661   c15.434,9.148,27.897,21.744,35.851,36.876c5.281,10.074,8.525,21.43,8.533,33.38C349.211,198.042,347.248,209.058,343.625,218.852   z"/>
          </svg>
        </div>
        <div className="settings-button" onClick={() => { setShowSettings(true); }}>
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
          <AnswerCount n={answers.length} showAnswers={showAnswers} setShowAnswers={setShowAnswers} />
        </div>
        <div>
          <WordList show={showAnswers} wordList={answers} />
        </div>
        <div>
          <WordChecker wordList={answers} show={!showAnswers && answers.length} />
        </div>
        <div>
          <HelpDialog show={showHelp} setShow={setShowHelp} setShowSettings={setShowSettings} />
        </div>
        <div>
          <Settings show={showSettings} players={players} setPlayers={setPlayers} setShow={setShowSettings} minWordLength={minWordLength} setMinWordLength={setMinWordLength} useCountdown={useCountdown} setUseCountdown={setUseCountdown} />
        </div>
        <div>
          <Countdown timer={timer} setTimer={setTimer} action={deal} />
        </div>
      </div>
    </>
  )
}
