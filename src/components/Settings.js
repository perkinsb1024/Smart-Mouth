export function Settings({ show, players, setPlayers, setShow, minWordLength, setMinWordLength, useCountdown, setUseCountdown }) {
  if (!show) { return null; }
  return (
    <>
      <div className="settings-container">
        <div className="settings">
          <div className="container player-edit-list">
            {players.map((player, i) => (
              <div key={i} className="player-row">
                <input type="text" value={player.name} placeholder={`Player ${i+1}`} onChange={(e) => {
                  player.name = e.target.value;
                  setPlayers([...players]);
                }} />
                <div className={`remove-player-button ${players.length === 1 ? 'disabled' : ''}`} onClick={() => {
                  if (players.length === 1) { return; }
                  if((player.name === "" && player.score === 0) || confirm(`Are you sure you want to remove player "${player.name || `Player ${i+1}`}"?`)) {
                    players.splice(i, 1);
                    setPlayers([...players]);
                  }
                }}>
                  <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="Vector" d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
            <input type="button" value="Add new player" onClick={() => {
              players.push({
                name: "",
                score: 0
              });
              setPlayers([...players]);
            }} />
          </div>

          <div className="container reset-scores">
            <input type="button" onClick={() => { 
                if (confirm("Are you sure you want to reset all scores?")) {
                  players.forEach(player => {
                    player.score = 0;
                  });
                  setPlayers([...players]);
                }
              }} value="Reset Scores" />
          </div>

          <div className="container min-word-length">
            <div>Minimum Word Length</div>
            <div><input type="number" min="1" max="20" value={minWordLength} onFocus={(e) => {e.target.select()}} onChange={e => setMinWordLength(e.target.value)} /></div>
          </div>

          <div className="container use-countdown">
            <div>Use Countdown Timer</div>
            <div>
              <input type="checkbox" onChange={() => { 
                  setUseCountdown(!useCountdown)
                }} checked={useCountdown} />
            </div>
          </div>

          <div className="container done">
            <input type="button" value="Done" onClick={() => setShow(false)} />
          </div>
        </div>
      </div>
    </>
  );
}