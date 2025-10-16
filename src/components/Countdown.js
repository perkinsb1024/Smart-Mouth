import { useState, useEffect } from 'react'; 

export function Countdown({ timer, setTimer, action }) {
    const [start, setStart] = useState(true);
    useEffect(() => {
      if (timer === 0) { action(); }
    }, [timer]);
  
    if (timer > 0) {
      if (start) {
        setTimeout(() => {
          setStart(false);
        }, 10);
      }
      setTimeout(() => {
        setTimer(timer - 1)
        setStart(true);
      }, 750);
      return (
        <div className={`countdown ${start ? "start" : "end"}`}>
          {timer}
        </div>
      )
    } else {
      return null;
    }
  }