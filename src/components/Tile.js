import { useState } from 'react';

export function Tile({ value, color, setValue }) {
  const [selected, setSelected] = useState(false);
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
    } else if (c === "BACKSPACE") {
      setValue('')
    }
  }
  return (
    <>
      <input type="text" className="tile-hidden-input" id={`tile-hidden-input-${color}`} value={value} onKeyDown={updateLetter} onFocus={() => setSelected(true)} onBlur={() => setSelected(false)} />
      <div className={`tile ${color} ${selected ? 'selected' : ''}`} onClick={() => document.getElementById(`tile-hidden-input-${color}`).focus()}>
        {value}
      </div>
    </>
  );
}